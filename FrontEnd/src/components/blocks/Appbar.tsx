import { useEffect, useState } from "react";
import { Moon, Search, ShoppingBag, SunIcon, PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";

import supabase from "@/utils/supaBaseClient";

interface Product {
    id: string;
    name: string;
    price: number;
    imgurl: string;
    category: string;
}

export default function Appbar() {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [searchQuery, setSearchQuery] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<Product[]>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        document.documentElement.className = theme;
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    /** 📌 Fetch all products when the modal opens */
    const fetchProducts = async () => {
        const { data, error } = await supabase.from("products").select("*");
        if (!error) {
            setProducts(data);
            setFilteredProducts(data); // Initially show all products
        }
    };

    /** 📌 Open modal and fetch products */
    const handleOpenSearch = () => {
        setOpen(true);
        fetchProducts();
    };

    /** 📌 Handle search input */
    useEffect(() => {
        const filtered = products.filter((p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchQuery, products]);

    /** 📌 Add product to cart */
    const addToCart = (product: Product) => {
        setCart((prevCart) => [...prevCart, product]);
    };

    return (
        <header className="flex items-center justify-between px-8 py-4">
            <h1 className="text-xl font-medium" style={{ fontFamily: "monospace" }}>pharma</h1>

            <div className="right flex items-center gap-2">
                {/* Search Button */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="cursor-pointer rounded-full" onClick={handleOpenSearch}>
                            <Search />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg p-8 rounded-lg">
                        {/* Search Input */}
                        <Input
                            type="text"
                            placeholder="Search medicines..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full mt-2"
                        />

                        {/* Search Results */}
                        <div className="mt-4 max-h-60 overflow-y-auto">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <div key={product.id} className="flex items-center gap-3 p-2 border-b last:border-0">
                                        <img src={product.imgurl} alt={product.name} className="w-12 h-12 rounded object-cover" />
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium">{product.name}</h3>
                                            <p className="text-xs text-gray-500">₹{product.price}</p>
                                        </div>
                                        {/* Add to Cart Button */}
                                        <Button size="icon" variant="outline" onClick={() => addToCart(product)}>
                                            <PlusCircle className="w-5 h-5" />
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 text-center">No medicines found</p>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Theme Toggle */}
                <Button variant="ghost" size="icon" className="cursor-pointer rounded-full" onClick={toggleTheme}>
                    {theme === "light" ? <Moon /> : <SunIcon />}
                </Button>

                {/* Cart Button (show number of items) */}
                <Button variant="ghost" size="icon" className="cursor-pointer rounded-full relative">
                    <ShoppingBag />
                    {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                            {cart.length}
                        </span>
                    )}
                </Button>
            </div>
        </header>
    );
}
