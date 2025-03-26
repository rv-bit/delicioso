import { Config } from "ziggy-js";

export interface User {
	id: number;
	name: string;
	email: string;
	email_verified_at?: string;
	roles: string[];
	permissions: string[];
}

export interface MostCommonCategory {
	category_id: string;
	category_name: string;
	category_image: string;
	category_image_preview?: string;
}

interface MostCommonData {
	most_common_categories: {
		category_id: string;
		category_name: string;
		category_image: string;
	}[];
	most_common_product: {
		product_id: string;
		product_name: string;
		product_image: string;
	};
	best_seller_products: {
		product_id: string;
		product_name: string;
		product_image: string;
	}[];
}

interface CategoriesObject {
	labels: { [key: string]: string };
	images: { [key: string]: string };
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
	flash: {
		successPayment: boolean;
	};
	auth: {
		user: User;
	};
	ziggy: Config & { location: string };
	categories: CategoriesObject;
	most_common_data: MostCommonData;
};
