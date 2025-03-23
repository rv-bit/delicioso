import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getCurrencySymbol(currencyCode: string) {
	const parts = new Intl.NumberFormat(undefined, { style: "currency", currency: currencyCode }).formatToParts(0);

	const symbol = parts.find((part) => part.type === "currency");
	return symbol ? symbol.value : currencyCode;
}

export function format(number: number, currency: string) {
	return new Intl.NumberFormat(undefined, {
		style: "currency",
		currency,
		currencyDisplay: "symbol",
	})
		.format(number)
		.replace(currency, "")
		.trim();
}
