import React from "react";
import ProductCard from "./ProductCard";

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
}

const products: Product[] = [
    { id: 1, name: "Paracetamol", price: 29.99, image: "https://via.placeholder.com/150" },
    { id: 2, name: "Ibuprofen", price: 39.99, image: "https://via.placeholder.com/150" },
    { id: 3, name: "Aspirin", price: 19.99, image: "https://via.placeholder.com/150" },
    { id: 4, name: "Cough Syrup", price: 49.99, image: "https://via.placeholder.com/150" },
];

const Store: React.FC = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Shop Medicines</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Store;
