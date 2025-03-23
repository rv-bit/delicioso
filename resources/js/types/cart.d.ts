export interface CartProduct {
	product_id: string;
	name: string;
	default_image?: string;
	price: number;
	price_id: string;
	currency: string;
	quantity?: number;
	stock_available: boolean;
}
