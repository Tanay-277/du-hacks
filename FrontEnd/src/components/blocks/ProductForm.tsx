import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { addProduct } from "@/utils/products";
import { uploadFile } from "@/utils/cloudinary";

const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    category: z.string().min(1, "Category is required"),
    manufacturedby: z.string().min(1, "Manufacturer is required"),
    price: z.string().min(1, "Price is required"),
    stockquantity: z.string().min(1, "Stock quantity is required"),
    drugtype: z.string().min(1, "Drug type is required"),
    imgurl: z.instanceof(File).nullable().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

const ProductForm = () => {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
    });

    const onSubmit = async (data: ProductFormData) => {
        if (!data.imgurl) {
            toast.error("Please upload an image.");
            return;
        }

        setLoading(true);
        try {
            // Upload image to Cloudinary
            const imgUrl = await uploadFile(data.imgurl);

            // Insert data into Supabase
            await addProduct({ ...data, imgurl: imgUrl });

            toast.success("Product added successfully!");
        } catch (error) {
            console.error("Error adding product:", error);
            toast.error("Failed to add product.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-4">Add Product</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" {...register("name")} />
                    {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                </div>
                <div>
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" {...register("category")} />
                    {errors.category && <p className="text-red-500">{errors.category.message}</p>}
                </div>
                <div>
                    <Label htmlFor="manufacturedby">Manufactured By</Label>
                    <Input id="manufacturedby" {...register("manufacturedby")} />
                    {errors.manufacturedby && <p className="text-red-500">{errors.manufacturedby.message}</p>}
                </div>
                <div>
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" {...register("price")} />
                    {errors.price && <p className="text-red-500">{errors.price.message}</p>}
                </div>
                <div>
                    <Label htmlFor="stockquantity">Stock Quantity</Label>
                    <Input id="stockquantity" {...register("stockquantity")} />
                    {errors.stockquantity && <p className="text-red-500">{errors.stockquantity.message}</p>}
                </div>
                <div>
                    <Label htmlFor="drugtype">Drug Type</Label>
                    <Input id="drugtype" {...register("drugtype")} />
                    {errors.drugtype && <p className="text-red-500">{errors.drugtype.message}</p>}
                </div>
                <div>
                    <Label htmlFor="image">Upload Image</Label>
                    <Input id="image" type="file" accept="image/*" onChange={(e) => setValue("imgurl", e.target.files?.[0] || undefined)} />
                    {errors.imgurl && <p className="text-red-500">{errors.imgurl.message}</p>}
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Adding..." : "Add Product"}
                </Button>
            </form>
        </div>
    );
};

export default ProductForm;

