export const APP_NAME = import.meta.env.VITE_APP_NAME;

export const PRICE_CURRENCIES = ["GBP", "USD", "EUR"];
export enum PriceCurrencyEnum {
	GBP = "GBP",
	USD = "USD",
	EUR = "EUR",
}
export type PriceCurrency = (typeof PRICE_CURRENCIES)[number];
