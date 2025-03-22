export interface Prices {
	price_id: string;
	name?: string;
	type: "recurring" | "one_time";
	currency: "GBP" | "USD" | "EUR";
	unit_amount_decimal: number;
	options?: {
		description?: string;
		lookup_key?: string;
	};
	default?: boolean | undefined;
	edited_lookup_key?: boolean;
}

export interface Product {
	name: string;
	description: string;
	images: File[];
	metadata: Record<string, any>;
	marketing_features: Record<string, any>[];
	stock: number;
	category: string;
	prices: Prices[];
}

export interface StripeProduct {
	id: string; // Unique identifier for the object
	active: boolean; // Whether the product is currently available for purchase
	default_price?: string; // The ID of the Price object for this product
	description?: string; // The product's description for customer display
	metadata?: Record<string, any>; // Key-value pairs for structured information
	name: string; // The product's name for customer display
	tax_code?: string; // A tax code ID
	// More attributes
	object: string; // Object type
	created: number; // Time of creation (Unix epoch in seconds)
	images?: string[]; // List of up to 8 image URLs
	livemode: boolean; // True for live mode, false for test mode
	marketing_features?: Array<Record<string, any>>; // Up to 15 marketing features
	package_dimensions?: {
		height?: number;
		width?: number;
		length?: number;
		weight?: number;
	}; // Product dimensions for shipping purposes
	shippable?: boolean; // Whether the product is shippable (physical goods)
	statement_descriptor?: string; // Credit card statement descriptor
	unit_label?: string; // Label for units displayed on receipts, invoices, etc.
	updated: number; // Time the object was last updated (Unix epoch in seconds)
	url?: string; // Publicly accessible webpage URL

	// Additional attributes
	stock?: number; // Number of items in stock
	category?: string; // Category of the product
	prices: Prices[]; // Prices for the product
}

export interface StripePrice {
	id: string; // Unique identifier for the price object
	active: boolean; // Whether the price is active
	billing_scheme: "per_unit" | "tiered"; // Billing method
	created: number; // Time of creation (Unix epoch in seconds)
	currency: string; // Currency code (e.g., "gbp")
	custom_unit_amount?: number | null; // Custom unit amount
	livemode: boolean; // True for live mode, false for test mode
	lookup_key?: string | null; // Lookup key for price
	metadata?: Record<string, any>; // Key-value pairs
	nickname?: string | null; // Price nickname
	object: string; // Object type (e.g., "price")
	product: string; // Reference to the associated product ID
	recurring?: Record<string, any> | null; // Recurring billing information
	tax_behavior: "inclusive" | "exclusive" | "unspecified"; // Tax behavior
	tiers_mode?: string | null; // Tiered pricing mode
	transform_quantity?: Record<string, any> | null; // Quantity transformation
	type: "one_time" | "recurring"; // Pricing type
	unit_amount: number; // Amount in cents
	unit_amount_decimal: string; // Decimal string version of unit amount
	default?: boolean; // Whether the price is the default
}
