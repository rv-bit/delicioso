import { Link } from "@inertiajs/react";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

const items: {
	title: string;
	price: string;
	calories_estimated?: string;
	calories_units?: string;
	img: string;
}[] = [
	{
		title: "6 Cross Buns",
		price: "$12.00",
		calories_estimated: "120",
		calories_units: "kcal",
		img: "/media/landing/items/6_hot_cross_buns.webp",
	},
	{
		title: "Pastrami Sandwich",
		price: "$15.00",
		img: "/media/landing/items/pastrami_sandwich.webp",
	},
	{
		title: "Harisa Chicken Sandwich",
		price: "$15.00",
		img: "/media/landing/items/chicken_sandwich.webp",
	},
	{
		title: "Mini Pain Au Chocolat",
		price: "$10.00",
		img: "/media/landing/items/au_chocolate.webp",
	},
	{
		title: "12 Mini Croissants",
		price: "$15.00",
		img: "/media/landing/items/mini_croissants.webp",
	},
];

function ListItem({ className, category, index }: { className?: string; category: { title: string; img: string; imgPreview: string; href?: string }; index: number }) {
	return (
		<Link href="/" name={`best-seller-item ${category.title}`} aria-label={`Seller item ${category.title}`} className={cn("group h-full w-full", className)}>
			<div className="h-auto w-full rounded-xs">
				<LazyLoadImage key={`main-${index}`} src={category.img} alt="main-image-tab" height="100%" width="100%" effect="blur" className="h-full w-full object-cover" />
			</div>
			<p className="text-muted-foreground font-prata mt-1 text-left text-lg italic">{category.title}</p>
		</Link>
	);
}

export default function BestSellersSection() {
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
		<section id="best-seller-section" className="mx-auto mt-10 flex w-full flex-col items-center justify-start gap-2 px-2">
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
				<CarouselContent containerClassName="overflow-hidden overflow-y-visible no-scrollbar">
					{items.map((item, index) => (
						<CarouselItem key={index} data-slide-index={index} className="max-sm:basis-1/2 sm:basis-1/3 lg:basis-1/5">
							<ListItem category={{ title: item.title, img: item.img, imgPreview: item.img }} index={index} />
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</section>
	);
}
