import "react-lazy-load-image-component/src/effects/blur.css";

import { Link, usePage } from "@inertiajs/react";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BestSellersSection({ className, ...props }: React.ComponentProps<"span">) {
	const bestSellers = usePage().props.most_common_data.best_seller_products;

	const [api, setApi] = React.useState<CarouselApi>();
	const [current, setCurrent] = React.useState(0);
	const [count, setCount] = React.useState(0);

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
		<section id="best-seller-section" className={cn("mx-auto mt-10 flex w-full flex-col items-center justify-start gap-2 px-2 pb-10", className)}>
			<span className="w-full max-w-7xl">
				<div className="flex w-full items-center justify-between pb-2">
					<div className="flex w-full items-center justify-start">
						<h1 className="w-full text-left text-3xl uppercase">Best Sellers</h1>

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
					</div>
				</div>
			</span>

			<Carousel
				opts={{
					dragFree: true,
				}}
				setApi={setApi}
				className="h-auto w-full"
			>
				<CarouselContent containerClassName="overflow-hidden overflow-x-clip overflow-y-visible no-scrollbar">
					{bestSellers.map((category, index) => {
						const product_id = category.product_id;
						return (
							<CarouselItem key={index} data-slide-index={index} className="grow-1 max-sm:basis-1/2 sm:basis-1/3 lg:basis-1/5">
								<Link
									href={route("product", { product_id })}
									name={`best-seller-item ${category.product_name}`}
									aria-label={`Seller item ${category.product_name}`}
									className="group h-full w-full"
								>
									<div className="h-full w-full rounded-xs">
										{category.product_image ? (
											<LazyLoadImage
												key={`main-${index}`}
												src={category.product_image}
												alt="main-image-tab"
												height="100%"
												width="100%"
												effect="blur"
												className="h-full w-full object-cover"
											/>
										) : (
											<div key={`placeholder-${index}`} className="flex h-full w-full items-center justify-center bg-gray-200">
												<svg className="size-20 animate-pulse text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
													<path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
												</svg>
											</div>
										)}
									</div>
								</Link>
								<p className="text-muted-foreground font-prata mt-1 text-left text-lg italic">{category.product_name}</p>
							</CarouselItem>
						);
					})}
				</CarouselContent>
			</Carousel>
		</section>
	);
}
