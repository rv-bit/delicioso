import { Head, Link } from "@inertiajs/react";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { cn } from "@/lib/utils";

import RootLayout from "@/layouts/root-layout";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

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
		children: ["Under $50", "$50 - $100", "$100 - $200", "$200 & Above"],
		defaultOpen: true,
	},
	{
		title: "Serves",
		children: ["1 - 2", "3 - 4", "5 - 6", "7 & Above"],
		defaultOpen: false,
	},
];

export default function Collections({ category }: { category: string }) {
	const [selectedFilter, setSelectedFilter] = React.useState<string[]>([]);

	return (
		<RootLayout footer={true}>
			<Head title="Collections" />

			<section className="mx-auto mt-20 flex max-w-7xl flex-col items-start justify-start gap-5 px-2 md:px-5">
				<section className="flex flex-col">
					<h1 className="text-4xl font-semibold text-black">{category}</h1>
					<p className="text-lg font-medium text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
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

										<AccordionContent>
											<ul className="flex flex-col items-start gap-1">
												{filter.children.map((child, index) => (
													<li key={index} className="flex items-center justify-center gap-2">
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
														<label htmlFor={child} className="text-md leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
					<div className="no-scrollbar grid w-full grid-cols-4 gap-3 overflow-y-visible max-lg:grid-cols-3 max-sm:grid-cols-2">
						<ListItem item={{ title: "6 HOT CROSS BUNSdwadwdawdwadwadwawadwadwadwa", img: "/media/landing/items/6_hot_cross_buns.webp", calories: 250, price: 10.24 }} index={0} />
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
