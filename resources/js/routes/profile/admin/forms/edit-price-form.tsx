import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Prices } from "@/types/stripe";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import InputCurrency from "@/components/ui/input-currency";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
	price_id: z.string(),
	name: z.string().optional(),
	type: z.enum(["recurring", "one_time"]),
	unit_amount_decimal: z.coerce
		.number()
		.int()
		.nonnegative()
		.refine((value) => value > 0, "Amount must be greater than 0")
		.refine((value) => value < 10000000, "Amount must be less than £100,000"),
	currency: z.enum(["GBP", "USD", "EUR"]),
	options: z
		.object({
			description: z.string().optional(),
			lookup_key: z.string().optional(),
		})
		.optional(),
	default: z.boolean().optional(),
	edited_lookup_key: z.coerce.boolean().optional(),
});

type EditPriceProps = {
	data?: Prices;
	initialData?: Prices;
	allowChangePriceAmount?: boolean;
	onClose: () => void;
	onSubmitChanges: (values: Prices) => void;
};

type EditPriceDrawerProps = {
	priceData: Prices;
	initialData?: Prices;
	isOpen: boolean;
	onClose: () => void;
	onSubmitChanges: (values: Prices) => void;
};

export function EditPriceForm({ data, initialData, allowChangePriceAmount, onClose, onSubmitChanges }: EditPriceProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		mode: "onChange",
		resolver: zodResolver(formSchema),
		defaultValues: {
			price_id: data?.price_id || "",
			name: data?.name || "",
			type: data?.type || "one_time",
			currency: data?.currency || "GBP",
			unit_amount_decimal: data?.unit_amount_decimal || 0,
			options: {
				description: data?.options?.description || "",
				lookup_key: data?.options?.lookup_key || "",
			},
			default: data?.default || false,
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		const errors = form.formState.errors;

		if (Object.keys(errors).length > 0) {
			console.log(errors);
			return;
		}

		if (onSubmitChanges) {
			onSubmitChanges(values);
		}

		if (onClose) {
			onClose();
		}

		form.reset();
	}

	return (
		<Form {...form}>
			<div className="flex h-full w-full flex-col justify-end sm:gap-4">
				<div className="max-h-full flex-1 overflow-auto pb-16 max-sm:pb-20">
					<span className="flex h-full w-full flex-col justify-start gap-4 overflow-x-hidden p-4">
						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem className="flex h-auto w-full items-start justify-between gap-1">
									<FormControl className="flex-1">
										<Button
											type="button"
											disabled={true}
											onClick={() => form.setValue("type", "recurring", { shouldValidate: true })}
											className={cn(
												"size-auto w-full flex-col items-start justify-start gap-0 rounded-sm bg-white p-3 ring-1 ring-black/20 transition-colors duration-300 ease-initial hover:bg-gray-200/50",
												{
													"ring-rajah-300": form.getValues("type") === "recurring",
												},
											)}
										>
											<h1
												className={cn("text-left text-black transition-colors duration-300 ease-initial", {
													"text-rajah-600": form.getValues("type") === "recurring",
												})}
											>
												Recurring
											</h1>
										</Button>
									</FormControl>
									<FormControl className="flex-1">
										<Button
											type="button"
											onClick={() => form.setValue("type", "one_time", { shouldValidate: true })}
											className={cn(
												"size-auto w-full flex-col items-start justify-start gap-0 rounded-sm bg-white p-3 ring-1 ring-black/20 transition-colors duration-300 ease-initial hover:bg-gray-200/50",
												{
													"ring-rajah-300": form.getValues("type") === "one_time",
													"text-rajah-300": form.getValues("type") === "one_time",
												},
											)}
										>
											<h1
												className={cn("text-left text-black transition-colors duration-300 ease-initial", {
													"text-rajah-600": form.getValues("type") === "one_time",
												})}
											>
												One off
											</h1>
										</Button>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="unit_amount_decimal"
							render={({ field }) => (
								<FormItem className="flex h-auto w-full flex-col items-start justify-between gap-1">
									<span className="flex flex-col items-start justify-start">
										<FormLabel>Amount (required)</FormLabel>
									</span>
									<FormControl className="flex-1">
										<NumericFormat
											disabled={!allowChangePriceAmount}
											customInput={InputCurrency}
											value={field.value / 100}
											currency={form.getValues("currency")}
											onValueChange={(values) => {
												const { floatValue } = values;
												const cents = Math.round((floatValue || 0) * 100);

												form.setValue("unit_amount_decimal", cents, { shouldValidate: true });
											}}
											onCurrencyChange={(currency) => {
												form.setValue("currency", currency, { shouldValidate: true });
											}}
											onFocus={(e) => {
												e.target.select();
											}}
											fixedDecimalScale
											valueIsNumericString
											allowLeadingZeros={true}
											thousandsGroupStyle="lakh"
											thousandSeparator=","
											decimalSeparator="."
											decimalScale={2}
											placeholder="0.00"
											className="rounded-sm p-3"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<hr className="border-t border-gray-200" />

						<h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100">Advanced</h1>

						<FormField
							control={form.control}
							name={`options.description`}
							render={({ field }) => (
								<FormItem className="flex h-auto w-full flex-col items-start justify-between gap-1">
									<span className="flex flex-col items-start justify-start">
										<FormLabel>Description</FormLabel>
										<FormDescription className="text-sm text-gray-500">Use to organise your prices. Not shown to customers.</FormDescription>
									</span>
									<FormControl className="flex-1">
										<Textarea
											{...field}
											onChange={(e) => form.setValue("options.description", e.target.value, { shouldValidate: true })}
											name="Description"
											className="rounded-sm"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name={`options.lookup_key`}
							render={({ field }) => (
								<FormItem className="flex h-auto w-full flex-col items-start justify-between gap-1">
									<span className="flex flex-col items-start justify-start">
										<FormLabel>Lookup key</FormLabel>
										<FormDescription className="text-sm text-gray-500">
											Lookup keys make it easier to manage and make future pricing changes by using a unique key (e.g. standard_monthly) for each price, enabling easy querying
											and retrieval of specific prices. Lookup keys should be unique across all prices in your account.
										</FormDescription>
									</span>
									<FormControl className="flex-1">
										<Input
											{...field}
											onChange={(e) => {
												if (initialData?.options?.lookup_key !== e.target.value) {
													form.setValue("edited_lookup_key", true, { shouldValidate: true });
												} else if (initialData?.options?.lookup_key === e.target.value) {
													form.setValue("edited_lookup_key", false, { shouldValidate: true });
												}

												form.setValue("options.lookup_key", e.target.value, { shouldValidate: true });
											}}
											name="Lookup key"
											className="rounded-sm"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</span>
				</div>

				<span className="sticky bottom-0 left-0 flex h-fit gap-2 border-t border-gray-200 bg-white p-4 max-sm:flex-col sm:flex-row sm:justify-end">
					<DrawerClose asChild>
						<Button variant={"link"}>Close</Button>
					</DrawerClose>
					<Button onClick={(e) => form.handleSubmit(onSubmit)(e)} className="group relative size-auto min-w-30 overflow-hidden rounded-sm bg-black/80 p-2 px-5 disabled:cursor-not-allowed">
						<div className="absolute -left-16 h-[100px] w-10 -rotate-45 bg-gradient-to-r from-white/10 via-white/50 to-white/10 blur-sm duration-700 group-hover:left-[150%] group-hover:delay-200 group-hover:duration-700" />

						<span className="flex items-center justify-center">
							<h1>Next</h1>
						</span>
					</Button>
				</span>
			</div>
		</Form>
	);
}

export function EditPriceDrawer({ priceData, initialData, isOpen, onClose, onSubmitChanges }: EditPriceDrawerProps) {
	return (
		<Drawer
			autoFocus={true}
			handleOnly={true}
			onOpenChange={(open) => {
				if (!open) {
					onClose();
				}
			}}
			open={isOpen}
			direction="right"
		>
			<DrawerContent className="w-full rounded-tl-sm rounded-bl-sm data-[vaul-drawer-direction=right]:w-full data-[vaul-drawer-direction=right]:sm:max-w-5xl">
				<DrawerHeader className="flex flex-col items-start justify-start gap-0 border-b border-gray-200">
					<DrawerTitle className="text-left text-lg font-medium text-gray-900 dark:text-gray-100">More Pricing Options</DrawerTitle>
					<DrawerDescription className="text-left text-sm text-gray-600 dark:text-gray-400">Edit the price data below.</DrawerDescription>
				</DrawerHeader>
				<EditPriceForm
					data={priceData}
					onSubmitChanges={(values) => {
						onSubmitChanges(values);
					}}
					onClose={() => {
						onClose();
					}}
				/>
			</DrawerContent>
		</Drawer>
	);
}
