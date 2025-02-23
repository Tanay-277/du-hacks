import { useEffect, useState } from "react";
import { Moon, Search, ShoppingBag, SunIcon } from "lucide-react";
import { Button } from "../ui/button";

export default function Appbar() {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.className = theme;
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <header className="flex items-center justify-between px-8 py-4">
            <h1 className="text-xl font-medium" style={{ fontFamily: "monospace" }}>pharma</h1>
            <div className="right flex items-center gap-2">
                <Button variant="ghost" size={'icon'} className="cursor-pointer rounded-full">
                    <Search />
                </Button>
                <Button variant="ghost" size={'icon'} className="cursor-pointer rounded-full" onClick={toggleTheme}>
                    {theme === 'light' ? <Moon /> : <SunIcon />}
                </Button>
                <Button variant="ghost" size={'icon'} className="cursor-pointer rounded-full">
                    <ShoppingBag />
                </Button>
            </div>
        </header>
    );
}