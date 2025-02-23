import React from "react";
import { Button } from "@/components/ui/button";

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
}

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <div className="border rounded-lg p-4 shadow-sm">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md" />
            <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-500">${product.price.toFixed(2)}</p>
            <Button className="mt-2 w-full">Add to Cart</Button>
        </div>
    );
};

export default ProductCard;
