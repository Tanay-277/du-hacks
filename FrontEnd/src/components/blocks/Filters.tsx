import { useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Trash2 } from "lucide-react";

type FiltersState = {
    category: {
        medicines: boolean;
        healthWellness: boolean;
        personalCare: boolean;
    };
    price: {
        under25: boolean;
        _25to50: boolean;
        _50to100: boolean;
        over100: boolean;
    };
    rating: {
        _5stars: boolean;
        _4stars: boolean;
        _3stars: boolean;
        _2stars: boolean;
    };
};

export default function Filters() {
    const [filters, setFilters] = useState<FiltersState>({
        category: {
            medicines: false,
            healthWellness: false,
            personalCare: false,
        },
        price: {
            under25: false,
            _25to50: false,
            _50to100: false,
            over100: false,
        },
        rating: {
            _5stars: false,
            _4stars: false,
            _3stars: false,
            _2stars: false,
        },
    });

    type CategoryKeys = keyof FiltersState["category"];
    type PriceKeys = keyof FiltersState["price"];
    type RatingKeys = keyof FiltersState["rating"];

    const handleCheckboxChange = (section: keyof FiltersState, key: CategoryKeys | PriceKeys | RatingKeys) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [section]: {
                ...prevFilters[section],
                [key]: !(prevFilters[section] as any)[key],
            },
        }));
    };

    const clearFilters = () => {
        setFilters({
            category: {
                medicines: false,
                healthWellness: false,
                personalCare: false,
            },
            price: {
                under25: false,
                _25to50: false,
                _50to100: false,
                over100: false,
            },
            rating: {
                _5stars: false,
                _4stars: false,
                _3stars: false,
                _2stars: false,
            },
        });
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-medium">Filters</h2>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                    <Trash2/>
                </Button>
            </div>
            <div className="flex flex-col gap-4">
                <div>
                    <h3 className="text-sm font-medium">Category</h3>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={filters.category.medicines}
                                onChange={() => handleCheckboxChange("category", "medicines")}
                            />
                            <Label>Medicines</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={filters.category.healthWellness}
                                onChange={() => handleCheckboxChange("category", "healthWellness")}
                            />
                            <Label>Health & Wellness</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={filters.category.personalCare}
                                onChange={() => handleCheckboxChange("category", "personalCare")}
                            />
                            <Label>Personal Care</Label>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-medium">Price</h3>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={filters.price.under25}
                                onChange={() => handleCheckboxChange("price", "under25")}
                            />
                            <Label>Under $25</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={filters.price._25to50}
                                onChange={() => handleCheckboxChange("price", "_25to50")}
                            />
                            <Label>$25 to $50</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={filters.price._50to100}
                                onChange={() => handleCheckboxChange("price", "_50to100")}
                            />
                            <Label>$50 to $100</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={filters.price.over100}
                                onChange={() => handleCheckboxChange("price", "over100")}
                            />
                            <Label>Over $100</Label>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-medium">Rating</h3>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={filters.rating._5stars}
                                onChange={() => handleCheckboxChange("rating", "_5stars")}
                            />
                            <Label>⭐⭐⭐⭐⭐</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={filters.rating._4stars}
                                onChange={() => handleCheckboxChange("rating", "_4stars")}
                            />
                            <Label>⭐⭐⭐⭐</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={filters.rating._3stars}
                                onChange={() => handleCheckboxChange("rating", "_3stars")}
                            />
                            <Label>⭐⭐⭐</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={filters.rating._2stars}
                                onChange={() => handleCheckboxChange("rating", "_2stars")}
                            />
                            <Label>⭐⭐</Label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
