import React from "react";

import { cn } from "@/lib/utils";

import { Input } from "./input";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { PRICE_CURRENCIES, PriceCurrency, PriceCurrencyEnum } from "@/lib/constants";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "./button";

const currencyOptions = PRICE_CURRENCIES;

export default function InputCurrency({
	className,
	labelClassName,
	currency,
	onCurrencyChange,
	...props
}: React.ComponentProps<"input"> & { labelClassName?: string | undefined; currency?: PriceCurrency; onCurrencyChange?: (currency: PriceCurrencyEnum) => void }) {
	const [open, setOpen] = React.useState(false);
	const [currentCurrency, setCurrentCurrency] = React.useState<string>(currency || "GBP");

	return (
		<div className="relative flex w-full rounded-md">
			<span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm">{currentCurrency}</span>
			<Input className={cn("-me-px rounded-e-none ps-12 shadow-none")} {...props} />
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild className="text-muted-foreground hover:text-foreground w-fit rounded-s-none border-s-1 shadow-none">
					<Button variant={"outline"} role="combobox" aria-expanded={open} className="w-fit justify-between">
						{currentCurrency ? currencyOptions.includes(currentCurrency) ? currentCurrency : <CommandEmpty /> : <CommandEmpty />}
						<ChevronsUpDown className="opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[130px] p-0">
					<Command>
						<CommandInput className="w-full rounded-none border-0 p-0 focus:ring-0" containerClassName="px-1" />
						<CommandList>
							<CommandEmpty>No currency found.</CommandEmpty>
							<CommandGroup className="max-h-[150px] overflow-y-auto">
								{currencyOptions.map((currency) => (
									<CommandItem
										key={currency}
										value={currency}
										onSelect={(currentValue: PriceCurrency) => {
											const newValue = currentValue as PriceCurrencyEnum;

											setCurrentCurrency(newValue);
											setOpen(false);

											if (onCurrencyChange) {
												onCurrencyChange(newValue);
											}
										}}
									>
										{currency}
										<Check className={cn("ml-auto", { "opacity-0": currentCurrency !== currency })} />
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
