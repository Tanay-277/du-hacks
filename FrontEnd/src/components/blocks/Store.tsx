import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import Skeleton from "../ui/skeleton";
import { useSearchParams } from "react-router";
import supabase from "@/utils/supaBaseClient";
import { getProducts } from "@/utils/products";

interface Product {
  id: string;
  name: string;
  price: number;
  imgurl: string;
  category: string;
}

const Store: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL
  const [filters, setFilters] = useState({
    category: searchParams.get("category")?.split(",") || [],
    price: searchParams.get("price")?.split(",") || [],
  });

  const [sort, setSort] = useState(searchParams.get("sort") || "price_asc");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  /** 📌 Fetch products from Supabase */
  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  /** 📌 Fetch categories from Supabase */
  const fetchCategories = async () => {
    const { data, error } = await supabase.from("products").select("category");
    if (!error) {
      const uniqueCategories = [...new Set(data.map((c) => c.category))];
      setCategories(uniqueCategories);
    }
  };

  /** 📌 Apply filters & sorting */
  useEffect(() => {
    let filtered = [...products];

    if (filters.category.length > 0) {
      filtered = filtered.filter((p) => filters.category.includes(p.category));
    }

    if (filters.price.length > 0) {
      filtered = filtered.filter((p) => {
        const price = p.price;
        return (
          (filters.price.includes("under50") && price < 50) ||
          (filters.price.includes("50to100") && price >= 50 && price <= 100) ||
          (filters.price.includes("100to200") && price >= 100 && price <= 200) ||
          (filters.price.includes("over200") && price > 200)
        );
      });
    }

    if (sort === "price_asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "price_desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);

    const params = new URLSearchParams();
    if (filters.category.length > 0) params.set("category", filters.category.join(","));
    if (filters.price.length > 0) params.set("price", filters.price.join(","));
    params.set("sort", sort);
    setSearchParams(params);
  }, [filters, sort, products]);

  /** 📌 Handle checkbox change */
  const handleCheckboxChange = (section: "category" | "price", value: string) => {
    setFilters((prev) => {
      const updatedSection = prev[section].includes(value)
        ? prev[section].filter((v) => v !== value)
        : [...prev[section], value];

      return { ...prev, [section]: updatedSection };
    });
  };

  /** 📌 Clear all filters */
  const clearFilters = () => {
    setFilters({ category: [], price: [] });
    setSort("price_asc");
    setSearchParams(new URLSearchParams());
    setFilteredProducts(products);
  };

  return (
    <div className="p-6 min-w-dvw">
      <h1 className="text-3xl font-medium mb-6">Medicine Store</h1>

      {/* Filters Section */}
      <div className="p-4 border rounded-lg mb-6 w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Filters</h2>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear
          </Button>
        </div>

        {/* Filters: Stacked one below the other */}
        <div className="flex flex-col gap-4 w-full">
          {/* Category Filter */}
          <div>
            <h3 className="text-sm font-medium mb-2">Category</h3>
            {loading ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <div className="flex flex-row gap-4">
                {categories.map((category) => (
                  <div key={category} className="flex items-center gap-2">
                    <Checkbox
                      checked={filters.category.includes(category)}
                      onCheckedChange={() => handleCheckboxChange("category", category)}
                    />
                    <Label className="w-fit">{category}</Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price Filter */}
          <div>
            <h3 className="text-sm font-medium mb-2">Price</h3>
            <div className="flex flex-row gap-2">
              {[
                { value: "under50", label: "Under ₹50" },
                { value: "50to100", label: "₹50 - ₹100" },
                { value: "100to200", label: "₹100 - ₹200" },
                { value: "over200", label: "Over ₹200" },
              ].map((range) => (
                <div key={range.value} className="flex items-center gap-2">
                  <Checkbox
                    checked={filters.price.includes(range.value)}
                    onCheckedChange={() => handleCheckboxChange("price", range.value)}
                  />
                  <Label className="w-28">{range.label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <h3 className="text-sm font-medium mb-2">Sort By</h3>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full">
                {sort === "price_asc" ? "Price: Low to High" : "Price: High to Low"}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading
          ? Array(8)
              .fill(null)
              .map((_, i) => <Skeleton key={i} className="h-60 w-full" />)
          : filteredProducts.map((product) => (
              <Card key={product.id} className="shadow-md rounded-lg overflow-hidden">
                <CardHeader>
                  <img src={product.imgurl} alt={product.name} className="w-full h-48 object-cover" />
                </CardHeader>
                <CardContent>
                  <h2 className="text-lg font-semibold">{product.name}</h2>
                  <p className="text-gray-600">₹{product.price}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Add to Cart</Button>
                </CardFooter>
              </Card>
            ))}
      </div>
    </div>
  );
};

export default Store;
