import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router";
import { useState, useCallback } from "react";
import supabase from "@/utils/supaBaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    contact_no: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit contact number"),
    address: z.string().min(5, "Address is required"),
    state: z.string().nonempty("Select a state"),
    city: z.string().min(2, "City is required"),
    area: z.string().min(2, "Area is required"),
    pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
    userType: z.enum(["vendor", "consumer"], { required_error: "Select a user type" }),
});

const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function Register() {

    const screenWidth = window.innerWidth;

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "", email: "", password: "", contact_no: "",
            address: "", state: "", city: "", area: "", pincode: "",
            userType: "consumer"
        }
    });

    const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
        setErrorMessage(null);
        setLoading(true);
        const { email, password, userType } = values;

        try {
            const { data: user, error } = await supabase.auth.signUp({
                email: email.trim(),
                password: password.trim(),
                phone: values.contact_no,
            });

            if (error) throw error;

            // now insert the user details into the respective table
            const { error: insertError } = await supabase
                .from(userType)
                .insert([{ id: user?.user?.id, email: email.trim(), name: values.name, contact_no: values.contact_no, address: values.address, state: values.state, city: values.city, area: values.area, pincode: values.pincode }]);

            if (insertError) throw insertError;

            navigate("/login");
        } catch (err: any) {
            setErrorMessage(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    return (
        <div className="relative flex items-center justify-center min-h-screen px-6 overflow-hidden lg:max-h-dvh">
            <FlickeringGrid
                className="relative inset-0 z-0 [mask-image:radial-gradient(450px_circle_at_center,white,transparent)] hidden md:block"
                squareSize={4}
                gridGap={6}
                color="#60A5FA"
                maxOpacity={0.5}
                flickerChance={0.1}
                height={800}
                width={screenWidth / 2}
            />
            <div className="w-full max-w-3xl space-y-6 max-sm:py-8">
                <h2 className="text-center text-3xl font-semibold text-white">Create an Account</h2>

                {errorMessage && (
                    <div className="text-red-500 text-center mb-4 font-medium">
                        {errorMessage}
                    </div>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-sm:flex max-sm:flex-col">

                        {/* Full Name */}
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Full Name</FormLabel>
                                <FormControl><Input {...field} autoComplete="name" autoFocus /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

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
                                <FormControl><Input type="password" {...field} autoComplete="off" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Contact Number */}
                        <FormField control={form.control} name="contact_no" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Contact Number</FormLabel>
                                <FormControl><Input type="tel" {...field} autoComplete="tel" maxLength={10} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Address */}
                        <FormField control={form.control} name="address" render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel className="text-white">Address</FormLabel>
                                <FormControl><Input {...field} autoComplete="street-address" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* State Selection */}
                        <FormField control={form.control} name="state" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">State</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger><SelectValue placeholder="Select your state" /></SelectTrigger>
                                    <SelectContent>
                                        {indianStates.map((state) => (
                                            <SelectItem key={state} value={state}>{state}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* City */}
                        <FormField control={form.control} name="city" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">City</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Area */}
                        <FormField control={form.control} name="area" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Area</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Pincode */}
                        <FormField control={form.control} name="pincode" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Pincode</FormLabel>
                                <FormControl><Input type="text" {...field} maxLength={6} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* User Type Selection */}
                        <div className="flex gap-4 items-center">
                            I am a
                            <Button type="button" variant={form.watch("userType") === "consumer" ? "default" : "outline"} onClick={() => form.setValue("userType", "consumer")}>Consumer</Button>
                            <Button type="button" variant={form.watch("userType") === "vendor" ? "default" : "outline"} onClick={() => form.setValue("userType", "vendor")}>Vendor</Button>
                        </div>
                        <div className="flex gap-4 items-center justify-end">
                            Already Have an account? <Link to="/login" className="hover:underline font-medium">Login</Link>
                        </div>

                        <Button type="submit" className="col-span-2 w-full" disabled={loading}>
                            {loading ? "Registering..." : "Register"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
