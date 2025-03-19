import RootLayout from "@/layouts/root-layout";
import { Link } from "@inertiajs/react";

export default function Error({ statusCode }: { statusCode: number }) {
	const title = {
		503: "Service Unavailable",
		500: "Server Error",
		404: "Oh, crumbs", // 404: "Not Found",
		403: "Oh, crumbs", // 403: "Forbidden",
	}[statusCode];

	const description = {
		503: "Sorry, we are doing some maintenance. Please check back soon.",
		500: "Whoops, something went wrong on our servers.",
		404: "We can’t find the page you’re looking for. Please return to our homepage or get in touch with us.",
		403: "Sorry, you are forbidden from accessing this page.",
	}[statusCode];

	return (
		<RootLayout footer={true}>
			<div className="mx-auto mt-20 flex flex-col items-start justify-center gap-5 px-2">
				<span className="flex w-full flex-col items-center justify-center text-center">
					<h1 className="text-6xl font-bold">{title}</h1>
					<p className="text-lg">{description}</p>
				</span>

				<span className="flex w-full items-center justify-center">
					<Link
						href="/"
						className="group relative size-auto w-fit overflow-hidden rounded-none border-2 border-black bg-black p-3.5 px-10 inset-ring-2 inset-ring-white transition-shadow delay-75 duration-300 hover:bg-black hover:inset-ring-black"
					>
						<div className="absolute -left-16 h-[100px] w-10 -rotate-45 bg-gradient-to-r from-white/10 via-white/50 to-white/10 blur-sm duration-700 group-hover:left-[150%] group-hover:delay-200 group-hover:duration-700" />
						<span className="font-bold text-white uppercase">Homepage</span>
					</Link>
				</span>
			</div>
		</RootLayout>
	);
}
