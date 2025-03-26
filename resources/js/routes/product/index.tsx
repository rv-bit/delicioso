import "react-lazy-load-image-component/src/effects/blur.css";

import { Head } from "@inertiajs/react";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { toast } from "sonner";

import { useLocalStorage } from "@/hooks/use-local-storage";

import { cn, format } from "@/lib/utils";

import { CartProduct } from "@/types/cart";
import { NutritionalFacts } from "@/types/stripe";

import RootLayout from "@/layouts/root-layout";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";

import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";

import BestSellersSection from "../landing/components/best-sellers";

interface Product {
	product_category_slug: string;
	product_id: string;
	product_name: string;
	product_price: number;
	product_price_id: string;
	product_currency: string;
	product_description: string;
	product_images: string[];
	product_nutrition: NutritionalFacts;
	stock_available: boolean;
	stock: number | null;
}

interface ListProps {
	title: string;
	data?: string;
	component?: React.ComponentType;
}

export default function Index({ product }: { product: Product }) {
	const [currentCart, setCurrentCart] = useLocalStorage<CartProduct[]>("cart", []);

	const [quantity, setQuantity] = React.useState(1);
	const [activeImage, setActiveImage] = React.useState(product.product_images[0]);

	const [api, setApi] = React.useState<CarouselApi>();
	const [current, setCurrent] = React.useState(0);
	const [count, setCount] = React.useState(0);

	const lists: ListProps[] = React.useMemo(() => {
		return [
			{
				title: "Description",
				data: product.product_description as string,
			},
			{
				title: "Nutritional Facts",
				component: () => <NutritionalTable nutrition={product.product_nutrition} />,
			},
		];
	}, []);

	React.useEffect(() => {
		if (!api) {
			return;
		}

		setCount(api.scrollSnapList().length);
		setCurrent(api.selectedScrollSnap() + 1);

		api.on("select", () => {
			setCurrent(api.selectedScrollSnap() + 1);
		});
	}, [api]);

	return (
		<RootLayout footer={true}>
			<Head title={`${product.product_name}`} />
			<section className="mx-auto mt-10 flex max-w-7xl flex-col items-start justify-start gap-5 px-2 sm:mt-20">
				<span className="flex w-full items-start justify-center gap-10 max-lg:flex-col">
					<div className="size-2/4 rounded-xs max-lg:w-full">
						{activeImage ? (
							<LazyLoadImage key={`main-${product.product_name}`} src={activeImage} alt="main-image-tab" height="100%" width="100%" effect="blur" className="size-full object-cover" />
						) : (
							<div key={`placeholder-${product.product_name}`} className="flex h-full w-full items-center justify-center bg-gray-200">
								<svg className="size-20 animate-pulse text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
									<path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
								</svg>
							</div>
						)}

						{product.product_images.length >= 1 && (
							<span className="flex w-full flex-col gap-1">
								<Carousel
									opts={{
										dragFree: false,
									}}
									setApi={setApi}
									className="mt-2 w-full"
								>
									<CarouselContent className="-ml-4 max-h-full max-w-full">
										{product.product_images.map((image, index) => (
											<CarouselItem key={index} data-slide-index={index} className="size-full max-h-1/4 max-w-1/4 grow-1 basis-1/3 last:pr-0 lg:basis-1/5">
												<LazyLoadImage
													onClick={() => setActiveImage(image)}
													key={`thumbnail-${index + 1}`}
													src={image}
													alt={`thumbnail-${index + 1}`}
													height="100"
													width="100"
													effect="blur"
													className={cn("size-full border-0 object-cover", {
														"border border-black": activeImage === image,
													})}
												/>
											</CarouselItem>
										))}
									</CarouselContent>
								</Carousel>

								<span className="flex w-full items-center justify-end">
									<Button aria-label="Previous Category Button" name="prev-category-button" variant={"link"} size={"sm"} className="group" onClick={() => api?.scrollPrev()}>
										<ChevronLeft size={20} />
									</Button>

									<h1 className="text-md text-right">
										{current} / {count}
									</h1>

									<Button aria-label="Next Category Button" name="next-category-button" variant={"link"} size={"sm"} className="group" onClick={() => api?.scrollNext()}>
										<ChevronRight size={20} />
									</Button>
								</span>
							</span>
						)}
					</div>

					<div className="flex w-2/5 flex-col justify-end gap-10 max-lg:w-full">
						<div className="flex w-full flex-col justify-end">
							{product.stock !== null && (
								<p
									className={cn("mb-5 flex w-fit items-center justify-center rounded-md bg-red-300/50 px-2 py-1.5 text-[0.650rem] font-medium whitespace-nowrap text-black", {
										"bg-red-500/70": product.stock === 0,
									})}
								>
									{product.stock === 0 ? "Out of stock" : product.stock === 1 ? "Only 1 left" : `Only ${product.stock} left`}
								</p>
							)}

							<h1 className="text-5xl font-bold text-black">{product.product_name}</h1>
							<p className="text-xl font-semibold text-black/80">{format(product.product_price / 100, product.product_currency)}</p>
						</div>

						<div className="flex w-full flex-col items-start justify-start gap-1">
							<p className="text-xl text-black/60">Quantity:</p>
							<span className="border-border flex h-[45px] w-full max-w-[250px] border">
								<Button
									disabled={!product.stock_available}
									variant={"outline"}
									onClick={() => {
										setQuantity((prev) => {
											if (prev <= 1) {
												return 1;
											}

											return prev - 1;
										});
									}}
									className="text-muted-foreground flex h-full grow-1 items-center justify-center rounded-none border-s-0 border-t-0 border-b-0 p-1 sm:p-3"
								>
									<Minus />
								</Button>
								<Input
									disabled={!product.stock_available}
									value={quantity}
									type="number"
									min={1}
									onChange={(e) => {
										if (e.target.value === "") {
											setQuantity(1);
											return;
										}

										const value = parseInt(e.target.value, 10);
										if (value <= 0) {
											setQuantity(1);
											return;
										}

										if (product.stock && value > product.stock) {
											setQuantity(product.stock);
											toast.error("You can't add more than the available stock");
											return;
										}

										setQuantity(value);
									}}
									className={cn("h-full w-fit grow-1 rounded-none border-s-0 border-t-0 border-b-0 p-1 text-center text-xs tabular-nums shadow-none sm:text-base")}
								/>
								<Button
									disabled={!product.stock_available}
									variant={"outline"}
									onClick={() => {
										if (product.stock && quantity + 1 > product.stock) {
											setQuantity(product.stock);
											toast.error("You can't add more than the available stock");
											return;
										}

										setQuantity((prev) => prev + 1);
									}}
									className="text-muted-foreground flex h-full grow-1 items-center justify-center rounded-none border-e-0 border-t-0 border-b-0 border-l-0 p-1 sm:p-3"
								>
									<Plus />
								</Button>
							</span>
						</div>

						<Button
							type="button"
							disabled={!product.stock_available}
							onClick={() => {
								const cartProduct = currentCart.find((cartProduct) => cartProduct.product_id === product.product_id);

								if (cartProduct) {
									setCurrentCart((prev) => {
										const index = prev.findIndex((cartProduct) => cartProduct.product_id === product.product_id);
										const updatedCart = [...prev];
										updatedCart[index].quantity += quantity;

										return updatedCart;
									});
								} else {
									setCurrentCart((prev) => [
										...prev,
										{
											product_id: product.product_id,
											name: product.product_name,
											default_image: product.product_images[0],
											price: product.product_price,
											price_id: product.product_price_id,
											currency: product.product_currency,
											quantity: quantity,
										},
									]);
								}
							}}
							className="group border-tequila-200 bg-rajah-200 hover:bg-rajah-200 hover:inset-ring-rajah-200 relative h-15 w-full overflow-hidden rounded-none border-2 px-3 py-6 inset-ring-2 inset-ring-black/60 transition-shadow delay-75 duration-300"
						>
							<div className="absolute -left-16 h-[100px] w-10 -rotate-45 bg-gradient-to-r from-white/10 via-white/50 to-white/10 blur-sm duration-700 group-hover:left-[150%] group-hover:delay-200 group-hover:duration-700" />
							<span className="font-bold text-black uppercase">Add to cart</span>
						</Button>

						<Accordion type="multiple" className="w-full">
							{lists.map((item, index) => (
								<AccordionItem key={index} value={item.title} className="border-border border-t border-b-0 hover:text-black">
									<AccordionTrigger className="pb-2">
										<h1 className="text-xl font-medium tracking-tight text-black">{item.title}</h1>
									</AccordionTrigger>

									<AccordionContent>
										<ul className="flex flex-col gap-1">
											{item.component && <item.component />}
											{item.data && <li className="text-base font-medium">{item.data}</li>}
										</ul>
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</div>
				</span>
			</section>

			<BestSellersSection className="mt-20" />
		</RootLayout>
	);
}

function NutritionalTable({ nutrition, className, ...props }: React.ComponentProps<"ul"> & { nutrition: NutritionalFacts }) {
	const isEveryValueZero = Object.values(nutrition).every((value) => value === 0 || value === null);

	console.log(nutrition, isEveryValueZero);

	if (isEveryValueZero) {
		return (
			<ul className="flex flex-col gap-1">
				<li className="text-base font-medium">No nutritional facts available</li>
			</ul>
		);
	}

	const kj = nutrition?.calories || 0 * 4.184;
	return (
		<ul>
			<li className="border-border flex justify-between border-b text-lg font-semibold">
				<span>Energy</span>
				<span className="font-medium">
					{nutrition.calories} kcal ({kj} kJ)
				</span>
			</li>
			<li className="border-border flex flex-col justify-between border-b text-lg font-semibold">
				<ul className="flex justify-between">
					<span>Fat</span>
					<span className="font-medium">{nutrition.fat}g</span>
				</ul>
				<ul className="flex justify-between text-base">
					<span>of which saturates</span>
					<span className="font-medium">{nutrition.fat_of_saturated}g</span>
				</ul>
			</li>
			<li className="border-border flex flex-col justify-between border-b text-lg font-semibold">
				<ul className="flex justify-between">
					<span>Carbs</span>
					<span className="font-medium">{nutrition.carbs}g</span>
				</ul>
				<ul className="flex justify-between text-base">
					<span>of which sugar</span>
					<span className="font-medium">{nutrition.carbs_of_sugar}g</span>
				</ul>
			</li>
			<li className="border-border flex justify-between border-b text-lg font-semibold">
				<span>Protein</span>
				<span className="font-medium">{nutrition.proteins}g</span>
			</li>
			<li className="border-border flex justify-between border-b text-lg font-semibold">
				<span>Sodium</span>
				<span className="font-medium">{nutrition.sodium}mg</span>
			</li>
		</ul>
	);
}
