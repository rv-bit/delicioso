import { Head, Link } from "@inertiajs/react";
import React, { FormEventHandler } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import InputFocus from "@/components/ui/input-anim";

interface LoginFormProps {
	email: string;
	password: string;
	remember: boolean;

	[key: string]: string | boolean; // Index signature
}

function LoginComponent({
	status,
	canResetPassword,
	errors,
	data,
	setData,
	submit,
	processing,
}: {
	status?: string;
	canResetPassword: boolean;
	data: LoginFormProps;
	setData: (key: string, value: string | boolean) => void;
	submit: FormEventHandler;
	processing: boolean;
	errors: { [key: string]: string };
}) {
	return (
		<React.Fragment>
			<Head title="Sign In" />

			<div className="from-rajah-300/20 to-rajah-400/50 flex min-h-[38.7rem] w-2xl flex-col items-center gap-10 overflow-hidden rounded-xs bg-gradient-to-br px-24 py-12 shadow-2xl inset-ring-1 inset-ring-black/10 max-xl:w-full max-lg:px-10 max-lg:py-8 max-sm:scale-95">
				{status && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}

				<span className="flex flex-col justify-start gap-0.5">
					<h1 className="text-2xl">Registered Customers</h1>
					<p>Please register your interest by creating a new account. Our corporate service is coming soon.</p>
				</span>

				<form onSubmit={submit} className="flex w-full flex-col justify-center gap-2">
					<div className="flex h-auto w-full flex-col items-start justify-start gap-1">
						<InputFocus
							id="email"
							type="email"
							name="Email"
							value={data.email}
							onChange={(e) => setData("email", e.target.value)}
							className="rounded-none border-black/60 px-3 py-7.5 pb-5"
						/>

						{errors.email && (
							<p className="peer-aria-invalid:text-destructive mt-2 text-xs" role="alert" aria-live="polite">
								{errors.email}
							</p>
						)}
					</div>

					<div className="flex h-auto w-full flex-col items-start justify-start gap-1">
						<span className="flex w-full flex-col justify-between gap-2">
							<InputFocus
								id="password"
								type="password"
								name="Password"
								value={data.password}
								onChange={(e) => setData("password", e.target.value)}
								className="rounded-none border-black/60 px-3 py-7.5 pb-5"
							/>

							<span className="flex items-center justify-between gap-1">
								<div className="flex justify-start">
									<label className="flex items-center">
										<Checkbox
											name="remember"
											checked={data.remember}
											onCheckedChange={(checked) => {
												const rememberMe = checked ? true : false;
												setData("remember", rememberMe);
											}}
											className="border-black/60"
										/>
										<span className="ms-2 text-sm">Remember me</span>
									</label>
								</div>

								{canResetPassword && (
									<div className="flex justify-end">
										<Link
											href={route("password.request")}
											className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
										>
											Forgot your password?
										</Link>
									</div>
								)}
							</span>
						</span>

						{errors.password && (
							<p className="peer-aria-invalid:text-destructive mt-2 text-xs" role="alert" aria-live="polite">
								{errors.password}
							</p>
						)}
					</div>

					<div className="mt-2 flex w-full items-center justify-center">
						<Button
							className="group relative w-full overflow-hidden rounded-none border-2 border-black bg-black px-3 py-7.5 inset-ring-2 inset-ring-white transition-shadow delay-75 duration-300 hover:bg-black hover:inset-ring-black"
							disabled={processing}
						>
							<div className="absolute -left-16 h-[100px] w-10 -rotate-45 bg-gradient-to-r from-white/10 via-white/50 to-white/10 blur-sm duration-700 group-hover:left-[150%] group-hover:delay-200 group-hover:duration-700" />
							<span className="font-bold uppercase">Sign In</span>
						</Button>
					</div>
				</form>
			</div>
		</React.Fragment>
	);
}

export { LoginComponent, type LoginFormProps };
