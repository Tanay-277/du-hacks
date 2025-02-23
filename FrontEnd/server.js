import express from 'express';
import cors from 'cors';
import Stripe from 'stripe'; 
import dotenv from 'dotenv';

dotenv.config(); 

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
}));

app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Sample medicines data
const medicines = [
    { id: 1, name: "Paracetamol", price: 50, description: "Pain reliever and a fever reducer." },
    { id: 2, name: "Ibuprofen", price: 75, description: "Nonsteroidal anti-inflammatory drug." },
    { id: 3, name: "Amoxicillin", price: 150, description: "Antibiotic used to treat bacterial infections." },
];

app.get('/', (req, res) => {
    res.send("Medico");
});

// Endpoint to get all medicines
app.get('/medicines', (req, res) => {
    res.json(medicines);
});

// Payment endpoint
app.post('/payment', async (req, res) => {
    const { medicineId, email } = req.body;

    // Find the selected medicine
    const medicine = medicines.find(med => med.id === medicineId);
    if (!medicine) {
        return res.status(404).json({ error: 'Medicine not found' });
    }

    try {
        // Create a product in Stripe for the selected medicine
        const product = await stripe.products.create({
            name: medicine.name,
            description: medicine.description,
        });

        // Create a price for the product
        const price = await stripe.prices.create({
            product: product.id,
            unit_amount: medicine.price * 100, // Convert INR to paise
            currency: 'inr',
        });

        // Create a checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: price.id,
                    quantity: 1,
                }
            ],
            mode: 'payment',
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel',
            customer_email: email || 'demo@gmail.com', // Optional email field
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating payment session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
