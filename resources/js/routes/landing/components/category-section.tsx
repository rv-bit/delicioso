import "react-lazy-load-image-component/src/effects/blur.css";

import { Link, usePage } from "@inertiajs/react";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

import { MostCommonCategory } from "@/types";

import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";

import { ChevronLeft, ChevronRight } from "lucide-react";

function ListItem({ category, index, className }: React.ComponentPropsWithoutRef<"li"> & { category: MostCommonCategory; index: number }) {
	const [hovered, setHovered] = React.useState(false);
	const [loaded, setLoaded] = React.useState({
		main: false,
		preview: false,
	});

	const canHover = React.useMemo(() => {
		return category.category_image_preview !== null && loaded.preview;
	}, [category.category_image_preview, loaded.preview]);

	return (
		<Link
			href={`/collections/${category.category_id}`}
			className={cn("group h-full w-full max-w-80", className)}
			onMouseEnter={() => {
				if (!canHover) return;

				setHovered(true);
			}}
			onMouseLeave={() => {
				if (!canHover) return;

				setHovered(false);
			}}
		>
			<div className="relative h-full min-h-80 w-full max-w-80 min-w-50 overflow-hidden rounded-xs">
				{(!loaded.main || (category.category_image_preview !== null && !loaded.preview)) && (
					<div className="absolute inset-0 z-30 flex h-full w-full items-center justify-center bg-gray-200">
						<svg className="size-20 animate-pulse text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
							<path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
						</svg>
					</div>
				)}

				<LazyLoadImage
					key={`main-${index}`}
					src={category.category_image}
					alt={`main-image-tab-${index}`}
					height="100%"
					width="100%"
					effect="opacity"
					className={`absolute inset-0 z-0 h-full w-full object-cover opacity-100 transition-all duration-350 ease-linear group-hover:scale-105`}
					style={{ opacity: hovered ? 0 : 1 }}
					onLoad={() => {
						requestAnimationFrame(() => {
							setLoaded((prevLoaded) => ({ ...prevLoaded, main: true }));
						});
					}}
				/>

				{category.category_image_preview && (
					<LazyLoadImage
						key={`preview-${index}`}
						src={category.category_image_preview}
						alt="preview-image-tab"
						height="100%"
						width="100%"
						effect="opacity"
						className={`absolute inset-0 z-0 h-full w-full object-cover opacity-0 transition-all duration-350 ease-linear group-hover:scale-105`}
						style={{ opacity: hovered ? 1 : 0 }}
						onLoad={() => {
							requestAnimationFrame(() => {
								setLoaded((prevLoaded) => ({ ...prevLoaded, preview: true }));
							});
						}}
					/>
				)}
			</div>
			<p className="text-muted-foreground font-prata mt-1 text-left text-lg italic">{category.category_name}</p>
		</Link>
	);
}

function CategoryMobileSection() {
	const most_common_categories = usePage().props.most_common_data.most_common_categories;

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
		<span className="mt-10 flex flex-col items-center justify-between gap-2 overflow-x-hidden">
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
			<span className="w-full gap-4">
				<Carousel
					opts={{
						dragFree: true,
					}}
					setApi={setApi}
				>
					<CarouselContent containerClassName="overflow-visible">
						{most_common_categories.map((category_id: MostCommonCategory, index) => (
							<CarouselItem key={index} className="basis-1/2 sm:basis-1/3">
								<Link href="/" className="group size-auto h-full w-full rounded-xs">
									<img key={`main-${index}`} src={category_id.category_image} alt="main-image-tab" className={`h-full w-full object-cover`} loading="lazy" />
								</Link>
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>
			</span>
		</span>
	);
}

export default function CategorySection() {
	const most_common_categories = usePage().props.most_common_data.most_common_categories;

	const isTablet = useMediaQuery("(max-width: 990px)");

	if (isTablet) return <CategoryMobileSection />;

	return (
		<span className="mt-10 flex items-center justify-center gap-2">
			<span className="flex w-full items-center justify-center gap-4">
				{most_common_categories.map((category, index) => (
					<ListItem key={index} category={category} index={index} />
				))}
			</span>
		</span>
	);
}
