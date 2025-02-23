import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CartItem {
    id: number;
    name: string;
    price: number;
}

export default function Cart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    return (
        <div className="p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
            {cartItems.length === 0 ? (
                <p>No items in cart.</p>
            ) : (
                cartItems.map(item => (
                    <div key={item.id} className="flex justify-between">
                        <span>{item.name}</span>
                        <span>${item.price.toFixed(2)}</span>
                    </div>
                ))
            )}
            <Button className="mt-4 w-full">Checkout</Button>
        </div>
    );
}
