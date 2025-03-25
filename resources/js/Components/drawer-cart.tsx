import { Link, router } from "@inertiajs/react";
import axios from "axios";
import React from "react";

import { useLocalStorage } from "@/hooks/use-local-storage";

import { cn, format } from "@/lib/utils";
import { CartProduct } from "@/types/cart";
import { User } from "@/types/index";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";

import { Minus, Plus, X } from "lucide-react";

interface ProductErrors {
	[key: string]: {
		price: string;
		quantity: string;
	};
}

export default function ShoppingCartDrawer({ user }: { user: User }) {
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [errors, setErrors] = React.useState<ProductErrors>({});
	const [currentCart, setCurrentCart] = useLocalStorage<CartProduct[]>("cart", []);

	const totalQuantity = currentCart.reduce((acc, product) => acc + product.quantity, 0);

	return (
		<Drawer autoFocus={true} direction="right">
			<DrawerTrigger className="group relative flex size-10 items-center justify-center [&_svg:not([class*='size-'])]:size-auto">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 group-hover:scale-110">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
					/>
				</svg>
				<span className="bg-rajah-200 dark:bg-rajah-400/95 absolute top-0.5 right-0.5 z-30 size-auto rounded-full p-1 py-0 text-xs font-medium text-black/60 dark:text-white">
					{totalQuantity}
				</span>
			</DrawerTrigger>
			<DrawerContent className="flex h-full flex-col items-start justify-between rounded-tl-sm rounded-bl-sm p-5 data-[vaul-drawer-direction=right]:max-sm:w-[90%] data-[vaul-drawer-direction=right]:sm:max-w-xl">
				<span className="flex h-[88%] w-full flex-col items-start justify-start gap-2">
					<DrawerHeader
						className={cn("h-fit w-full flex-row items-center justify-between gap-0 p-0", {
							hidden: currentCart.length <= 0,
						})}
					>
						<DrawerTitle className="text-3xl">Shopping Cart</DrawerTitle>
						<DrawerClose className="size-fit rounded-full text-left text-black/50 transition-colors duration-200 ease-linear hover:text-black">
							<X />
						</DrawerClose>
					</DrawerHeader>

					{currentCart.length <= 0 ? (
						<div className="flex h-full w-full flex-col items-center justify-center gap-2 p-5 text-center">
							<h1 className="text-xl tracking-tight text-black italic md:text-4xl">Your basket is empty</h1>

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
						<Table className="table-fixed" containerClassName="overflow-y-auto overflow-x-hidden scrollbar pr-2">
							<TableHeader>
								<TableRow className="h-10">
									<TableHead className="w-[150px] pl-0">Product</TableHead>
									<TableHead className="w-[50px] pr-0 text-right">Total</TableHead>
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
										<TableCell className={cn("flex w-full max-w-[400px] flex-col pt-4 pb-0 pl-0 align-top font-medium")}>
											<ListItem product={product} />
											<div className="mt-2 flex w-full items-center justify-start">
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
											{errors[product.price_id] && (
												<div className="mt-1 flex w-full flex-col items-start justify-start gap-1">
													{errors[product.price_id].quantity && (
														<p className="text-[0.750rem] font-normal tracking-wider text-red-500">{errors[product.price_id].quantity}</p>
													)}
													{errors[product.price_id].price && <p className="text-[0.750rem] font-normal tracking-wider text-red-500">{errors[product.price_id].price}</p>}
												</div>
											)}
										</TableCell>
										<TableCell className="w-auto max-w-[50px] pt-4 pr-0 pb-0 text-right align-top">
											<p className="text-right text-[0.950rem] leading-5 font-normal tracking-wider text-black sm:text-lg">
												{format((product.price * (product.quantity || 0)) / 100, product.currency)}
											</p>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</span>

				{currentCart.length > 0 && (
					<DrawerFooter className="border-border mt-0 w-full border-t p-0 pt-3">
						<span className="flex w-full flex-col items-start justify-start">
							<span className="flex w-full items-center justify-between gap-2">
								<span className="text-left text-[0.950rem] font-bold tracking-wider text-black uppercase sm:text-xl">Subtotal</span>
								<span className="text-right text-[0.950rem] font-normal tracking-wider text-black sm:text-xl">
									{format(currentCart.reduce((acc, product) => acc + product.price * (product.quantity || 0), 0) / 100, currentCart[0].currency)}
								</span>
							</span>
							<p className="text-left text-[0.750rem] font-normal tracking-wider text-black">Shipping and taxes calculated at checkout.</p>
						</span>

						<div className="flex w-full items-center justify-between gap-2">
							<Button
								variant={"outline"}
								onClick={() => {
									router.visit(route("cart"));
								}}
								className="border-rajah-500 hover:border-rajah-700 text-rajah-500 hover:text-rajah-600 h-12 w-1/12 grow-1 rounded-md p-4 text-center text-sm transition-colors duration-200 ease-in-out hover:bg-transparent md:p-5 md:py-3.5 md:text-lg"
							>
								View Basket
							</Button>
							<Button
								disabled={isSubmitting}
								onClick={async () => {
									const formData = new FormData();

									currentCart.forEach((product) => {
										formData.append("items[]", JSON.stringify({ price: product.price_id, quantity: product.quantity }));
									});

									try {
										await axios.post("/payment/check-products", {
											items: currentCart.map((product) => ({ price: product.price_id, quantity: product.quantity })),
										});
									} catch (error) {
										setIsSubmitting(false);

										if (axios.isAxiosError(error)) {
											const errorData = error.response?.data as { success: boolean; message: ProductErrors };

											if (errorData) {
												setErrors(errorData.message);
											}

											return;
										}
									}

									router.post("/payment/checkout", formData, {
										preserveState: false,
									});
								}}
								className="bg-rajah-500 hover:bg-rajah-600 h-12 grow-1 rounded-md p-4 text-center text-sm text-white transition-colors duration-200 ease-in-out md:p-5 md:py-3.5 md:text-lg"
							>
								Checkout
							</Button>
						</div>
					</DrawerFooter>
				)}
			</DrawerContent>
		</Drawer>
	);
}

function ListItem({ className, product }: React.ComponentProps<"li"> & { product: CartProduct }) {
	const product_id = product.product_id;

	return (
		<Link
			href={route("product", { product_id })}
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
