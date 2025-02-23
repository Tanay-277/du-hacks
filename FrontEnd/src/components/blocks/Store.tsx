import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/utils/cloudinary";
import { getProducts, addProduct } from "@/utils/products";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: string;
  imgurl: string;
  category: string;
}

const Store: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  /** 📌 Fetch all products from Supabase */
  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  /** 📌 Handle file selection */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFile(e.target.files[0]);
  };

  /** 📌 Upload image and add product */
  const handleUpload = async () => {
    if (!file) return;

    try {
      const url = await uploadFile(file);
      setImageUrl(url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload image.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-medium mb-6">Medicine Store</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="shadow-md rounded-lg overflow-hidden">
            <CardHeader>
              <img src={product.imgurl} alt={product.name} className="w-full h-48 object-cover" />
            </CardHeader>
            <CardContent>
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-600">₹{product.price}</p>
              <p className="text-gray-500 text-sm">{product.category}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">View Details</Button>
              <Button className="bg-blue-600 text-white">Buy Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Store;
