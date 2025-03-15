export default function Error({ statusCode }: { statusCode: number }) {
	const title = {
		503: "503: Service Unavailable",
		500: "500: Server Error",
		404: "404: Page Not Found",
		403: "403: Forbidden",
	}[statusCode];

	const description = {
		503: "Sorry, we are doing some maintenance. Please check back soon.",
		500: "Whoops, something went wrong on our servers.",
		404: "Sorry, the page you are looking for could not be found.",
		403: "Sorry, you are forbidden from accessing this page.",
	}[statusCode];

	return (
		<div className="flex h-screen items-center justify-center">
			<div className="text-center">
				<h1 className="text-6xl font-bold">{title}</h1>
				<p className="mt-4 text-lg">{description}</p>
			</div>
		</div>
	);
}
