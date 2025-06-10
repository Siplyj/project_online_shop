const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Stripe = require('stripe');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// AWS config
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const dynamo = new AWS.DynamoDB.DocumentClient();

// CORS
app.use(cors({ origin: 'http://localhost:5173' }));

// Webhook — BEFORE express.json()
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const orderId = session.metadata.orderId;

    try {
      const existing = await dynamo.get({
        TableName: 'Orders',
        Key: { userId, orderId },
      }).promise();

      if (!existing.Item) {
        console.warn(`Order with ID ${orderId} not found in the database`);
        return res.status(404).end();
      }

      if (existing.Item.status === 'paid') {
        return res.status(200).end();
      }

      await dynamo.update({
        TableName: 'Orders',
        Key: { userId, orderId },
        UpdateExpression: 'set #s = :s, amount = :amount',
        ExpressionAttributeNames: { '#s': 'status' },
        ExpressionAttributeValues: {
          ':s': 'paid',
          ':amount': session.amount_total,
        },
      }).promise();

      return res.status(200).end();
    } catch (err) {
      console.error('Error at checkout:', err);
      return res.status(500).end();
    }
  }

  res.status(200).end();
});

app.use(express.json());

// Order ID generation
app.post('/generate-order-id', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'orderId is mandatory' });
  }

  try {
    const counterRes = await dynamo.update({
      TableName: 'Counters',
      Key: { counterName: 'orderNumber' },
      UpdateExpression: 'ADD currentValue :inc',
      ExpressionAttributeValues: { ':inc': 1 },
      ReturnValues: 'UPDATED_NEW',
    }).promise();

    const sequential = String(counterRes.Attributes.currentValue).padStart(6, '0');
    const orderId = `NEWTONE-${sequential}`;

    res.json({ orderId });
  } catch (e) {
    console.error('Generation error orderId:', e);
    res.status(500).json({ error: e.message });
  }
});


// Creating a Stripe session + order pre-recording
app.post('/create-checkout-session', async (req, res) => {
  const { cartItems, userId, formData, orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: 'orderId is mandatory' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: cartItems.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/cancel',
      metadata: { userId, orderId },
    });

    const existingOrder = await dynamo.get({
      TableName: 'Orders',
      Key: { userId, orderId },
    }).promise();

    let orderNumber;

    // If there is no such order in the Orders table yet
    if (!existingOrder.Item) {
      await dynamo.put({
        TableName: 'Orders',
        Item: {
          userId,
          orderId,
          orderNumber,
          status: 'Not paid',
          cartItems,
          fullName: formData?.fullName || '',
          email: formData?.email || '',
          phone: formData?.phone || '',
          address: formData?.address || '',
          city: formData?.city || '',
          zip: formData?.zip || '',
          createdAt: new Date().toISOString(),
        },
      }).promise();
    } else {
      orderNumber = existingOrder.Item.orderNumber;
    }

    res.json({ url: session.url, orderNumber, orderId });
  } catch (e) {
    console.error('Error creating a session:', e);
    res.status(500).json({ error: e.message });
  }
});

// Receiving user orders
app.get('/orders/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const data = await dynamo.query({
      TableName: 'Orders',
      KeyConditionExpression: 'userId = :uid',
      ExpressionAttributeValues: { ':uid': userId },
    }).promise();

    res.json(data.Items);
  } catch (err) {
    console.error('Error receiving orders:', err);
    res.status(500).json({ error: 'Failed to receive orders' });
  }
});

app.listen(4242, () => console.log('The server is running on http://localhost:4242'));