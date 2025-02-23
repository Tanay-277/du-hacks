import { Cloudinary } from "@cloudinary/url-gen";

// Initialize Cloudinary instance
const cloudinary = new Cloudinary({
	cloud: {
		cloudName: import.meta.env.VITE_CLOUDINARY_CLOUDNAME,
	},
	url: {
		secure: true, // Always use HTTPS
	},
});

export const uploadFile = async (file: File): Promise<string> => {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("upload_preset", "DUHACKS");

	try {
		const response = await fetch(
			`https://api.cloudinary.com/v1_1/${
				import.meta.env.VITE_CLOUDINARY_CLOUDNAME
			}/image/upload`,
			{
				method: "POST",
				body: formData,
			}
		);

		if (!response.ok) {
			throw new Error("Cloudinary upload failed");
		}

		const data = await response.json();
		return data.secure_url; // Return the uploaded image URL
	} catch (error) {
		console.error("Cloudinary upload error:", error);
		throw error;
	}
};

export const getFile = (publicId: string): string => {
	return cloudinary.image(publicId).toURL(); // Generate secure Cloudinary URL
};
