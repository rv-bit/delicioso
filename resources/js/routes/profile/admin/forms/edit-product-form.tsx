import { router, usePage } from "@inertiajs/react";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Prices, StripeProduct } from "@/types/stripe";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import SpinerLoader from "@/components/icons/spiner-loading";

import { Check, ChevronsUpDown, Ellipsis, Plus, XIcon } from "lucide-react";

import { EditPriceDrawer } from "./edit-price-form";
import NewPriceForm from "./new-price-form";

const MAX_FILE_SIZE_BYTES = 1024 * 1024 * 2; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/png", "image/webp"];

const formSchema = z.object({
	name: z
		.string()
		.max(60)
		.refine((value) => value.trim() !== "", "Name is required"),
	description: z.string().max(255).optional(),
	images: z.array(z.union([z.instanceof(File), z.string()])).optional(),
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
		}),
	),
});

export default function ProductEditForm({ data }: { data: StripeProduct }) {
	const availableCategories = usePage().props.categories.labels;

	const [openAvailableCategories, setOpenAvailableCategories] = React.useState(false);
	const [openedNewPriceDrawer, setOpenedNewPriceDrawer] = React.useState(false);
	const [openedEditPriceDrawer, setOpenedEditPriceDrawer] = React.useState<{ status: boolean; data: Prices; initialData?: Prices; index: number }>({
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
			name: data.name || "",
			description: data.description || "",
			images: data.images || [],
			stock: data.stock || 0,
			category: data.category || "",
			prices: data.prices || [],
		},
	});

	const copyInitialPrices = React.useCallback(
		(index: number) => {
			return data.prices[index];
		},
		[data.prices],
	);

	const {
		fields: pricesFields,
		append: appendPrice,
		update: updatePrice,
	} = useFieldArray({
		control: form.control,
		name: "prices",
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const onlyFiles = values.images?.filter((img: File | string) => img instanceof File) as File[];

		if (onlyFiles?.some((img: File) => !ACCEPTED_IMAGE_TYPES.includes(img.type))) {
			return form.setError("images", { type: "manual", message: "Invalid file type. Only JPEG, PNG, and WEBP are allowed." });
		}

		if (onlyFiles?.some((img: File) => onlyFiles?.some((file: File) => img.size > MAX_FILE_SIZE_BYTES))) {
			return form.setError("images", { type: "manual", message: `File size must be less than ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB.` });
		}

		const currentImages = form.getValues("images") || [];
		const removedImagesFromInitial = data.images?.filter((img: string) => !currentImages.includes(img));
		const sequentialRemovedImages = removedImagesFromInitial?.map((img, i) => ({ key: i, value: img }));

		if (currentImages.length + onlyFiles?.length > 8) {
			return form.setError("images", { type: "manual", message: "Maximum of 8 images allowed." });
		}

		const formData = new FormData();

		onlyFiles?.forEach((file: File, index: number) => {
			formData.append(`images[${index}]`, file);
		});

		sequentialRemovedImages?.forEach(({ key, value }) => {
			formData.append(`removed_images[${key}]`, value);
		});

		formData.append("id", data.id);
		formData.append("name", values.name);
		formData.append("description", values.description || "none");
		formData.append("prices", JSON.stringify(values.prices));
		formData.append("stock", values.stock.toString());
		formData.append("category", values.category);

		router.post("/admin-dashboard/stripe/update-product", formData, {
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
	};

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
			index,
			data,
			initialData: copyInitialPrices(index),
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
												{form.getValues("images")?.map((image: File | string, index: number) => (
													<div key={index} data-id={index} className="relative flex size-50 items-center justify-center rounded-md bg-gray-200">
														{typeof image === "string" ? (
															<img src={image} className="h-full w-full rounded-md object-cover" />
														) : (
															<img src={URL.createObjectURL(image)} className="h-full w-full rounded-md object-cover" />
														)}

														<Button
															type="button"
															onClick={() => {
																const images = form.getValues("images") || [];
																const newImages = images.some((img: File | string, i: number) => i === index) ? images.filter((_, i) => i !== index) : images;

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

						<FormItem className="flex h-auto w-full flex-col items-start justify-start gap-4">
							<FormLabel className="text-md">Pricing</FormLabel>
							<span className="flex w-full flex-col items-start justify-start">
								{pricesFields.map((price: Prices, index: number) => {
									return (
										<div key={index} className="flex w-full items-start justify-between gap-2">
											<span className="flex h-fit flex-col items-start justify-start">
												<Button
													type="button"
													onClick={() => {
														handleOpenEditPrice(price, index);
													}}
													variant={"link"}
													size={"sm"}
													className="text-rajah-600 hover:text-rajah-700 flex size-auto w-full flex-row items-center justify-start p-0 text-left transition-colors duration-200 ease-linear hover:no-underline has-[>svg]:px-0"
												>
													<p className="pointer-events-none flex items-center justify-center text-sm">{price.currency}</p>
													<p className="text-sm">{Number(price.unit_amount_decimal / 100).toFixed(2)}</p>

													{price.price_id.length <= 0 && ( // means is new added price
														<span className="flex items-center justify-center rounded-md border border-black/10 bg-gray-100 p-1 px-2">
															<h1 className="text-xs text-red-500">New</h1>
														</span>
													)}
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
																type="button"
																onClick={() => {
																	handleOpenEditPrice(price, index);
																}}
																variant={"link"}
																className="flex w-full items-center justify-start gap-2 p-2 text-left transition-colors duration-200 ease-linear hover:bg-gray-200 hover:no-underline"
															>
																<span>Edit</span>
															</Button>
														</DropdownMenuItem>
														{price.price_id.length <= 0 && (
															<DropdownMenuItem className="w-full">
																<Button
																	type="button"
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
														)}
														{pricesFields.length > 1 && !price?.default && (
															<DropdownMenuItem className="w-full">
																<Button
																	type="button"
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
									initialData={openedEditPriceDrawer.initialData}
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
										type="button"
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

							<FormMessage />
						</FormItem>
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
