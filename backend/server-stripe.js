const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const Stripe = require('stripe');
const AWS = require('aws-sdk');

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const dynamo = new AWS.DynamoDB.DocumentClient();

app.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  async (req, res) => {
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
          console.warn(`Order with ID ${orderId} not found`);
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

        console.log(`Payment confirmed for order ${orderId}`);
        return res.status(200).end();
      } catch (err) {
        console.error('Error processing checkout session:', err);
        return res.status(500).end();
      }
    }

    res.status(200).end();
  }
);

module.exports.handler = serverless(app);