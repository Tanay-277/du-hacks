import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Configure CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware to validate request
const validateRequest = (req, res, next) => {
  const { medicineIds, email } = req.body;
  
  if (!Array.isArray(medicineIds) || medicineIds.length === 0) {
    return res.status(400).json({ error: "Invalid medicine selection" });
  }
  
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  
  next();
};

app.post('/payment', validateRequest, async (req, res) => {
  const { medicineIds, email } = req.body;

  try {
    // Get medicines data from your database instead of localStorage
    // This is just for demonstration - in production, NEVER use localStorage on the server
    const storedMedicines = JSON.parse(process.env.MEDICINES || "[]");
    const selectedMedicines = storedMedicines.filter(med => medicineIds.includes(med.id));

    if (selectedMedicines.length === 0) {
      return res.status(404).json({ error: "Medicines not found" });
    }

    const lineItems = selectedMedicines.map(med => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: med.name,
          description: med.description // Optional: Add if you have descriptions
        },
        unit_amount: Math.round(parseFloat(med.price) * 100), // Convert to paise and ensure it's an integer
      },
      quantity: 1
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/success`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/cancel`,
      customer_email: email,
      metadata: {
        medicineIds: JSON.stringify(medicineIds) // Store order details in metadata
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating payment session:', error);
    res.status(500).json({ 
      error: 'Failed to create payment session',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Success and cancel routes should be handled on the frontend
// These routes are just fallbacks
app.get('/success', (req, res) => {
  res.redirect(process.env.FRONTEND_URL || "http://localhost:5173");
});

app.get('/cancel', (req, res) => {
  res.redirect(process.env.FRONTEND_URL || "http://localhost:5173");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));