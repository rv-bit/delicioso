import { Head, Link } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { NumericFormat } from "react-number-format";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { useMediaQuery } from "@/hooks/use-media-query";

import { cn, format, getCurrencySymbol } from "@/lib/utils";

import { CartProduct } from "@/types/cart";
import { NutritionalFacts } from "@/types/stripe";

import RootLayout from "@/layouts/root-layout";

import { Checkbox } from "@/components/ui/checkbox";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerNestedContent, DrawerNestedRoot, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { ChevronLeft, ChevronLeftIcon, ChevronRight, ChevronRightIcon, SlidersHorizontal } from "lucide-react";

interface Product {
	product_id: string;
	name: string;
	description: string;
	price: number;
	price_id: string;
	currency: string;
	bought: number;
	nutrition: NutritionalFacts;
	stock_available: boolean;
	default_image?: string | null;
	created_at: string;
}

interface PaginatedResponse<T> {
	current_page: number;
	data: Product[];
	first_page_url: string;
	from: number | null;
	last_page: number;
	last_page_url: string;
	links: { url: string | null; label: string; active: boolean }[];
	next_page_url: string | null;
	path: string;
	per_page: number;
	prev_page_url: string | null;
	to: number | null;
	total: number;
	hasMore: boolean;
}

interface Sort {
	title: string;
	value: string;
	sortFunction: (a: Product, b: Product) => number;
	defaultOpen?: boolean;
}

interface Filter {
	title: string;
	children: { title: string; filterFunction?: (product: Product) => boolean }[];
	defaultOpen?: boolean;
}

const sorts = [
	{
		title: "Featured",
		value: "featured",
		sortFunction: (a: Product, b: Product) => a.bought - b.bought,
		defaultOpen: true,
	},
	{
		title: "Best Selling",
		value: "best-selling",
		sortFunction: (a: Product, b: Product) => b.bought - a.bought,
	},
	{
		title: "Alphabetically, A-Z",
		value: "a-z",
		sortFunction: (a: Product, b: Product) => a.name.localeCompare(b.name),
	},
	{
		title: "Alphabetically, Z-A",
		value: "z-a",
		sortFunction: (a: Product, b: Product) => b.name.localeCompare(a.name),
	},
	{
		title: "Price, low to high",
		value: "low-to-high",
		sortFunction: (a: Product, b: Product) => a.price - b.price,
	},
	{
		title: "Price, high to low",
		value: "high-to-low",
		sortFunction: (a: Product, b: Product) => b.price - a.price,
	},
	{
		title: "Date, old to new",
		value: "old-to-new",
		sortFunction: (a: Product, b: Product) => a.created_at.localeCompare(b.created_at),
	},
	{
		title: "Date, new to old",
		value: "new-to-old",
		sortFunction: (a: Product, b: Product) => b.created_at.localeCompare(a.created_at),
	},
] as Sort[];

export default function Products({ category, category_slug }: { category: string; category_slug: string }) {
	const isTablet = useMediaQuery("(max-width: 1024px)");

	const [currentCart, setCurrentCart] = useLocalStorage<CartProduct[]>("cart", []);

	const [selectedFilter, setSelectedFilter] = React.useState<string[]>([]);
	const [selectedSort, setSelectedSort] = React.useState<string>("featured");

	const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);

	const [page, setPage] = React.useState(1);

	const fetchProducts = React.useCallback(
		async (page: number): Promise<PaginatedResponse<Product>> => {
			const { data } = await axios.get(`/api/collections/${category_slug}?page=${page}`);
			return data;
		},
		[category_slug],
	);

	const { isLoading, isError, error, data, isFetching, isPreviousData } = useQuery({
		queryKey: ["products", page],
		queryFn: () => fetchProducts(page),
		keepPreviousData: true,
	});

	const hasNext = data?.data.length === data?.per_page && (data?.current_page ?? 0) < (data?.last_page ?? 0);

	const priceFilters = React.useMemo(() => {
		if (data) {
			const maxPrice = Math.max(...data.data.map((product: Product) => product.price / 100));
			const filters = [];
			for (let price = 0; price <= maxPrice; price += 10) {
				filters.push({
					title: `${format(price, "GBP")} - ${format(price + 10, "GBP")}`,
					filterFunction: (product: Product) => product.price / 100 >= price && product.price / 100 < price + 10,
				});
			}
			return filters;
		}

		return [];
	}, [data, category_slug]);

	const filters = React.useMemo(() => {
		return [
			{
				title: "All",
				children: [
					{
						title: "All",
					},
					{
						title: "In Stock",
						filterFunction: (product: Product) => product.stock_available,
					},
					{
						title: "Out of Stock",
						filterFunction: (product: Product) => !product.stock_available,
					},
				],
				defaultOpen: true,
			},
			{
				title: "Price",
				children: priceFilters,
			},
		] as Filter[];
	}, [priceFilters, category_slug]);

	return (
		<RootLayout footer={true}>
			<Head title={category} />

			<section className="mx-auto mt-15 flex max-w-7xl flex-col items-start justify-start gap-5 px-2 md:px-5">
				{isLoading ? (
					<div>Loading...</div>
				) : (
					<React.Fragment>
						<section className="flex w-full flex-col gap-2">
							<span className="flex flex-col">
								<h1 className="text-4xl font-semibold text-black">{category}</h1>
							</span>

							<section id="sort-section" className="flex w-full items-center justify-end gap-2 max-lg:hidden">
								<span className="flex items-center justify-center gap-1">
									<span className="flex h-9 items-center rounded-md bg-gray-200 px-4 py-2 text-center text-base font-medium text-black/65">{page}</span>
									<span className="bg-rajah-200 flex h-9 items-center gap-1 rounded-md px-4 py-2 text-center text-base font-medium text-black/65">
										<span className="inline">of</span> {data?.last_page ?? 0} pages
									</span>
									<Button type="button" variant="outline" onClick={() => setPage((old) => Math.max(old - 1, 0))} disabled={isPreviousData || page === 1} className="p-2">
										<ChevronLeftIcon size={20} />
									</Button>
									<Button type="button" variant="outline" onClick={() => setPage((old) => (hasNext ? old + 1 : old))} disabled={isPreviousData || !hasNext} className="p-2">
										<ChevronRightIcon size={20} />
									</Button>
								</span>

								<Select onValueChange={setSelectedSort} defaultValue={selectedSort}>
									<SelectTrigger className="max-h-[50px] w-[180px] focus-visible:ring-0">
										<SelectValue placeholder="" />
									</SelectTrigger>
									<SelectContent className="max-h-[250px] w-[180px] p-0">
										{sorts.map((sort, index) => (
											<SelectItem key={index} value={sort.value}>
												{sort.title}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</section>

							{isTablet && (
								<span className="flex w-full items-center justify-between gap-0">
									<Drawer
										autoFocus={true}
										direction="right"
										open={mobileFiltersOpen}
										onOpenChange={(open) => {
											setMobileFiltersOpen(open);
										}}
									>
										<DrawerTrigger name="filters-sort-trigger" aria-label="menu-trigger" className="text-rajah-500 flex items-center justify-start gap-2">
											<SlidersHorizontal size={18} />
											<h1 className="text-md text-left font-medium">Filters & Sort</h1>
										</DrawerTrigger>
										<DrawerContent className="flex h-full flex-col items-center justify-between gap-1 rounded-tl-sm rounded-bl-sm p-3 data-[vaul-drawer-direction=right]:w-[90%] data-[vaul-drawer-direction=right]:sm:max-w-xl">
											<DrawerHeader className="border-border h-auto w-full border-b-1 p-5 px-0">
												<DrawerTitle aria-label="Section Filter & Sorting" className="text-center text-xl font-light">
													Filter and sort
												</DrawerTitle>
												<DrawerDescription aria-label="Section Filter & Sorting Description" className="hidden" />
											</DrawerHeader>

											{filters.map((filter, index) => (
												<DrawerNestedRoot key={index} autoFocus={true} direction="right">
													<DrawerTrigger
														name={filter.title}
														className="flex h-auto w-full items-center justify-between rounded-sm p-3 text-left transition-colors duration-200 ease-linear hover:bg-gray-200"
													>
														<h1 className="text-md font-light sm:text-lg">{filter.title}</h1>
														<ChevronRight size={20} />
													</DrawerTrigger>
													<DrawerNestedContent className="flex h-full flex-col items-center justify-between gap-1 rounded-tl-sm rounded-bl-sm p-3 data-[vaul-drawer-direction=right]:w-[90%] data-[vaul-drawer-direction=right]:sm:max-w-xl">
														<DrawerHeader className="border-border h-auto w-full border-b-1 p-5 px-0">
															<DrawerTitle aria-label="Section Filter & Sorting" className="text-center text-xl font-light">
																Filter and sort
															</DrawerTitle>
															<DrawerDescription aria-label="Section Filter & Sorting Description" className="hidden" />
														</DrawerHeader>

														<DrawerFooter className="mt-2 flex h-fit w-full justify-start p-0">
															<DrawerClose className="flex h-auto w-full items-center justify-start gap-0.5 rounded-sm p-5 py-3 pl-0 text-left font-light transition-colors duration-200 ease-linear hover:bg-gray-200">
																<ChevronLeft size={20} />
																<h1 className="text-md text-left sm:text-lg">{filter.title}</h1>
															</DrawerClose>
														</DrawerFooter>

														<ul className="flex h-full w-full flex-col items-start">
															{filter.children.map((child, index) => (
																<li key={index} className="flex h-auto w-full items-center justify-start gap-2 rounded-sm p-1.5 pl-1 text-left break-all">
																	<Checkbox
																		value={child.title}
																		title={child.title}
																		checked={selectedFilter.includes(child.title)}
																		onCheckedChange={(checked) => {
																			if (checked) {
																				setSelectedFilter([...selectedFilter, child.title]);
																			} else {
																				setSelectedFilter(selectedFilter.filter((filter) => filter !== child.title));
																			}
																		}}
																		className="size-5.5 rounded-xs"
																	/>
																	<label
																		htmlFor={child.title}
																		className="sm:text-md text-sm leading-none font-light peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
																	>
																		{child.title}
																	</label>
																</li>
															))}
														</ul>

														<DrawerFooter className="border-border w-full flex-row items-center justify-center border-t p-0 pt-3">
															<Button
																onClick={() => {
																	setSelectedFilter([]);
																}}
																className="text-rajah-500 hover:text-rajah-700 h-15 flex-1 justify-center rounded-sm bg-white px-2 text-center text-sm font-light tracking-wide transition-colors duration-200 ease-linear hover:bg-white"
															>
																Clear All Filters
															</Button>
														</DrawerFooter>
													</DrawerNestedContent>
												</DrawerNestedRoot>
											))}

											<section id="sort-section-mobile" className="flex w-full items-center justify-between gap-5 p-3">
												<h1 className="sm:text-md w-fit text-sm font-light text-black sm:text-lg">Sort by:</h1>
												<Select onValueChange={setSelectedSort} defaultValue={selectedSort}>
													<SelectTrigger size="default" className="max-h-[50px] w-[80%] focus-visible:ring-0">
														<SelectValue placeholder="" />
													</SelectTrigger>
													<SelectContent className="max-h-[250px] w-full">
														{sorts.map((sort, index) => (
															<SelectItem key={index} value={sort.value}>
																{sort.title}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</section>

											<DrawerFooter className="border-border w-full flex-row justify-between border-t p-0 pt-3">
												<Button
													onClick={() => {
														setSelectedFilter([]);
													}}
													className="text-rajah-500 hover:text-rajah-700 h-15 flex-1 justify-center rounded-sm bg-white px-2 text-center text-sm font-light tracking-wide transition-colors duration-200 ease-linear hover:bg-white"
												>
													Clear All Filters
												</Button>
												<DrawerClose className="bg-rajah-500 h-15 flex-1 rounded-sm px-2 text-center text-sm tracking-wide text-white transition-colors duration-200 ease-linear hover:scale-[102%]">
													<h1>Close</h1>
												</DrawerClose>
											</DrawerFooter>
										</DrawerContent>
									</Drawer>

									<span className="flex items-center justify-end gap-1">
										<span className="flex h-9 items-center gap-1 rounded-md bg-gray-200 px-2 py-2 text-left text-base font-medium text-black/65">
											<span className="inline">{page} of</span> {data?.last_page ?? 0} pages
										</span>
										<Button type="button" variant="outline" onClick={() => setPage((old) => Math.max(old - 1, 0))} disabled={isPreviousData || page === 1} className="p-2">
											<ChevronLeftIcon size={20} />
										</Button>
										<Button type="button" variant="outline" onClick={() => setPage((old) => (hasNext ? old + 1 : old))} disabled={isPreviousData || !hasNext} className="p-2">
											<ChevronRightIcon size={20} />
										</Button>
									</span>
								</span>
							)}
						</section>

						<div className="flex h-full w-full gap-5">
							<aside id="filters-section" className="border-border sticky top-25 flex h-full min-h-90 max-w-60 min-w-60 flex-col gap-4 border-r pr-5 max-lg:hidden">
								<span>
									<h1 className="text-xl font-medium text-black">Filter:</h1>
									<hr className="border-border mt-2 h-1 w-full" />
								</span>

								{filters.map((filter, index) => (
									<React.Fragment key={index}>
										<Accordion type="single" collapsible defaultValue={filter.defaultOpen ? filter.title : undefined} className="h-fit w-full">
											<AccordionItem key={index} value={filter.title} className="flex w-full flex-col items-start justify-start gap-2">
												<AccordionTrigger containerClassName="flex w-full" className="flex w-full items-center justify-between gap-1 p-0">
													<h1 className="text-md tracking-tight text-black">{filter.title}</h1>
												</AccordionTrigger>

												<AccordionContent className="pt-0 pb-1">
													<ul className="flex flex-col items-start gap-1">
														{filter.children.map((child, index) => (
															<li key={index} className="flex items-center justify-center gap-2 break-all">
																<Checkbox
																	value={child.title}
																	title={child.title}
																	checked={selectedFilter.includes(child.title)}
																	onCheckedChange={(checked) => {
																		if (checked) {
																			setSelectedFilter([...selectedFilter, child.title]);
																		} else {
																			setSelectedFilter(selectedFilter.filter((filter) => filter !== child.title));
																		}
																	}}
																	className="size-6 rounded-xs"
																/>
																<label
																	htmlFor={child.title}
																	className="text-md text-left leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
																>
																	{child.title}
																</label>
															</li>
														))}
													</ul>
												</AccordionContent>
											</AccordionItem>
										</Accordion>

										{index !== filters.length - 1 && <hr className="border-border h-1 w-full" />}
									</React.Fragment>
								))}
							</aside>

							{(data?.data.length || 0) > 0 ? (
								<div className="grid w-full grid-cols-4 gap-3 max-lg:grid-cols-3 max-sm:grid-cols-2">
									{data?.data
										.filter(
											filters
												.find((filter) => filter.children.some((child) => selectedFilter.includes(child.title)))
												?.children.find((child) => selectedFilter.includes(child.title))?.filterFunction ?? (() => true),
										)
										.sort(sorts.find((sort) => sort.value === selectedSort)?.sortFunction ?? sorts[0].sortFunction)
										.map((product) => (
											<ListItem
												key={product.name}
												product={product}
												onStoreProduct={(newProduct) => {
													const existingProduct = currentCart.find((cartProduct) => cartProduct.product_id === newProduct.product_id);

													if (existingProduct) {
														const index = currentCart.indexOf(existingProduct);
														const updatedProduct = { ...existingProduct, quantity: (existingProduct?.quantity ?? 0) + 1 };
														const newCart = [...currentCart];

														newCart[index] = updatedProduct;
														setCurrentCart(newCart);
														return;
													}

													setCurrentCart([...currentCart, newProduct]);
												}}
											/>
										))}
								</div>
							) : (
								<div className="flex w-full items-center justify-center">
									<h1 className="text-xl font-medium text-black">No products found</h1>
								</div>
							)}
						</div>
					</React.Fragment>
				)}
			</section>
		</RootLayout>
	);
}

function ListItem({ className, product, onStoreProduct }: React.ComponentProps<"li"> & { product: Product; onStoreProduct?: (product: CartProduct) => void }) {
	const product_slug = product.name.toLowerCase().replace(/ /g, "-");

	return (
		<Link
			href={route("product", { product_slug })}
			data={{ product_id: product.product_id }}
			method="get"
			preserveState={true}
			onSuccess={() => {
				window.history.replaceState({}, "", route("product", { product_slug }));
			}}
			className={cn(
				"group flex w-full flex-col items-start justify-start",
				{
					"h-full min-h-[300px]": !product.default_image,
				},
				className,
			)}
		>
			<div
				className={cn("relative w-full overflow-hidden rounded-xs", {
					"h-full min-h-[300px]": !product.default_image,
				})}
			>
				<Button
					type="button"
					variant="link"
					className="absolute top-0 right-0 z-20 size-auto rounded-full hover:scale-110 hover:no-underline"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();

						if (onStoreProduct) {
							onStoreProduct({
								product_id: product.product_id,
								name: product.name,
								price: product.price,
								price_id: product.price_id,
								currency: product.currency,
								stock_available: product.stock_available,
								default_image: product.default_image ?? "",
								quantity: 1,
							});
						}
					}}
				>
					<svg viewBox="0 0 442 442" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-6 stroke-black/60">
						<path
							d="M290.062 193.375V110.5C290.062 92.1835 282.786 74.6172 269.834 61.6654C256.883 48.7137 239.316 41.4375 221 41.4375C202.683 41.4375 185.117 48.7137 172.165 61.6654C159.214 74.6172 151.937 92.1835 151.937 110.5V193.375M361.077 156.671L384.337 377.671C385.626 389.918 376.05 400.562 363.729 400.562H78.2707C75.3647 400.566 72.4906 399.957 69.835 398.777C67.1793 397.597 64.8017 395.872 62.8564 393.713C60.9112 391.554 59.4418 389.01 58.5438 386.246C57.6458 383.482 57.3393 380.561 57.6441 377.671L80.9227 156.671C81.4597 151.579 83.8625 146.867 87.6679 143.443C91.4732 140.018 96.4116 138.124 101.531 138.125H340.469C351.077 138.125 359.972 146.136 361.077 156.671ZM158.844 193.375C158.844 195.207 158.116 196.963 156.821 198.258C155.526 199.554 153.769 200.281 151.937 200.281C150.106 200.281 148.349 199.554 147.054 198.258C145.759 196.963 145.031 195.207 145.031 193.375C145.031 191.543 145.759 189.787 147.054 188.492C148.349 187.196 150.106 186.469 151.937 186.469C153.769 186.469 155.526 187.196 156.821 188.492C158.116 189.787 158.844 191.543 158.844 193.375ZM296.969 193.375C296.969 195.207 296.241 196.963 294.946 198.258C293.651 199.554 291.894 200.281 290.062 200.281C288.231 200.281 286.474 199.554 285.179 198.258C283.884 196.963 283.156 195.207 283.156 193.375C283.156 191.543 283.884 189.787 285.179 188.492C286.474 187.196 288.231 186.469 290.062 186.469C291.894 186.469 293.651 187.196 294.946 188.492C296.241 189.787 296.969 191.543 296.969 193.375Z"
							strokeWidth="36"
						/>
						<path d="M147 271H295M221 197V345" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</Button>

				{!product.default_image && (
					<div className="flex h-full w-full items-center justify-center bg-gray-100">
						<svg className="size-20 animate-pulse text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
							<path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
						</svg>
					</div>
				)}

				{product.default_image && (
					<LazyLoadImage
						key={`main-${product.name}`}
						src={product.default_image}
						alt="main-image-tab"
						height="100%"
						width="100%"
						effect="opacity"
						className={`h-full w-full object-cover opacity-100 transition-all duration-350 ease-linear group-hover:scale-105`}
					/>
				)}
			</div>

			<span className="mt-1 flex w-full flex-col items-start text-wrap break-all">
				<h1 className="text-left text-[0.890rem] leading-6 font-medium tracking-wider text-black group-hover:underline group-hover:decoration-1 md:text-lg">{product.name}</h1>
				{(product.nutrition.calories ?? 0) > 0 && <p className="text-left font-sans text-[0.690rem] font-light text-gray-600 md:-mb-1">{product.nutrition.calories} kcal</p>}
				{product.price && (
					<NumericFormat
						value={product.price / 100}
						prefix={getCurrencySymbol(product.currency.toUpperCase())}
						readOnly={true}
						fixedDecimalScale
						valueIsNumericString
						allowLeadingZeros={false}
						thousandsGroupStyle="wan"
						thousandSeparator=","
						decimalSeparator="."
						decimalScale={2}
						className="text-md md:text-md border-0 p-0 text-left text-[0.850rem] font-medium tracking-wider text-black/70 md:leading-7"
					/>
				)}
			</span>
		</Link>
	);
}
