import axios from 'axios' 

export default function Stripe() {

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
        <br />
        <button onClick={() => {
          purchase(1)
        }} className='bg-red-600'>Continue to Pay</button>
    </div>
  )
}
