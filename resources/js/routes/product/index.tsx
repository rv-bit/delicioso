import { NutritionalFacts } from "@/types/stripe";

interface Product {
	product_category_slug: string;
	product_id: string;
	product_name: string;
	product_price: number;
	product_price_id: string;
	product_currency: string;
	product_description: string;
	product_images: string[];
	product_nutrition: NutritionalFacts;
}

export default function Index({ product }: { product: Product }) {
	return <div>Index</div>;
}
