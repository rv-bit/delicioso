import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { DrawerClose } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import InputCurrency from "@/components/ui/input-currency";
import { Textarea } from "@/components/ui/textarea";
import { PriceCurrencyEnum } from "@/lib/constants";
import { NumericFormat } from "react-number-format";

const formSchema = z.object({
	name: z.string().optional(), // name of the current product
	type: z.enum(["recurring", "one_time"]),
	unit_amount_decimal: z
		.number()
		.int()
		.nonnegative()
		.refine((value) => value > 0, "Amount must be greater than 0")
		.refine((value) => value < 10000000, "Amount must be less than £100,000"),
	currency: z.enum(["GBP", "USD", "EUR"]),
	price_description: z.string().optional(),
	price_lookup_key: z.string().optional(),
});

export default function NewPriceForm({
	data,
	onSubmitChanges,
	onClose,
}: {
	data?: {
		name?: string;
		type: "recurring" | "one_time";
		currency?: PriceCurrencyEnum;
		unit_amount_decimal: number;
	};
	onSubmitChanges?: (values: z.infer<typeof formSchema>) => void;
	onClose?: () => void;
}) {
	const form = useForm<z.infer<typeof formSchema>>({
		mode: "onChange",
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: data?.name || "",
			type: data?.type || "recurring",
			currency: data?.currency || "GBP",
			unit_amount_decimal: data?.unit_amount_decimal || 0,
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);

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
			<form
				onSubmit={(e) => {
					form.handleSubmit(onSubmit)(e);
				}}
				className="flex h-full w-full flex-col justify-end sm:gap-4"
			>
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
											customInput={InputCurrency}
											value={field.value / 100}
											onValueChange={(values) => {
												const { floatValue } = values;
												const cents = Math.round((floatValue || 0) * 100);

												form.setValue("unit_amount_decimal", cents, { shouldValidate: true });
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
							name="price_description"
							render={({ field }) => (
								<FormItem className="flex h-auto w-full flex-col items-start justify-between gap-1">
									<span className="flex flex-col items-start justify-start">
										<FormLabel>Description</FormLabel>
										<FormDescription className="text-sm text-gray-500">Use to organise your prices. Not shown to customers.</FormDescription>
									</span>
									<FormControl className="flex-1">
										<Textarea {...field} name="Description" className="rounded-sm" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="price_lookup_key"
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
										<Input {...field} className="rounded-sm p-3" />
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
					<Button type="submit" className="group relative size-auto min-w-30 overflow-hidden rounded-sm bg-black/80 p-2 px-5 disabled:cursor-not-allowed">
						<div className="absolute -left-16 h-[100px] w-10 -rotate-45 bg-gradient-to-r from-white/10 via-white/50 to-white/10 blur-sm duration-700 group-hover:left-[150%] group-hover:delay-200 group-hover:duration-700" />

						<span className="flex items-center justify-center">
							<h1>Next</h1>
						</span>
					</Button>
				</span>
			</form>
		</Form>
	);
}
