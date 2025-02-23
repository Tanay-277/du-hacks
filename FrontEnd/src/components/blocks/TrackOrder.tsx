import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function TrackOrder() {
  const { trackingId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trackingId) return;

    const fetchOrder = async () => {
      try {
        const response = await fetch(`http://localhost:3000/track/${trackingId}`);
        if (!response.ok) throw new Error("Order not found");
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 5000); // Polling every 5 seconds
    return () => clearInterval(interval);
  }, [trackingId]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Order Tracking</h1>
      {error && <p className="text-red-500">{error}</p>}
      {order && (
        <div className="mt-4">
          <p><strong>Status:</strong> {order.status}</p>
          <ul className="list-disc ml-6">
            {order.items.map((item: any, index: number) => (
              <li key={index}>{item.name} - ₹{item.price}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
