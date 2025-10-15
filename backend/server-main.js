const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const AWS = require('aws-sdk');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

dotenv.config();
const app = express();
const dynamo = new AWS.DynamoDB.DocumentClient();

app.use(cors({ origin: 'https://localhost:5173' }));
app.use(express.json());

app.post('/generate-order-id', async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'orderId is mandatory' });

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
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.post('/create-checkout-session', async (req, res) => {
  const { cartItems, userId, formData, orderId } = req.body;
  if (!orderId) return res.status(400).json({ error: 'orderId is mandatory' });

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
      success_url: 'https://localhost:5173/success',
      cancel_url: 'https://localhost:5173/cancel',
      metadata: { userId, orderId },
    });

    const existingOrder = await dynamo.get({
      TableName: 'Orders',
      Key: { userId, orderId },
    }).promise();

    if (!existingOrder.Item) {
      await dynamo.put({
        TableName: 'Orders',
        Item: {
          userId,
          orderId,
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
    }

    res.json({ url: session.url, orderId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.get('/orders/:userId', async (req, res) => {
  try {
    const data = await dynamo.query({
      TableName: 'Orders',
      KeyConditionExpression: 'userId = :uid',
      ExpressionAttributeValues: { ':uid': req.params.userId },
    }).promise();
    res.json(data.Items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to receive orders' });
  }
});

app.get('/favorites/:userId', async (req, res) => {
  try {
    const data = await dynamo.query({
      TableName: 'UserFavorites',
      KeyConditionExpression: 'userId = :uid',
      ExpressionAttributeValues: { ':uid': req.params.userId },
    }).promise();
    res.json(data.Items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

app.post('/favorites/add', async (req, res) => {
  const { userId, product } = req.body;
  if (!userId || !product?.id || !product?.size)
    return res.status(400).json({ error: 'Invalid data' });

  const productKey = `${product.id}_${product.size}`;

  try {
    const existing = await dynamo.get({
      TableName: 'UserFavorites',
      Key: { userId, productId: productKey },
    }).promise();

    if (existing.Item) return res.status(200).json({ message: 'Already in favorites' });

    await dynamo.put({
      TableName: 'UserFavorites',
      Item: { userId, productId: productKey, ...product },
    }).promise();

    res.status(200).json({ message: 'Added to favorites' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

app.post('/favorites/remove', async (req, res) => {
  const { userId, productId } = req.body;
  if (!userId || !productId) return res.status(400).json({ error: 'Invalid data' });

  try {
    await dynamo.delete({
      TableName: 'UserFavorites',
      Key: { userId, productId },
    }).promise();
    res.status(200).json({ message: 'Removed from favorites' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

module.exports.handler = serverless(app, {
  request: (req, event) => {
    if (req.url === '/webhook') {
      req.body = Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8');
    }
  },
});

// Local server
if (process.env.IS_LOCAL) {
  app.listen(3000, () => console.log('Server running on https://localhost:3000'));
}