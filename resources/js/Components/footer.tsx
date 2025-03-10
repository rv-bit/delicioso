export default function Footer() {
	return (
		<footer
			style={{
				height: "auto",
				width: "100%",
				flex: "1 1 0%",
			}}
			className="border-border border-t bg-[#1B1B1B]"
		>
			<div className="container p-5">
				<p className="text-muted-foreground text-sm">
					© 2021 shadcn/ui. All rights reserved.
				</p>
			</div>
		</footer>
	);
}
