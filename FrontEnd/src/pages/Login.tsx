import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useNavigate, Link } from "react-router";
import { signIn } from "@/utils/authUtil";
import { useState, useCallback } from "react";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";

const formSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { email: "", password: "" }
    });

    const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        setErrorMessage(null);
        console.log("Form Data: ", values);
        const { email, password } = values;
        const { user, error } = await signIn(email, password);

        if (error) {
            setErrorMessage(error.message);
            setLoading(false);
            return;
        }

        if (user) {
            console.log('Logged in successfully', user);
            navigate('/');
        }
        setLoading(false);
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <FlickeringGrid
                className="absolute inset-0 z-0 [mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
                squareSize={4}
                gridGap={6}
                color="#60A5FA"
                maxOpacity={0.5}
                flickerChance={0.1}
                height={screenHeight}
                width={screenWidth}
            />
            <Card className="relative z-10 w-full max-w-md backdrop-blur-xl rounded-lg">
                <CardHeader>
                    <CardTitle className="text-center text-white text-2xl font-semibold">
                        Login to Your Account
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {errorMessage && (
                        <div className="text-red-500 text-center mb-4 font-medium">
                            {errorMessage}
                        </div>
                    )}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/* Email */}
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Email</FormLabel>
                                    <FormControl><Input type="email" {...field} autoComplete="email" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {/* Password */}
                            <FormField control={form.control} name="password" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Password</FormLabel>
                                    <FormControl><Input type="password" {...field} autoComplete="current-password" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <div className="flex items-center justify-between text-sm">
                                <Link to="/register" className="text-blue-400 hover:underline">
                                    New User? Sign Up
                                </Link>
                            </div>
                            {/* Submit Button */}
                            <Button type="submit" className="w-full mt-4" disabled={loading}>
                                {loading ? "Loading..." : "Login"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
