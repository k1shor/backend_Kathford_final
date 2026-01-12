// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


exports.processPayment = async (req, res) => {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: 'npr',
    });
    return res.json({client_secret: paymentIntent.client_secret})
}

exports.sendStripeAPI = (req, res) => {
    return res.json({stripekey: process.env.STRIPE_API_KEY})
}