import { zodResolver } from "@hookform/resolvers/zod";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Price } from "@/types/stripe";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
	active: z.boolean(),
	billing_scheme: z.enum(["per_unit", "tiered"]),
	lookup_key: z.string().or(z.null()).or(z.undefined()),
	product: z.string(),
	metadata: z.record(z.any()).optional(),
	type: z.enum(["recurring", "one_time"]),
	unit_amount: z.number(),
	unit_amount_decimal: z.string(),
});

export default function EditPriceForm({ currentData }: { currentData: Price }) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			active: currentData.active,
			billing_scheme: currentData.billing_scheme,
			lookup_key: currentData.lookup_key,
			product: currentData.product,
			metadata: Array.isArray(currentData.metadata) ? Object.fromEntries(currentData.metadata.map((item) => Object.entries(item)[0])) : currentData.metadata || {},
			type: currentData.type,
			unit_amount: currentData.unit_amount,
			unit_amount_decimal: currentData.unit_amount_decimal,
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col justify-center gap-4 p-4 pt-0">
				<span className="flex w-full flex-col justify-center gap-2">
					<FormField
						control={form.control}
						name="active"
						render={({ field }) => (
							<FormItem className="flex h-auto w-full items-start justify-between gap-1">
								<FormControl className="flex-1">
									<Button
										type="button"
										onClick={() => form.setValue("active", true, { shouldValidate: true })}
										className={cn(
											"size-auto w-full flex-col items-start justify-start gap-0 rounded-sm bg-white p-3 ring-1 ring-black/20 transition-colors duration-300 ease-initial hover:bg-gray-200/50",
											{
												"ring-rajah-300": form.getValues("active"),
											},
										)}
									>
										<h1
											className={cn("text-left text-black transition-colors duration-300 ease-initial", {
												"text-rajah-600": form.getValues("active"),
											})}
										>
											Active
										</h1>
										<p className="text-left text-sm text-wrap text-gray-500">This will enable the price to be used.</p>
									</Button>
								</FormControl>
								<FormControl className="flex-1">
									<Button
										type="button"
										onClick={() => form.setValue("active", false, { shouldValidate: true })}
										className={cn(
											"size-auto w-full flex-col items-start justify-start gap-0 rounded-sm bg-white p-3 ring-1 ring-black/20 transition-colors duration-300 ease-initial hover:bg-gray-200/50",
											{
												"ring-rajah-300": !form.getValues("active"),
												"text-rajah-300": !form.getValues("active"),
											},
										)}
									>
										<h1
											className={cn("text-left text-black transition-colors duration-300 ease-initial", {
												"text-rajah-600": !form.getValues("active"),
											})}
										>
											Inactive
										</h1>
										<p className="text-left text-sm text-wrap text-gray-500">This will disable the price from being used.</p>
									</Button>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</span>

				<span className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
					<SheetPrimitive.Close asChild>
						<Button variant={"link"}>Close</Button>
					</SheetPrimitive.Close>
					<Button type="submit" className="group relative size-auto min-w-30 overflow-hidden rounded-sm bg-black/80 p-2 px-5">
						<div className="absolute -left-16 h-[100px] w-10 -rotate-45 bg-gradient-to-r from-white/10 via-white/50 to-white/10 blur-sm duration-700 group-hover:left-[150%] group-hover:delay-200 group-hover:duration-700" />
						<h1>Save</h1>
					</Button>
				</span>
			</form>
		</Form>
	);
}
