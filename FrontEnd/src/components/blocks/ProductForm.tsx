import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { addProduct } from "@/utils/products";
import { uploadFile } from "@/utils/cloudinary";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {Link} from "react-router";

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

const categories = ["Pain Relief", "Antibiotics", "Vitamins", "Allergy", "Diabetes", "Heart Health"];
const drugTypes = ["Tablet", "Capsule", "Syrup", "Injection", "Ointment"];

const ProductForm = () => {
    document.title = "Add Product - Medico";
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
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

            toast("Product added successfully!");
        } catch (error) {
            console.error("Error adding product:", error);
            toast.error("Failed to add product.");
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        reset();
        setImagePreview(null);
    };

    return (
        <div className="mx-auto p-6">
            <div className="flex w-full items-center justify-between">

            <h2 className="text-2xl font-semibold mb-4">Add Product</h2>
            <Link to="/" className="text-blue-500">View Store</Link>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input id="name" {...register("name")} />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Category</Label>
                        <Select onValueChange={(value) => setValue("category", value)} defaultValue={watch("category")}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="manufacturedby">Manufactured By</Label>
                        <Input id="manufacturedby" {...register("manufacturedby")} />
                        {errors.manufacturedby && <p className="text-red-500 text-sm">{errors.manufacturedby.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="price">Price</Label>
                        <Input id="price" {...register("price")} type="number" />
                        {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="stockquantity">Stock Quantity</Label>
                        <Input id="stockquantity" {...register("stockquantity")} type="number" />
                        {errors.stockquantity && <p className="text-red-500 text-sm">{errors.stockquantity.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Drug Type</Label>
                        <Select onValueChange={(value) => setValue("drugtype", value)} defaultValue={watch("drugtype")}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Drug Type" />
                            </SelectTrigger>
                            <SelectContent>
                                {drugTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.drugtype && <p className="text-red-500 text-sm">{errors.drugtype.message}</p>}
                    </div>
                </div>

                {/* File Upload Section */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="image" className="text-lg font-medium">Upload Image</Label>

                    <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-gray-600 transition"
                        onClick={() => document.getElementById("image")?.click()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 16v-8m0 0L8 12m4-4l4 4M4 16h16" />
                        </svg>
                        <p className="text-gray-600 mt-2 text-sm">Click to upload or drag and drop</p>
                        <p className="text-gray-400 text-xs">JPG, PNG, or GIF (Max 5MB)</p>
                    </div>

                    <input
                        id="image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setValue("imgurl", file);
                                setImagePreview(URL.createObjectURL(file)); // Show preview
                            }
                        }}
                    />

                    {imagePreview && (
                        <div className="mt-4 flex items-center gap-4">
                            <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-md border" />
                            <Button variant="outline" onClick={() => setImagePreview(null)}>Remove</Button>
                        </div>
                    )}

                    {errors.imgurl && <p className="text-red-500 text-sm">{errors.imgurl.message}</p>}
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Adding..." : "Add Product"}
                </Button>
                <Button type="button" disabled={loading} className="w-full" variant={"destructive"} onClick={handleClear}>
                    Clear
                </Button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
