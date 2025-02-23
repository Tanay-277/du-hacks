import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Trash2 } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../ui/select";
import supabase from "@/utils/supaBaseClient";

type FiltersState = {
    category: string[];
    price: string[];
    rating: string[];
};

const SORT_OPTIONS = [
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "rating_desc", label: "Rating: High to Low" },
    { value: "rating_asc", label: "Rating: Low to High" },
];

export default function Filters() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [filters, setFilters] = useState<FiltersState>({
        category: searchParams.get("category")?.split(",") || [],
        price: searchParams.get("price")?.split(",") || [],
        rating: searchParams.get("rating")?.split(",") || [],
    });
    const [categories, setCategories] = useState<string[]>([]);
    const [sort, setSort] = useState<string>(searchParams.get("sort") || "price_asc");

    // Fetch categories from Supabase
    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase.from("categories").select("name");
            if (!error) {
                setCategories(data.map((c) => c.name));
            }
        };
        fetchCategories();
    }, []);

    // Update URL query params when filters change
    useEffect(() => {
        const params = new URLSearchParams();

        if (filters.category.length > 0) params.set("category", filters.category.join(","));
        if (filters.price.length > 0) params.set("price", filters.price.join(","));
        if (filters.rating.length > 0) params.set("rating", filters.rating.join(","));
        params.set("sort", sort);

        setSearchParams(params);
    }, [filters, sort, setSearchParams]);

    const handleCheckboxChange = (section: keyof FiltersState, value: string) => {
        setFilters((prev) => {
            const updatedSection = prev[section].includes(value)
                ? prev[section].filter((v) => v !== value)
                : [...prev[section], value];

            return { ...prev, [section]: updatedSection };
        });
    };

    const clearFilters = () => {
        setFilters({ category: [], price: [], rating: [] });
        setSort("price_asc");
        setSearchParams(new URLSearchParams()); // Clear URL params
    };

    return (
        <div className="flex flex-col gap-4 p-4 border rounded-lg">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Filters</h2>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                    <Trash2 />
                </Button>
            </div>

            {/* Categories */}
            <div>
                <h3 className="text-sm font-medium">Category</h3>
                <div className="flex flex-col gap-2">
                    {categories.map((category) => (
                        <div key={category} className="flex items-center gap-2">
                            <Checkbox
                                checked={filters.category.includes(category)}
                                onChange={() => handleCheckboxChange("category", category)}
                            />
                            <Label>{category}</Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price */}
            <div>
                <h3 className="text-sm font-medium">Price</h3>
                <div className="flex flex-col gap-2">
                    {["under25", "25to50", "50to100", "over100"].map((range) => (
                        <div key={range} className="flex items-center gap-2">
                            <Checkbox
                                checked={filters.price.includes(range)}
                                onChange={() => handleCheckboxChange("price", range)}
                            />
                            <Label>
                                {range === "under25" && "Under $25"}
                                {range === "25to50" && "$25 to $50"}
                                {range === "50to100" && "$50 to $100"}
                                {range === "over100" && "Over $100"}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Rating */}
            <div>
                <h3 className="text-sm font-medium">Rating</h3>
                <div className="flex flex-col gap-2">
                    {["5", "4", "3", "2"].map((stars) => (
                        <div key={stars} className="flex items-center gap-2">
                            <Checkbox
                                checked={filters.rating.includes(stars)}
                                onChange={() => handleCheckboxChange("rating", stars)}
                            />
                            <Label>{"⭐".repeat(parseInt(stars))}</Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sorting */}
            <div>
                <h3 className="text-sm font-medium">Sort By</h3>
                <Select value={sort} onValueChange={(val) => setSort(val)}>
                    <SelectTrigger className="w-full">
                        {SORT_OPTIONS.find((option) => option.value === sort)?.label}
                    </SelectTrigger>
                    <SelectContent>
                        {SORT_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
