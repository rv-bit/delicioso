import { router, usePage } from "@inertiajs/react";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { NumericFormat } from "react-number-format";

import { cn } from "@/lib/utils";
import { Prices } from "@/types/stripe";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import InputCurrency from "@/components/ui/input-currency";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import SpinerLoader from "@/components/icons/spiner-loading";
import { Check, ChevronsUpDown, Ellipsis, Plus, Settings, XIcon } from "lucide-react";

import EditPriceForm from "./edit-price-form";
import NewPriceForm from "./new-price-form";

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
	stock: z.coerce
		.number()
		.int()
		.nonnegative()
		.refine((value) => value > 0, "Stock must be greater than 0")
		.refine((value) => value < 1000, "Stock must be less than 1,000"),
	category: z.string().nonempty(),
	prices: z.array(
		z.object({
			price_id: z.string(),
			name: z.string().optional(),
			type: z.enum(["recurring", "one_time"]),
			unit_amount_decimal: z
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
		}),
	),
});

export default function ProductNewForm() {
	const availableCategories = usePage().props.categories.labels;

	const [openAvailableCategories, setOpenAvailableCategories] = React.useState(false);
	const [openedSubDrawer, setOpenedSubDrawer] = React.useState(false);
	const [openedNewPriceDrawer, setOpenedNewPriceDrawer] = React.useState(false);
	const [openedEditPriceDrawer, setOpenedEditPriceDrawer] = React.useState<{ status: boolean; data: Prices; index: number }>({
		status: false,
		index: 0,
		data: {
			price_id: "",
			type: "one_time",
			unit_amount_decimal: 0,
			currency: "GBP",
			options: {
				description: "",
				lookup_key: "",
			},
			default: false,
		},
	});

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
			stock: 0,
			category: Object.keys(availableCategories)[0],
			prices: [
				{
					// default price
					price_id: "",
					type: "one_time",
					unit_amount_decimal: 0,
					currency: "GBP",
					default: true,
				},
			],
		},
	});

	const {
		fields: pricesFields,
		append: appendPrice,
		update: updatePrice,
	} = useFieldArray({
		control: form.control,
		name: "prices",
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
				formData.append(`images[${index}]`, image);
			});
		}

		formData.append("name", values.name);
		formData.append("description", values.description ?? "");
		formData.append("metadata", JSON.stringify(values.metadata));
		formData.append("marketing_features", JSON.stringify(values.marketing_features));
		formData.append("prices", JSON.stringify(values.prices));
		formData.append("stock", values.stock.toString());
		formData.append("category", values.category);

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

	function handleOpenEditPrice(data: Prices, index: number) {
		setOpenedEditPriceDrawer({
			status: true,
			index: index,
			data: data,
		});
	}

	const handleCloseEditPrice = () => {
		setOpenedEditPriceDrawer({
			status: false,
			index: 0,
			data: {
				price_id: "",
				type: "one_time",
				unit_amount_decimal: 0,
				currency: "GBP",
				options: {
					description: "",
					lookup_key: "",
				},
				default: false,
			},
		});
	};

	const handlePriceUpdate = (updatedPrice: Prices, index: number) => {
		updatePrice(index, updatedPrice);

		form.setValue(`prices.${index}.type`, updatedPrice.type, { shouldValidate: true });
		form.setValue(`prices.${index}.unit_amount_decimal`, updatedPrice.unit_amount_decimal, { shouldValidate: true });
		form.setValue(`prices.${index}.currency`, updatedPrice.currency, { shouldValidate: true });
		form.setValue(`prices.${index}.default`, updatedPrice.default, { shouldValidate: true });

		if (updatedPrice.options) {
			form.setValue(`prices.${index}.options.description`, updatedPrice.options.description, { shouldValidate: true });
			form.setValue(`prices.${index}.options.lookup_key`, updatedPrice.options.lookup_key, { shouldValidate: true });
		}

		setOpenedEditPriceDrawer({
			status: false,
			index: 0,
			data: {
				price_id: "",
				type: "one_time",
				unit_amount_decimal: 0,
				currency: "GBP",
				options: {
					description: "",
					lookup_key: "",
				},
				default: false,
			},
		});
	};

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
							name="name"
							render={({ field }) => (
								<FormItem className="flex h-auto w-full flex-col items-start justify-between gap-1">
									<span className="flex flex-col items-start justify-start">
										<FormLabel className="text-md">Name (required)</FormLabel>
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
										<FormLabel className="text-md">Description</FormLabel>
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
										<FormLabel className="text-md">Images</FormLabel>
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
								<AccordionTrigger className="flex w-fit items-center justify-start gap-1 py-0 text-center hover:no-underline" iconClassName="text-rajah-600 size-6">
									<h1 className="text-rajah-600 hover:text-rajah-700 text-left transition-colors duration-200 ease-linear">More options</h1>
								</AccordionTrigger>
								<AccordionContent className="mt-5 flex flex-col items-start justify-start gap-4 p-0">
									<FormField
										control={form.control}
										name="metadata"
										render={({ field }) => (
											<FormItem className="flex h-auto w-full flex-col items-start justify-between gap-1">
												<span className="flex flex-col items-start justify-start">
													<FormLabel className="text-md">Metadata</FormLabel>
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
													<FormLabel className="text-md">Marketing features</FormLabel>
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

						<FormField
							control={form.control}
							name="stock"
							render={({ field }) => (
								<FormItem className="flex h-auto w-full flex-col items-start justify-between gap-1">
									<span className="flex flex-col items-start justify-start">
										<FormLabel className="text-md">Stock (required)</FormLabel>
										<FormDescription className="text-sm text-gray-500">Number of units available</FormDescription>
									</span>
									<FormControl className="flex-1">
										<Input {...field} type="number" className="rounded-sm p-3" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="category"
							render={({ field }) => (
								<FormItem className="flex h-auto w-full flex-col items-start justify-between gap-1">
									<span className="flex flex-col items-start justify-start">
										<FormLabel className="text-md">Category (required)</FormLabel>
										<FormDescription className="text-sm text-gray-500">Category of the product</FormDescription>
									</span>
									<FormControl className="w-full flex-1">
										<Popover open={openAvailableCategories} onOpenChange={setOpenAvailableCategories}>
											<PopoverTrigger asChild className="text-muted-foreground hover:text-foreground w-full rounded-sm shadow-none">
												<Button variant={"outline"} role="combobox" aria-expanded={openAvailableCategories} className="w-full justify-between gap-0">
													{field.value ? availableCategories[field.value] : <CommandEmpty />}
													<ChevronsUpDown className="opacity-50" />
												</Button>
											</PopoverTrigger>
											<PopoverContent align="end" className="w-full p-0">
												<Command>
													<CommandInput className="w-full rounded-none border-0 p-0 focus:ring-0" containerClassName="px-1" />
													<CommandList>
														<CommandEmpty>No category found.</CommandEmpty>
														<CommandGroup className="max-h-[150px] overflow-y-auto">
															{Object.keys(availableCategories).map((category, index) => (
																<CommandItem
																	key={index}
																	value={category}
																	onSelect={(newValue: string) => {
																		form.setValue("category", newValue, { shouldValidate: true });
																		setOpenAvailableCategories(false);
																	}}
																	className="items-center justify-between gap-2"
																>
																	{availableCategories[category]}
																	<Check className={cn("w-fit", { "opacity-0": field.value !== category })} />
																</CommandItem>
															))}
														</CommandGroup>
													</CommandList>
												</Command>
											</PopoverContent>
										</Popover>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<hr className="border-t border-gray-200" />

						{pricesFields.length === 1 && !pricesFields[0]?.options && (
							<>
								<FormField
									control={form.control}
									name={`prices.0.type`}
									render={({ field }) => (
										<FormItem className="flex h-auto w-full items-start justify-between gap-1">
											<FormControl className="flex-1">
												<Button
													type="button"
													disabled={true}
													onClick={() => {
														updatePrice(0, {
															...pricesFields[0],
															type: "recurring",
														});

														form.setValue(`prices.0.type`, "recurring", { shouldValidate: true });
													}}
													className={cn(
														"size-auto w-full flex-col items-start justify-start gap-0 rounded-sm bg-white p-3 ring-1 ring-black/20 transition-colors duration-300 ease-initial hover:bg-gray-200/50",
														{
															"ring-rajah-300": form.getValues("prices").some((price: any) => price.type === "recurring"),
														},
													)}
												>
													<h1
														className={cn("text-left text-black transition-colors duration-300 ease-initial", {
															"text-rajah-600": form.getValues("prices").some((price: any) => price.type === "recurring"),
														})}
													>
														Recurring
													</h1>
												</Button>
											</FormControl>
											<FormControl className="flex-1">
												<Button
													type="button"
													onClick={() => {
														updatePrice(0, {
															...pricesFields[0],
															type: "one_time",
														});

														form.setValue(`prices.0.type`, "one_time", { shouldValidate: true });
													}}
													className={cn(
														"size-auto w-full flex-col items-start justify-start gap-0 rounded-sm bg-white p-3 ring-1 ring-black/20 transition-colors duration-300 ease-initial hover:bg-gray-200/50",
														{
															"ring-rajah-300": form.getValues("prices").some((price: any) => price.type === "one_time"),
															"text-rajah-300": form.getValues("prices").some((price: any) => price.type === "one_time"),
														},
													)}
												>
													<h1
														className={cn("text-left text-black transition-colors duration-300 ease-initial", {
															"text-rajah-600": form.getValues("prices").some((price: any) => price.type === "one_time"),
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
									name={`prices.0.unit_amount_decimal`}
									render={({ field }) => {
										return (
											<FormItem className="flex h-auto w-full flex-col items-start justify-between gap-1">
												<span className="flex flex-col items-start justify-start">
													<FormLabel className="text-md">Amount</FormLabel>
												</span>
												<FormControl className="flex-1">
													<NumericFormat
														customInput={InputCurrency}
														value={pricesFields[0]?.unit_amount_decimal / 100}
														currency={pricesFields[0]?.currency}
														onValueChange={(values) => {
															const { floatValue } = values;
															const cents = Math.round((floatValue || 0) * 100);

															updatePrice(0, {
																...pricesFields[0],
																unit_amount_decimal: cents,
															});

															form.setValue(`prices.0.unit_amount_decimal`, cents, { shouldValidate: true });
														}}
														onCurrencyChange={(currency) => {
															updatePrice(0, {
																...pricesFields[0],
																currency: currency,
															});

															form.setValue(`prices.0.currency`, currency, { shouldValidate: true });
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
										);
									}}
								/>

								<Drawer autoFocus={true} handleOnly={true} onOpenChange={setOpenedSubDrawer} open={openedSubDrawer} direction="right">
									<DrawerTrigger asChild className="flex h-auto w-full flex-col items-start justify-between gap-1">
										<Button
											variant={"link"}
											size={"sm"}
											className="text-rajah-600 hover:text-rajah-700 flex w-fit flex-row items-center justify-start p-0 text-left transition-colors duration-200 ease-linear hover:no-underline has-[>svg]:px-0"
										>
											<Settings className="pointer-events-none size-4 shrink-0 transition-transform duration-200" />
											More Pricing Options
										</Button>
									</DrawerTrigger>

									<DrawerContent className="w-full rounded-tl-sm rounded-bl-sm data-[vaul-drawer-direction=right]:w-full data-[vaul-drawer-direction=right]:sm:max-w-5xl">
										<DrawerHeader className="flex flex-col items-start justify-start gap-0 border-b border-gray-200">
											<DrawerTitle className="text-left text-lg font-medium text-gray-900 dark:text-gray-100">More Pricing Options</DrawerTitle>
											<DrawerDescription className="text-left text-sm text-gray-600 dark:text-gray-400">Edit the price data below.</DrawerDescription>
										</DrawerHeader>
										<EditPriceForm
											data={pricesFields[0]}
											onSubmitChanges={(values) => {
												updatePrice(0, {
													price_id: values.price_id,
													type: values.type,
													unit_amount_decimal: values.unit_amount_decimal,
													currency: values.currency,
													options: {
														description: "",
														lookup_key: "",
													},
													default: true,
												});

												form.setValue("prices.0.type", values.type);
												form.setValue("prices.0.unit_amount_decimal", values.unit_amount_decimal);
												form.setValue("prices.0.currency", values.currency);
												form.setValue("prices.0.default", values.default || true);

												if (values.options) {
													form.setValue("prices.0.options.description", values.options.description);
													form.setValue("prices.0.options.lookup_key", values.options.lookup_key);
												}
											}}
											onClose={() => {
												setOpenedSubDrawer(false);
											}}
										/>
									</DrawerContent>
								</Drawer>
							</>
						)}

						{pricesFields.length >= 1 && pricesFields[0]?.options && (
							<FormItem className="flex h-auto w-full flex-col items-start justify-start gap-4">
								<FormLabel className="text-md">Pricing</FormLabel>
								<span className="flex w-full flex-col items-start justify-start">
									{pricesFields.map((price: Prices, index: number) => {
										return (
											<div key={index} className="flex w-full items-start justify-between gap-2">
												<span className="flex h-fit flex-col items-start justify-start">
													<Button
														onClick={() => {
															handleOpenEditPrice(price, index);
														}}
														variant={"link"}
														size={"sm"}
														className="text-rajah-600 hover:text-rajah-700 flex size-auto w-full flex-row items-center justify-start p-0 text-left transition-colors duration-200 ease-linear hover:no-underline has-[>svg]:px-0"
													>
														<p className="pointer-events-none flex items-center justify-center text-sm">{price.currency}</p>
														<p className="text-sm">{Number(price.unit_amount_decimal / 100).toFixed(2)}</p>
													</Button>
													<h1 className="text-xs text-gray-500">{price.type === "recurring" ? "Recurring" : "One off"}</h1>
												</span>

												<span className="flex w-full items-start justify-end gap-2">
													{price.default && (
														<span className="text-rajah-500 flex items-center rounded-md border border-black/10 bg-gray-100 p-4 py-1.5">
															<h1 className="text-xs">Default</h1>
														</span>
													)}

													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																type="button"
																variant={"link"}
																className="flex size-auto items-center justify-end border border-transparent py-1 text-center transition-colors duration-200 ease-linear hover:border-black/20 hover:bg-gray-200 hover:no-underline hover:drop-shadow-md has-[>svg]:px-2"
															>
																<Ellipsis className="pointer-events-none size-5 shrink-0 transition-transform duration-200" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent className="flex h-auto w-full flex-col items-start justify-center rounded-none">
															<DropdownMenuItem className="w-full">
																<Button
																	onClick={() => {
																		handleOpenEditPrice(price, index);
																	}}
																	variant={"link"}
																	className="flex w-full items-center justify-start gap-2 p-2 text-left transition-colors duration-200 ease-linear hover:bg-gray-200 hover:no-underline"
																>
																	<span>Edit</span>
																</Button>
															</DropdownMenuItem>
															<DropdownMenuItem className="w-full">
																<Button
																	onClick={() => {
																		const updatedPrices = pricesFields.filter((_, i) => i !== index);
																		form.setValue("prices", updatedPrices, { shouldValidate: true });
																	}}
																	disabled={pricesFields.length <= 1 || price.default}
																	variant={"link"}
																	className="flex w-full items-center justify-start gap-2 p-2 text-left transition-colors duration-200 ease-linear hover:bg-gray-200 hover:no-underline"
																>
																	<span>Remove Price</span>
																</Button>
															</DropdownMenuItem>
															{pricesFields.length > 1 && !price?.default && (
																<DropdownMenuItem className="w-full">
																	<Button
																		onClick={() => {
																			const updatedPrices = pricesFields.map((p, i) => {
																				if (i === index) {
																					return { ...p, default: true };
																				}
																				return { ...p, default: false };
																			});

																			form.setValue("prices", updatedPrices, { shouldValidate: true });
																		}}
																		variant={"link"}
																		className="flex w-full items-center justify-start gap-2 p-2 text-left transition-colors duration-200 ease-linear hover:bg-gray-200 hover:no-underline"
																	>
																		<span>Set as Default</span>
																	</Button>
																</DropdownMenuItem>
															)}
														</DropdownMenuContent>
													</DropdownMenu>
												</span>
											</div>
										);
									})}

									<EditPriceDrawer
										priceData={openedEditPriceDrawer.data}
										isOpen={openedEditPriceDrawer.status}
										onClose={handleCloseEditPrice}
										onSubmitChanges={(values) => {
											handlePriceUpdate(values, openedEditPriceDrawer.index);
										}}
									/>
								</span>

								<Drawer autoFocus={true} handleOnly={true} onOpenChange={setOpenedNewPriceDrawer} open={openedNewPriceDrawer} direction="right">
									<DrawerTrigger asChild className="flex h-auto w-full flex-col items-start justify-between gap-1">
										<Button
											variant={"link"}
											size={"sm"}
											className="text-rajah-600 hover:text-rajah-700 flex w-full flex-row items-center justify-center border border-black/20 px-10 py-2 text-left transition-colors duration-200 ease-linear hover:border-black/50 hover:no-underline has-[>svg]:px-0"
										>
											<Plus className="pointer-events-none size-4 shrink-0 transition-transform duration-200" />
											Add Another Price
										</Button>
									</DrawerTrigger>

									<DrawerContent className="w-full rounded-tl-sm rounded-bl-sm data-[vaul-drawer-direction=right]:w-full data-[vaul-drawer-direction=right]:sm:max-w-5xl">
										<DrawerHeader className="flex flex-col items-start justify-start gap-0 border-b border-gray-200">
											<DrawerTitle className="text-left text-lg font-medium text-gray-900 dark:text-gray-100">More Pricing Options</DrawerTitle>
											<DrawerDescription className="text-left text-sm text-gray-600 dark:text-gray-400">Edit the price data below.</DrawerDescription>
										</DrawerHeader>
										<NewPriceForm
											onSubmitChanges={(values) => {
												appendPrice(values);
											}}
											onClose={() => {
												setOpenedNewPriceDrawer(false);
											}}
										/>
									</DrawerContent>
								</Drawer>
							</FormItem>
						)}
					</span>
				</div>

				<span className="sticky bottom-0 left-0 flex h-fit gap-2 border-t border-gray-200 bg-white p-4 max-sm:flex-col sm:flex-row sm:justify-end">
					<DrawerClose asChild>
						<Button variant={"link"}>Close</Button>
					</DrawerClose>
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

type EditPriceDrawerProps = {
	priceData: Prices;
	isOpen: boolean;
	onClose: () => void;
	onSubmitChanges: (values: Prices) => void;
};

function EditPriceDrawer({ priceData, isOpen, onClose, onSubmitChanges }: EditPriceDrawerProps) {
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
