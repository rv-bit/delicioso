import { Head, Link, usePage } from "@inertiajs/react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { cn } from "@/lib/utils";

import RootLayout from "@/layouts/root-layout";

interface ItemData {
	title: string;
	img: string;
}

export default function Collections({ category }: { category: string }) {
	const categories = usePage().props.categories.labels;
	const categoriesImages = usePage().props.categories.images;

	console.log(categories, categoriesImages);

	return (
		<RootLayout footer={true}>
			<Head title="Collections" />

			<section className="mx-auto mt-20 flex max-w-7xl flex-col items-start justify-start gap-5 px-2 md:px-5">
				<section className="flex w-full flex-col gap-1">
					<h1 className="text-4xl font-semibold text-black">Collections</h1>
					<span className="max-sm:no-scrollbar flex h-auto max-sm:overflow-x-scroll">
						{Object.keys(categories).map((category, index) => (
							<Link
								key={index}
								href={`/collections/${category}`}
								className="mr-2 flex items-center justify-center rounded-md bg-gray-200 px-3 py-1.5 text-sm font-medium whitespace-nowrap text-black transition-colors duration-150 ease-linear hover:bg-gray-300"
							>
								{categories[category]}
							</Link>
						))}
					</span>
				</section>

				<div className="flex h-full w-full gap-5">
					<div className="grid w-full grid-cols-2 gap-2 space-y-4">
						{Object.keys(categories).map((category, index) => (
							<Link key={index} href={`/collections/${category}`} className={cn("group flex h-auto w-full flex-col items-start justify-start")}>
								<div className="relative w-full overflow-hidden rounded-xs">
									<LazyLoadImage
										key={`main-${index}`}
										src={categoriesImages[category]}
										alt="main-image-tab"
										effect="opacity"
										width={"100%"}
										className="h-full w-full object-cover opacity-100 transition-all duration-150 ease-linear group-hover:scale-110"
									/>
								</div>

								<span className="mt-1 flex w-full flex-col items-start text-wrap break-all">
									<h1 className="text-left text-[0.890rem] leading-6 font-medium tracking-wider text-black group-hover:underline group-hover:decoration-1 md:text-lg">
										{categories[category]}
									</h1>
								</span>
							</Link>
						))}
					</div>
				</div>
			</section>
		</RootLayout>
	);
}
