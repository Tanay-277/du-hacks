import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173", methods: ["GET", "POST"] }));
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const medicines = [
    { id: 1, name: "Paracetamol", price: 50 },
    { id: 2, name: "Ibuprofen", price: 75 },
    { id: 3, name: "Amoxicillin", price: 150 }
];

app.post('/payment', async (req, res) => {
    const { medicineIds, email } = req.body;

    if (!Array.isArray(medicineIds) || medicineIds.length === 0) {
        return res.status(400).json({ error: "Invalid medicine selection" });
    }

    // Get selected medicines
    const selectedMedicines = medicines.filter(med => medicineIds.includes(med.id));

    if (selectedMedicines.length === 0) {
        return res.status(404).json({ error: "Medicines not found" });
    }

    // Create line items for Stripe
    const lineItems = selectedMedicines.map(med => ({
        price_data: {
            currency: 'inr',
            product_data: { name: med.name },
            unit_amount: med.price * 100, // Convert to paise
        },
        quantity: 1
    }));

    // Generate invoice HTML (this can be improved)
    const invoiceHTML = `
        <h2>Invoice</h2>
        <p>Customer: ${email || 'Guest'}</p>
        <table border="1">
            <tr><th>Medicine</th><th>Price</th></tr>
            ${selectedMedicines.map(med => `<tr><td>${med.name}</td><td>₹${med.price}</td></tr>`).join('')}
        </table>
        <h3>Total: ₹${selectedMedicines.reduce((sum, med) => sum + med.price, 0)}</h3>
    `;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel',
            metadata: { invoice: invoiceHTML }, // Store invoice in Stripe metadata
            customer_email: email || 'demo@gmail.com',
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating payment session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/success' , (req, res)=> {
    res.redirect("http://localhost:5173")
})

app.get('/cancel' , (req, res)=> {
    res.redirect("http://localhost:5173")
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
