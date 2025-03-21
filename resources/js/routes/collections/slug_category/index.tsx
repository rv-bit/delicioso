import { Head, Link } from "@inertiajs/react";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { cn } from "@/lib/utils";

import RootLayout from "@/layouts/root-layout";

import { Checkbox } from "@/components/ui/checkbox";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerNestedContent, DrawerNestedRoot, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

interface ItemData {
	title: string;
	img: string;
	imgPreview?: string;
	calories?: number;
	price?: number;
}

const filters = [
	{
		title: "All",
		children: ["New Arrivals", "Best Sellers"],
		defaultOpen: true,
	},
	{
		title: "Price",
		children: ["Under $50", "$50 - $100", "$100 - $200", "$200 & Above dawdwadawdwadwadwadwa"],
		defaultOpen: true,
	},
	{
		title: "Serves",
		children: ["1 - 2", "3 - 4", "5 - 6", "7 & Above"],
		defaultOpen: false,
	},
];

const sorts = [
	{
		title: "Featured",
		value: "featured",
		default: true,
	},
	{
		title: "Best Selling",
		value: "best-selling",
	},
	{
		title: "Alphabetically, A-Z",
		value: "a-z",
	},
	{
		title: "Alphabetically, Z-A",
		value: "z-a",
	},
	{
		title: "Price, low to high",
		value: "low-to-high",
	},
	{
		title: "Price, high to low",
		value: "high-to-low",
	},
	{
		title: "Date, old to new",
		value: "old-to-new",
	},
	{
		title: "Date, new to old",
		value: "new-to-old",
	},
];

export default function Products({ category }: { category: string }) {
	const isTablet = useMediaQuery("(max-width: 1024px)");

	const [selectedFilter, setSelectedFilter] = React.useState<string[]>([]);
	const [selectedSort, setSelectedSort] = React.useState<string>("featured");

	const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);

	return (
		<RootLayout footer={true}>
			<Head title={category} />

			<section className="mx-auto mt-20 flex max-w-7xl flex-col items-start justify-start gap-3 px-2 md:px-5">
				<section className="flex w-full flex-col gap-2">
					<span className="flex flex-col">
						<h1 className="text-4xl font-semibold text-black">{category}</h1>
						<p className="text-lg font-medium text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
					</span>

					<section id="sort-section" className="flex w-full items-center justify-end gap-2 max-lg:hidden">
						<h1 className="text-md font-medium text-black">Sort by:</h1>
						<Select onValueChange={setSelectedSort} defaultValue={selectedSort}>
							<SelectTrigger size="sm" className="max-h-[50px] w-[180px] focus-visible:ring-0">
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
								<h1 className="text-md font-medium">Filters & Sort</h1>
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
															value={child}
															title={child}
															checked={selectedFilter.includes(child)}
															onCheckedChange={(checked) => {
																if (checked) {
																	setSelectedFilter([...selectedFilter, child]);
																} else {
																	setSelectedFilter(selectedFilter.filter((filter) => filter !== child));
																}
															}}
															className="size-5.5 rounded-xs"
														/>
														<label htmlFor={child} className="sm:text-md text-sm leading-none font-light peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
															{child}
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
					)}
				</section>

				<div className="flex h-full w-full gap-5">
					<aside id="filters-section" className="sticky top-25 flex h-full min-h-90 min-w-60 flex-col gap-4 max-lg:hidden">
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
															value={child}
															title={child}
															checked={selectedFilter.includes(child)}
															onCheckedChange={(checked) => {
																if (checked) {
																	setSelectedFilter([...selectedFilter, child]);
																} else {
																	setSelectedFilter(selectedFilter.filter((filter) => filter !== child));
																}
															}}
															className="size-6 rounded-xs"
														/>
														<label htmlFor={child} className="text-md text-left leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
															{child}
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

					<div className="grid w-full grid-cols-4 gap-3 max-lg:grid-cols-3 max-sm:grid-cols-2">
						<ListItem item={{ title: "6 HOT CROSS BUN", img: "/media/landing/items/6_hot_cross_buns.webp", calories: 250, price: 10.24 }} index={0} />
						<ListItem item={{ title: "6 HOT CROSS BUNS", img: "/media/landing/items/6_hot_cross_buns.webp", calories: 250, price: 10.24 }} index={0} />
						<ListItem item={{ title: "6 HOT CROSS BUNS", img: "/media/landing/items/6_hot_cross_buns.webp", calories: 250, price: 10.24 }} index={0} />
						<ListItem item={{ title: "6 HOT CROSS BUNS", img: "/media/landing/items/6_hot_cross_buns.webp", calories: 250, price: 10.24 }} index={0} />
						<ListItem item={{ title: "6 HOT CROSS BUNS", img: "/media/landing/items/6_hot_cross_buns.webp", calories: 250, price: 10.24 }} index={0} />
						<ListItem item={{ title: "6 HOT CROSS BUNS", img: "/media/landing/items/6_hot_cross_buns.webp", calories: 250, price: 10.24 }} index={0} />
						<ListItem item={{ title: "6 HOT CROSS BUNS", img: "/media/landing/items/6_hot_cross_buns.webp", calories: 250, price: 10.24 }} index={0} />
						<ListItem item={{ title: "6 HOT CROSS BUNS", img: "/media/landing/items/6_hot_cross_buns.webp", calories: 250, price: 10.24 }} index={0} />
						<ListItem item={{ title: "6 HOT CROSS BUNS", img: "/media/landing/items/6_hot_cross_buns.webp", calories: 250, price: 10.24 }} index={0} />
						<ListItem item={{ title: "6 HOT CROSS BUNS", img: "/media/landing/items/6_hot_cross_buns.webp", calories: 250, price: 10.24 }} index={0} />
						<ListItem item={{ title: "6 HOT CROSS BUNS", img: "/media/landing/items/6_hot_cross_buns.webp", calories: 250, price: 10.24 }} index={0} />
						<ListItem item={{ title: "6 HOT CROSS BUNS", img: "/media/landing/items/6_hot_cross_buns.webp", calories: 250, price: 10.24 }} index={0} />
						<ListItem item={{ title: "6 HOT CROSS BUNS", img: "/media/landing/items/6_hot_cross_buns.webp", calories: 250, price: 10.24 }} index={0} />
						<ListItem item={{ title: "6 HOT CROSS BUNS", img: "/media/landing/items/6_hot_cross_buns.webp", calories: 250, price: 10.24 }} index={0} />
						<ListItem item={{ title: "6 HOT CROSS BUNS", img: "/media/landing/items/6_hot_cross_buns.webp", calories: 250, price: 10.24 }} index={0} />
					</div>
				</div>
			</section>
		</RootLayout>
	);
}

export function ListItem({ className, item, index }: { className?: string; item: ItemData; index: number }) {
	const [hovered, setHovered] = React.useState(false);

	const canHover = React.useMemo(() => {
		return item.imgPreview !== undefined && hovered;
	}, [item.imgPreview, hovered]);

	return (
		<Link
			href="/"
			className={cn("group flex w-full flex-col items-start justify-start", className)}
			onMouseEnter={() => {
				setHovered(true);
			}}
			onMouseLeave={() => {
				setHovered(false);
			}}
		>
			<div className="relative w-full overflow-hidden rounded-xs">
				<LazyLoadImage
					key={`main-${index}`}
					src={item.img}
					alt="main-image-tab"
					height="100%"
					width="100%"
					effect="opacity"
					className={`group-hover:scale-105" h-full w-full object-cover opacity-100 transition-all duration-350 ease-linear`}
					style={{ opacity: canHover ? 0 : 1 }}
				/>

				{item.imgPreview && (
					<LazyLoadImage
						key={`preview-${index}`}
						src={item.imgPreview}
						alt="preview-image-tab"
						height="100%"
						width="100%"
						effect="opacity"
						className={`h-full w-full object-cover opacity-0 transition-all duration-350 ease-linear group-hover:scale-105`}
						style={{ opacity: hovered ? 1 : 0 }}
					/>
				)}
			</div>

			<span className="mt-1 flex w-full flex-col items-start text-wrap break-all">
				<h1 className="text-left text-[0.890rem] leading-6 font-medium tracking-wider text-black group-hover:underline group-hover:decoration-1 md:text-lg">{item.title}</h1>
				{item.calories && <p className="text-left font-sans text-[0.750rem] font-medium text-gray-600 md:-mb-1 md:text-xs">{item.calories} kcal</p>}
				{item.price && <p className="text-md md:text-md text-left text-[0.850rem] font-medium tracking-wider text-black/70 md:leading-7">${item.price}</p>}
			</span>
		</Link>
	);
}
