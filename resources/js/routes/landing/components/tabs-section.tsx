import { Link } from "@inertiajs/react";
import React from "react";

function TabComponent({ tab, index }: { tab: { title: string; img: string; imgPreview: string }; index: number }) {
	const [hovered, setHovered] = React.useState(false);

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
				<img
					key={`main-${index}`}
					src={tab.img}
					alt="" // TODO: Add alt image
					className="absolute inset-0 h-full w-full object-cover opacity-100 transition-transform duration-350 ease-linear group-hover:scale-105"
					style={{ opacity: hovered ? 0 : 1 }}
					loading="lazy"
				/>

				<img
					key={`preview-${index}`}
					src={tab.imgPreview}
					alt="" // TODO: Add alt image
					className="absolute inset-0 h-full w-full object-cover opacity-0 transition-transform duration-350 ease-linear group-hover:scale-105"
					style={{ opacity: hovered ? 1 : 0 }}
					loading="lazy"
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
