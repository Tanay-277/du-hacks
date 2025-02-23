import supabase from "./supaBaseClient";

export interface Product {
	id?: string;
	name: string;
	category: string;
	manufacturedby: string;
	price: string;
	stockquantity: string;
	drugtype: string;
	imgurl: string;
	created_at?: string;
}

/** 📌 Add a new product */
export const addProduct = async (product: Product) => {
	const { data, error } = await supabase.from("products").insert([product]);
	if (error) throw error;
	return data;
};

/** 📌 Fetch all products */
export const getProducts = async () => {
	const { data, error } = await supabase.from("products").select("*");
	if (error) throw error;
	return data;
};

/** 📌 Fetch a single product by ID */
export const getProductById = async (id: string) => {
	const { data, error } = await supabase
		.from("products")
		.select("*")
		.eq("id", id)
		.single();
	if (error) throw error;
	return data;
};

/** 📌 Update a product */
export const updateProduct = async (id: string, updates: Partial<Product>) => {
	const { data, error } = await supabase
		.from("products")
		.update(updates)
		.eq("id", id);
	if (error) throw error;
	return data;
};

/** 📌 Delete a product */
export const deleteProduct = async (id: string) => {
	const { error } = await supabase.from("products").delete().eq("id", id);
	if (error) throw error;
};
