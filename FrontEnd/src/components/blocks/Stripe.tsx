import { useState } from "react";

export default function Stripe() {
    const [selectedMedicines, setSelectedMedicines] = useState<number[]>([]);
    
    const purchase = async (medicineId: number) => {
        try {
            const response = await fetch("http://localhost:3000/payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ medicineId }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url; // Redirect to Stripe checkout
            }
        } catch (error) {
            console.error("Error processing payment:", error);
        }
    };
    

    return (
        <div>
            <h2>Select Medicines:</h2>
            <label>
                <input type="checkbox" onChange={(e) => {
                    if (e.target.checked) {
                        setSelectedMedicines([...selectedMedicines, 1]);
                    } else {
                        setSelectedMedicines(selectedMedicines.filter(id => id !== 1));
                    }
                }} /> Paracetamol
            </label>
            <br />
            <label>
                <input type="checkbox" onChange={(e) => {
                    if (e.target.checked) {
                        setSelectedMedicines([...selectedMedicines, 2]);
                    } else {
                        setSelectedMedicines(selectedMedicines.filter(id => id !== 2));
                    }
                }} /> Ibuprofen
            </label>
            <br />
            <label>
                <input type="checkbox" onChange={(e) => {
                    if (e.target.checked) {
                        setSelectedMedicines([...selectedMedicines, 3]);
                    } else {
                        setSelectedMedicines(selectedMedicines.filter(id => id !== 3));
                    }
                }} /> Amoxicillin
            </label>
            <br />
            <h3>Invoice Preview</h3>
            <ul>
                {selectedMedicines.map(id => {
                    const med = medicines.find(m => m.id === id);
                    return <li key={id}>{med?.name} - ₹{med?.price}</li>;
                })}
            </ul>

            <button onClick={() => purchase(2)} className='bg-red-600'>Continue to Pay</button>
        </div>
    );
}

const medicines = [
    { id: 1, name: "Paracetamol", price: 50 },
    { id: 2, name: "Ibuprofen", price: 75 },
    { id: 3, name: "Amoxicillin", price: 150 },
];
