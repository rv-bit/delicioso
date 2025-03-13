import { Link } from "@inertiajs/react";
import React from "react";

function TabComponent({ tab, index }: { tab: { title: string; img: string; imgPreview: string }; index: number }) {
	const [hovered, setHovered] = React.useState(false);
	const [loaded, setLoaded] = React.useState({
		main: false,
		preview: false,
	});

	return (
		<Link
			href="/"
			className="group h-full w-full max-w-80"
			onMouseEnter={() => {
				setHovered(true);
			}}
			onMouseLeave={() => {
				setHovered(false);
			}}
		>
			<div className="relative h-full min-h-80 w-full max-w-80 min-w-50 overflow-hidden rounded-xs">
				{(!loaded.main || !loaded.preview) && (
					<div className="absolute inset-0 z-30 flex h-full w-full items-center justify-center bg-gray-200">
						<svg className="size-20 animate-pulse text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
							<path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
						</svg>
					</div>
				)}

				<img
					key={`main-${index}`}
					src={tab.img}
					alt="main-image-tab"
					className={`group-hover:scale-105" absolute inset-0 z-0 h-full w-full object-cover transition-all duration-350 ease-linear ${loaded.main ? "opacity-100" : "opacity-0"}`}
					style={{ opacity: hovered ? 0 : 1 }}
					loading="lazy"
					onLoad={() => {
						requestAnimationFrame(() => {
							setLoaded((prevLoaded) => ({ ...prevLoaded, main: true }));
						});
					}}
				/>

				<img
					key={`preview-${index}`}
					src={tab.imgPreview}
					alt="preview-image-tab"
					className={`absolute inset-0 z-0 h-full w-full object-cover opacity-0 transition-all duration-350 ease-linear group-hover:scale-105 ${loaded.preview ? "opacity-100" : "opacity-0"}`}
					style={{ opacity: hovered ? 1 : 0 }}
					loading="lazy"
					onLoad={() => {
						requestAnimationFrame(() => {
							setLoaded((prevLoaded) => ({ ...prevLoaded, preview: true }));
						});
					}}
				/>
			</div>
			<p className="text-muted-foreground font-prata mt-1 text-left text-lg italic">{tab.title}</p>
		</Link>
	);
}

export default function TabsSection({ data }: { data: Array<{ title: string; img: string; imgPreview: string; href?: string }> }) {
	return (
		<span className="mt-10 flex items-center justify-center gap-2">
			<span className="flex w-full items-center justify-center gap-4">
				{data.map((tab, index) => (
					<TabComponent key={index} tab={tab} index={index} />
				))}
			</span>
		</span>
	);
}
