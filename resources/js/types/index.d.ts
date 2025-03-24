import { Config } from "ziggy-js";

export interface User {
	id: number;
	name: string;
	email: string;
	email_verified_at?: string;
	roles: string[];
	permissions: string[];
}

interface MostCommonData {
	most_common_category: {
		category_id: string;
		category_name: string;
	};
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
	auth: {
		user: User;
	};
	ziggy: Config & { location: string };

	categories: CategoriesObject;
	most_common_data: MostCommonData;
};
