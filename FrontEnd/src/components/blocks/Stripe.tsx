import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import  supabase  from "@/utils/supaBaseClient";

interface Medicine {
  id: string;
  name: string;
  price: number;
}

export default function Stripe() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const storedMedicines = JSON.parse(localStorage.getItem("cart") || "[]");
    setMedicines(storedMedicines);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        console.log(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const calculateTotal = () => {
    return selectedMedicines.reduce((total, id) => {
      const med = medicines.find(m => m.id === id);
      return total + (med?.price || 0);
    }, 0);
  };

  const purchase = async () => {
    if (selectedMedicines.length === 0) {
      setError("Please select at least one medicine");
      return;
    }

    setLoading(true);
    setError(null);
    
    console.log(selectedMedicines);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const email = user?.email || "customer@example.com";

      const response = await fetch("http://localhost:3000/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicineIds: selectedMedicines,
          email
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setError("Failed to process payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Select Medicines</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-2 mb-6">
        {medicines.length > 0 ? medicines.map((med) => (
          <label key={med.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
            <input
              type="checkbox"
              className="form-checkbox"
              onChange={(e) => {
                setSelectedMedicines(prev => 
                  e.target.checked
                    ? [...prev, med.id]
                    : prev.filter(id => id !== med.id)
                );
              }}
              checked={selectedMedicines.includes(med.id)}
            />
            <span>{med.name} - ₹{med.price}</span>
          </label>
        )) : (
          <p className="text-gray-500">No medicines found</p>
        )}
      </div>

      {selectedMedicines.length > 0 && (
        <div className="border-t pt-4 mb-6">
          <h3 className="text-xl font-semibold mb-2">Invoice Preview</h3>
          <ul className="space-y-2">
            {selectedMedicines.map(id => {
              const med = medicines.find(m => m.id === id);
              return (
                <li key={id} className="flex justify-between">
                  <span>{med?.name}</span>
                  <span>₹{med?.price}</span>
                </li>
              );
            })}
            <li className="border-t pt-2 font-bold flex justify-between">
              <span>Total</span>
              <span>₹{calculateTotal()}</span>
            </li>
          </ul>
        </div>
      )}

      <Button
        onClick={purchase}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        disabled={loading || selectedMedicines.length === 0}
      >
        {loading ? "Processing..." : "Continue to Payment"}
      </Button>
    </div>
  );
}