import { router } from "@inertiajs/react";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { z } from "zod";

import { cn } from "@/lib/utils";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import SpinerLoader from "@/components/icons/spiner-loading";
import { XIcon } from "lucide-react";

const MAX_FILE_SIZE_BYTES = 1024 * 1024 * 2; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/png", "image/webp"];

const formSchema = z.object({
	name: z
		.string()
		.max(60)
		.refine((value) => value.trim() !== "", "Name is required"),
	description: z.string().max(255).optional(),
	images: z.array(z.instanceof(File)).optional(),
	metadata: z.record(z.any()).optional(),
	marketing_features: z.array(z.record(z.any())).max(15).optional(),
	type: z.enum(["recurring", "one_time"]),
	unit_amount_decimal: z
		.number()
		.int()
		.nonnegative()
		.refine((value) => value > 0, "Amount must be greater than 0")
		.refine((value) => value < 10000000, "Amount must be less than £100,000"),
});

export default function ProductNewForm() {
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		mode: "onChange",
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
			images: [],
			metadata: {},
			marketing_features: [],
			type: "one_time",
			unit_amount_decimal: 0,
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		if (values.images?.some((img: File) => !ACCEPTED_IMAGE_TYPES.includes(img.type))) {
			return form.setError("images", { type: "manual", message: "Invalid file type. Only JPEG, PNG, and WEBP are allowed." });
		}

		if (values.images?.some((img: File) => values.images?.some((file: File) => file.size > MAX_FILE_SIZE_BYTES))) {
			return form.setError("images", { type: "manual", message: `File size must be less than ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB.` });
		}

		if ((values.images?.length ?? 0) > 8) {
			return form.setError("images", { type: "manual", message: "Maximum of 8 images allowed." });
		}

		const formData = new FormData();

		if (values.images && values.images.length > 0) {
			values.images.forEach((image, index) => {
				console.log("image", image);
				formData.append(`images[${index}]`, image);
			});
		}

		formData.append("name", values.name);
		formData.append("description", values.description ?? "");
		formData.append("metadata", JSON.stringify(values.metadata));
		formData.append("marketing_features", JSON.stringify(values.marketing_features));
		formData.append("unit_amount_decimal", values.unit_amount_decimal.toString());

		router.post("/admin-dashboard/stripe/create-product", formData, {
			preserveState: false,
			onSuccess: () => {
				form.reset();
				router.reload();
			},
			onStart: () => {
				form.clearErrors();
				setIsSubmitting(true);
			},
		});
	}

	const handleAddImages = async () => {
		if (!window.showOpenFilePicker) return; // unsupported browsers

		try {
			const fileHandles = await window.showOpenFilePicker({
				multiple: true,
				types: [
					{
						description: "Image Files",
						accept: { "image/*": [".png", ".webp"] },
					},
				],
			});

			const files = await Promise.all(fileHandles.map((handle: any) => handle.getFile()));
			const currentImages = form.getValues("images") || [];

			if (files.some((file: File) => !ACCEPTED_IMAGE_TYPES.includes(file.type))) {
				return form.setError("images", { type: "manual", message: "Invalid file type. Only PNG, and WEBP are allowed." });
			}

			if (files.some((file: File) => file.size > MAX_FILE_SIZE_BYTES)) {
				return form.setError("images", { type: "manual", message: `File size must be less than ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB.` });
			}

			if (currentImages.length + files.length > 8) {
				return form.setError("images", { type: "manual", message: "Maximum of 8 images allowed." });
			}

			form.setValue("images", [...currentImages, ...files], { shouldValidate: true });
		} catch (err) {
			console.error("File selection cancelled or failed:", err);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit(onSubmit)(e);
				}}
				className="flex h-full w-full flex-col sm:justify-between sm:gap-4"
			>
				<span className="flex h-full max-h-[calc(100%-200px)] w-full flex-col justify-start gap-4 overflow-auto overflow-x-hidden p-4 py-0">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem className="flex h-auto w-full flex-col items-start justify-between gap-1">
								<span className="flex flex-col items-start justify-start">
									<FormLabel>Name (required)</FormLabel>
									<FormDescription className="text-sm text-gray-500">Name of the product</FormDescription>
								</span>
								<FormControl className="flex-1">
									<Input {...field} className="rounded-sm p-3" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem className="flex h-auto w-full flex-col items-start justify-between gap-1">
								<span className="flex flex-col items-start justify-start">
									<FormLabel>Description</FormLabel>
									<FormDescription className="text-sm text-gray-500">Appears at checkout, in product lists</FormDescription>
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
						name="images"
						render={({ field }) => (
							<FormItem className="flex h-auto w-full flex-col items-start justify-between gap-1">
								<span className="flex flex-col items-start justify-start">
									<FormLabel>Images</FormLabel>
									<FormDescription className="text-sm text-gray-500">Appears at checkout. JPEG, PNG or WEBP under 2MB (up to 8 images)</FormDescription>
								</span>

								<span className="flex w-full items-center justify-start gap-2 overflow-x-auto p-1">
									<Button
										type="button"
										onClick={() => handleAddImages()}
										className="size-50 flex-col rounded-sm bg-transparent p-3 text-black ring ring-black/20 transition-colors duration-200 ease-linear hover:bg-gray-200"
									>
										<svg className="size-10 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
											<path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
										</svg>
										Upload Image
									</Button>

									{form.getValues("images") && (
										<div className="flex gap-2">
											{form.getValues("images")?.map((file: File, index: number) => (
												<div key={index} data-id={index} className="relative flex size-50 items-center justify-center rounded-md bg-gray-200">
													<img src={URL.createObjectURL(file)} className="h-full w-full rounded-md object-cover" />

													<Button
														onClick={() => {
															const images = form.getValues("images") || [];
															const newImages = images.some((img: File) => img === file) ? images.filter((img: File) => img !== file) : images;

															form.setValue("images", newImages, { shouldValidate: true });
														}}
														variant={"link"}
														className="absolute inset-0 top-0 left-0 size-fit w-full justify-end hover:no-underline"
													>
														<XIcon size={20} className="text-gray-700" />
													</Button>
												</div>
											))}
										</div>
									)}
								</span>

								<FormMessage />
							</FormItem>
						)}
					/>

					<Accordion type="single" collapsible>
						<AccordionItem value="more-options">
							<AccordionTrigger className="flex w-fit items-center justify-start gap-1 pb-0 text-center hover:no-underline">
								<h1 className="text-rajah-600 text-left">More options</h1>
							</AccordionTrigger>
							<AccordionContent className="mt-5 flex flex-col items-start justify-start gap-4 p-0">
								<FormField
									control={form.control}
									name="metadata"
									render={({ field }) => (
										<FormItem className="flex h-auto w-full flex-col items-start justify-between gap-1">
											<span className="flex flex-col items-start justify-start">
												<FormLabel>Metadata</FormLabel>
												<FormDescription className="text-sm text-gray-500">Key-value pairs for structured information</FormDescription>
											</span>
											<FormControl className="flex-1"></FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="marketing_features"
									render={({ field }) => (
										<FormItem className="flex h-auto w-full flex-col items-start justify-between gap-1">
											<span className="flex flex-col items-start justify-start">
												<FormLabel>Marketing features</FormLabel>
												<FormDescription className="text-sm text-gray-500">Up to 15 marketing features</FormDescription>
											</span>
											<FormControl className="flex-1"></FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</AccordionContent>
						</AccordionItem>
					</Accordion>

					<hr className="border-t border-gray-200" />

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
									<FormLabel>Amount</FormLabel>
									<FormDescription className="text-sm text-gray-500">The amount in cents</FormDescription>
								</span>
								<FormControl className="flex-1">
									<NumericFormat
										customInput={Input}
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
										prefix="£"
										placeholder="0.00"
										className="rounded-sm p-3"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</span>

				<span className="flex h-fit gap-2 p-4 max-sm:flex-col sm:flex-row sm:justify-end sm:border-t sm:border-gray-200">
					<SheetPrimitive.Close asChild>
						<Button variant={"link"}>Close</Button>
					</SheetPrimitive.Close>
					<Button type="submit" disabled={isSubmitting} className="group relative size-auto min-w-30 overflow-hidden rounded-sm bg-black/80 p-2 px-5 disabled:cursor-not-allowed">
						<div className="absolute -left-16 h-[100px] w-10 -rotate-45 bg-gradient-to-r from-white/10 via-white/50 to-white/10 blur-sm duration-700 group-hover:left-[150%] group-hover:delay-200 group-hover:duration-700" />

						<span className="flex items-center justify-center">
							{isSubmitting && <SpinerLoader className="mr-2 h-5 w-5" />}
							<h1>Save</h1>
						</span>
					</Button>
				</span>
			</form>
		</Form>
	);
}
