import { Head, Link, router, usePage } from "@inertiajs/react";
import React from "react";

import { useLocalStorage } from "@/hooks/use-local-storage";

import { cn, format } from "@/lib/utils";
import { CartProduct } from "@/types/cart";

import RootLayout from "@/layouts/root-layout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Minus, Plus, X } from "lucide-react";

export default function Cart() {
	const user = usePage().props.auth.user;
	const [currentCart, setCurrentCart] = useLocalStorage<CartProduct[]>("cart", []);

	return (
		<RootLayout footer={true}>
			<Head title="Cart" />

			<section className="mx-auto mt-20 flex max-w-7xl flex-col items-start justify-start gap-5 px-5">
				{currentCart.length === 0 ? (
					<div
						className={cn("flex w-full flex-col items-center justify-center gap-10", {
							"gap-5": user,
						})}
					>
						<h1 className="text-xl tracking-tight text-black italic md:text-6xl">Your basket is empty</h1>

						<span className="flex flex-col items-center justify-center gap-1">
							<Link href={route("collections")} className="bg-rajah-700 rounded-md p-3 text-sm text-white md:p-5 md:py-3.5 md:text-lg">
								Continue Shopping
							</Link>

							{!user && (
								<>
									<span className="text-sm font-medium md:text-lg">Have an account?</span>
									<p className="flex items-center gap-1 text-sm md:text-lg">
										<Link
											href="login"
											className="text-rajah-600 font-prata font-semibold tracking-wide italic underline decoration-wavy hover:decoration-2 hover:underline-offset-1"
										>
											Log in
										</Link>
										to check out faster.
									</p>
								</>
							)}
						</span>
					</div>
				) : (
					<React.Fragment>
						<span className="flex w-full flex-col items-start justify-between gap-1 break-all sm:flex-row sm:items-end">
							<h1 className="text-5xl font-semibold">Your basket</h1>

							<Link
								href={route("collections")}
								className="hover:text-rajah-500 flex items-center justify-center rounded-md bg-gray-200 px-3 py-1.5 text-sm font-medium whitespace-nowrap text-black transition-colors duration-150 ease-linear hover:bg-gray-300/50"
							>
								Continue shopping
							</Link>
						</span>

						<span className="flex w-full flex-col items-start justify-start gap-2">
							<Table className="max-md:table-fixed max-md:overflow-x-clip">
								<TableHeader>
									<TableRow className="h-15">
										<TableHead className="w-[150px] md:w-[400px]">Product</TableHead>
										<TableHead className="text-center max-md:hidden md:w-[200px]">Quantity</TableHead>
										<TableHead className="w-[50px] text-right md:w-[200px]">Total</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{currentCart.map((product) => (
										<TableRow
											key={product.product_id}
											className={cn("min-h-auto border-b-0 hover:bg-transparent sm:min-h-50", {
												"h-40 min-h-auto": !product.default_image,
											})}
										>
											<TableCell className={cn("w-[500px] pt-4 pb-0 pl-0 align-top font-medium max-md:flex max-md:w-full max-md:max-w-[400px] max-md:flex-col")}>
												<ListItem product={product} />
												<div className="mt-2 hidden w-full items-center justify-start max-md:flex">
													<span className="border-border flex w-[150px] border">
														<Button
															variant={"outline"}
															onClick={() => {
																setCurrentCart((prev) => {
																	if (product.quantity - 1 === 0) {
																		const newCart = [...prev];
																		const index = newCart.findIndex((item) => item.product_id === product.product_id);

																		if (index !== -1) {
																			newCart.splice(index, 1);
																		}

																		return newCart;
																	}

																	const newCart = [...prev];
																	const index = newCart.findIndex((item) => item.product_id === product.product_id);

																	if (index !== -1) {
																		newCart[index] = { ...newCart[index], quantity: newCart[index].quantity - 1 };
																	}

																	return newCart;
																});
															}}
															className="text-muted-foreground flex items-center justify-center rounded-none border-s-0 border-t-0 border-b-0 p-1 sm:p-3"
														>
															<Minus />
														</Button>
														<Input
															value={product.quantity}
															type="number"
															min={1}
															onChange={(e) => {
																if (e.target.value === "") {
																	setCurrentCart((prev) => {
																		const newCart = [...prev];
																		const index = newCart.findIndex((item) => item.product_id === product.product_id);

																		if (index !== -1) {
																			newCart[index] = { ...newCart[index], quantity: 1 };
																		}

																		return newCart;
																	});
																	return;
																}

																const value = parseInt(e.target.value, 10);

																setCurrentCart((prev) => {
																	const newCart = [...prev];
																	const index = newCart.findIndex((item) => item.product_id === product.product_id);

																	if (index !== -1) {
																		newCart[index] = { ...newCart[index], quantity: value };
																	}

																	return newCart;
																});
															}}
															className={cn("w-fit rounded-none border-s-0 border-t-0 border-b-0 p-1 text-center text-xs tabular-nums shadow-none sm:text-base")}
														/>
														<Button
															variant={"outline"}
															onClick={() => {
																setCurrentCart((prev) => {
																	const newCart = [...prev];
																	const index = newCart.findIndex((item) => item.product_id === product.product_id);

																	if (index !== -1) {
																		newCart[index] = { ...newCart[index], quantity: newCart[index].quantity + 1 };
																	}

																	return newCart;
																});
															}}
															className="text-muted-foreground flex items-center justify-center rounded-none border-e-0 border-t-0 border-b-0 border-l-0 p-1 sm:p-3"
														>
															<Plus />
														</Button>
													</span>

													<Button
														variant={"link"}
														onClick={() => {
															setCurrentCart((prev) => {
																const newCart = [...prev];
																const index = newCart.findIndex((item) => item.product_id === product.product_id);

																if (index !== -1) {
																	newCart.splice(index, 1);
																}

																return newCart;
															});
														}}
														className="text-muted-foreground flex items-center justify-center hover:text-red-500"
													>
														<X />
													</Button>
												</div>
											</TableCell>
											<TableCell className="pt-4 pr-4 pb-0 text-center align-top max-md:hidden max-md:w-[200px]">
												<div className="flex w-full items-center justify-center">
													<Button
														variant={"link"}
														onClick={() => {
															setCurrentCart((prev) => {
																const newCart = [...prev];
																const index = newCart.findIndex((item) => item.product_id === product.product_id);

																if (index !== -1) {
																	newCart.splice(index, 1);
																}

																return newCart;
															});
														}}
														className="text-muted-foreground flex items-center justify-center hover:text-red-500"
													>
														<X />
													</Button>
													<span className="border-border flex w-[150px] border">
														<Button
															variant={"outline"}
															onClick={() => {
																setCurrentCart((prev) => {
																	if (product.quantity - 1 === 0) {
																		const newCart = [...prev];
																		const index = newCart.findIndex((item) => item.product_id === product.product_id);

																		if (index !== -1) {
																			newCart.splice(index, 1);
																		}

																		return newCart;
																	}

																	const newCart = [...prev];
																	const index = newCart.findIndex((item) => item.product_id === product.product_id);

																	if (index !== -1) {
																		newCart[index] = { ...newCart[index], quantity: newCart[index].quantity - 1 };
																	}

																	return newCart;
																});
															}}
															className="text-muted-foreground flex items-center justify-center rounded-none border-s-0 border-t-0 border-b-0 p-1 sm:p-3"
														>
															<Minus />
														</Button>
														<Input
															value={product.quantity}
															type="number"
															min={1}
															onChange={(e) => {
																if (e.target.value === "") {
																	setCurrentCart((prev) => {
																		const newCart = [...prev];
																		const index = newCart.findIndex((item) => item.product_id === product.product_id);

																		if (index !== -1) {
																			newCart[index] = { ...newCart[index], quantity: 1 };
																		}

																		return newCart;
																	});
																	return;
																}

																const value = parseInt(e.target.value, 10);

																setCurrentCart((prev) => {
																	const newCart = [...prev];
																	const index = newCart.findIndex((item) => item.product_id === product.product_id);

																	if (index !== -1) {
																		newCart[index] = { ...newCart[index], quantity: value };
																	}

																	return newCart;
																});
															}}
															className={cn("w-fit rounded-none border-s-0 border-t-0 border-b-0 p-1 text-center text-xs tabular-nums shadow-none sm:text-base")}
														/>
														<Button
															variant={"outline"}
															onClick={() => {
																setCurrentCart((prev) => {
																	const newCart = [...prev];
																	const index = newCart.findIndex((item) => item.product_id === product.product_id);

																	if (index !== -1) {
																		newCart[index] = { ...newCart[index], quantity: newCart[index].quantity + 1 };
																	}

																	return newCart;
																});
															}}
															className="text-muted-foreground flex items-center justify-center rounded-none border-e-0 border-t-0 border-b-0 border-l-0 p-1 sm:p-3"
														>
															<Plus />
														</Button>
													</span>
												</div>
											</TableCell>
											<TableCell className="w-[200px] pt-4 pr-0 pb-0 text-right align-top max-md:w-auto max-md:max-w-[50px]">
												<p className="text-right text-[0.950rem] leading-5 font-normal tracking-wider text-black sm:text-lg">
													{format((product.price * (product.quantity || 0)) / 100, product.currency)}
												</p>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>

							<hr className="my-5 w-full border-t border-gray-200" />
						</span>

						<span className="flex w-full flex-col items-start justify-start gap-2 sm:items-end sm:justify-end">
							<span className="flex w-full justify-start gap-2 sm:items-center sm:justify-end">
								<span className="flex w-full items-center justify-start gap-2 break-all sm:justify-end">
									<span className="text-[0.950rem] font-normal tracking-wider text-black sm:text-xl">Subtotal</span>
									<span className="text-[0.950rem] font-normal tracking-wider text-black sm:text-xl">
										{format(currentCart.reduce((acc, product) => acc + product.price * (product.quantity || 0), 0) / 100, currentCart[0].currency)}
									</span>
								</span>
							</span>

							<Button
								onClick={() => {
									const formData = new FormData();

									currentCart.forEach((product) => {
										formData.append("items[]", JSON.stringify({ price: product.price_id, quantity: product.quantity }));
									});

									router.post("/payment/checkout", formData, {
										preserveState: false,
									});
								}}
								className="bg-rajah-500 hover:bg-rajah-600 h-12 rounded-md p-4 text-center text-sm text-white transition-colors duration-200 ease-in-out md:p-5 md:py-3.5 md:text-lg"
							>
								Proceed to checkout
							</Button>
						</span>
					</React.Fragment>
				)}
			</section>
		</RootLayout>
	);
}

function ListItem({ className, product }: React.ComponentProps<"li"> & { product: CartProduct }) {
	const product_slug = product.name.toLowerCase().replace(/ /g, "-");

	return (
		<Link
			href={route("product", { product_slug })}
			data={{ product_id: product.product_id }}
			method="get"
			preserveState={true}
			onSuccess={() => {
				window.history.replaceState({}, "", route("product", { product_slug }));
			}}
			className={cn(
				"group flex h-full w-full items-start justify-start gap-3",
				{
					"h-40": !product.default_image,
				},
				className,
			)}
		>
			{!product.default_image && (
				<div className="flex h-full w-full items-center justify-center">
					<svg className="size-10 animate-pulse text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
						<path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
					</svg>
				</div>
			)}

			{product.default_image && <img key={`main-${product.name}`} src={product.default_image} alt="main-image-tab" loading="lazy" className="size-5/12 object-cover opacity-100 sm:size-4/12" />}

			<span className="mt-1 flex w-full flex-col items-start text-wrap break-all">
				<h1 className="text-left text-[0.950rem] leading-7 font-medium tracking-wider text-black underline-offset-3 group-hover:underline group-hover:decoration-2 sm:text-lg">
					{product.name}
				</h1>
				<p className="border-0 bg-transparent p-0 text-left text-[0.890rem] font-normal tracking-wider text-black tabular-nums focus-within:ring-0">
					{format(product.price / 100, product.currency)}
				</p>
			</span>
		</Link>
	);
}
