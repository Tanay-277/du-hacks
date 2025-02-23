import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
}

const products: Product[] = [
    { id: 1, name: 'Product 1', price: 29.99, image: 'path/to/image1.jpg' },
    { id: 2, name: 'Product 2', price: 39.99, image: 'path/to/image2.jpg' },
    { id: 3, name: 'Product 3', price: 19.99, image: 'path/to/image3.jpg' },
    { id: 4, name: 'Product 4', price: 49.99, image: 'path/to/image4.jpg' },
];

const Store: React.FC = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
            {products.map(product => (
                <Card key={product.id} className="shadow-md rounded-lg overflow-hidden">
                    <CardHeader>
                        <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-lg font-semibold">{product.name}</h2>
                        <p className="text-gray-600">${product.price.toFixed(2)}</p>
                    </CardContent>
                    <CardFooter>
                        {/* Add any footer content if needed */}
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
};

export default Store;