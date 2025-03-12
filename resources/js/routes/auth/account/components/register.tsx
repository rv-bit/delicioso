import { Head } from "@inertiajs/react";
import React, { FormEventHandler } from "react";

import { Button } from "@/components/ui/button";
import InputFocus from "@/components/ui/input-anim";

interface RegisterFormProps {
	name: string;
	email: string;
	password: string;
	password_confirmation: string;

	[key: string]: string; // Index signature
}

const RegisterComponent = React.memo(function Component({
	status,
	errors,
	data,
	setData,
	submit,
	processing,
}: {
	status?: string;
	data: RegisterFormProps;
	setData: (key: string, value: string | boolean) => void;
	submit: FormEventHandler;
	processing: boolean;
	errors: { [key: string]: string };
}) {
	return (
		<React.Fragment>
			<Head title="Create Account" />

			<div className="from-rajah-300/20 to-rajah-400/50 flex min-h-[38.7rem] w-2xl flex-col items-start gap-10 overflow-hidden rounded-xs bg-gradient-to-tl px-24 py-12 shadow-2xl inset-ring-1 inset-ring-black/10 max-xl:w-full max-lg:px-10 max-lg:py-8 max-sm:scale-95">
				{status && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}

				<span className="flex flex-col justify-start gap-0.5">
					<h1 className="text-2xl">New Customers</h1>
					<p>Sign up to create your account today.</p>
				</span>

				<form onSubmit={submit} className="flex w-full flex-col justify-center gap-2">
					<div className="flex h-auto w-full flex-col items-start justify-start gap-1">
						<InputFocus
							id="name"
							type="text"
							name="Name"
							required
							value={data.name}
							onChange={(e) => setData("name", e.target.value)}
							className="rounded-none border-black/60 px-3 py-7.5 pb-5"
						/>

						{errors.name && (
							<p className="peer-aria-invalid:text-destructive mt-2 text-xs" role="alert" aria-live="polite">
								{errors.name}
							</p>
						)}
					</div>

					<div className="flex h-auto w-full flex-col items-start justify-start gap-1">
						<InputFocus
							id="email"
							type="email"
							name="Email"
							required
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
						<InputFocus
							id="password"
							type="password"
							name="Password"
							required
							value={data.password}
							onChange={(e) => setData("password", e.target.value)}
							className="rounded-none border-black/60 px-3 py-7.5 pb-5"
						/>

						{errors.password && (
							<p className="peer-aria-invalid:text-destructive mt-2 text-xs" role="alert" aria-live="polite">
								{errors.password}
							</p>
						)}
					</div>

					<div className="flex h-auto w-full flex-col items-start justify-start gap-1">
						<InputFocus
							id="password_confirmation"
							type="password"
							name="Confirm Password"
							required
							value={data.password_confirmation}
							onChange={(e) => setData("password_confirmation", e.target.value)}
							className="rounded-none border-black/60 px-3 py-7.5 pb-5"
						/>

						{errors.password_confirmation && (
							<p className="peer-aria-invalid:text-destructive mt-2 text-xs" role="alert" aria-live="polite">
								{errors.password_confirmation}
							</p>
						)}
					</div>

					<div className="mt-2 flex w-full items-center justify-center">
						<Button
							className="group relative w-full overflow-hidden rounded-none border-2 border-black bg-black px-3 py-7.5 inset-ring-2 inset-ring-white transition-shadow delay-75 duration-300 hover:bg-black hover:inset-ring-black"
							disabled={processing}
						>
							<div className="absolute -left-16 h-[100px] w-10 -rotate-45 bg-gradient-to-r from-white/10 via-white/50 to-white/10 blur-sm duration-700 group-hover:left-[150%] group-hover:delay-200 group-hover:duration-700" />
							<span className="font-bold uppercase">Create Account</span>
						</Button>
					</div>
				</form>
			</div>
		</React.Fragment>
	);
} as React.FC<{
	errors: Record<keyof RegisterFormProps, string>;
	data: RegisterFormProps;
	setData: (key: string, value: string | boolean) => void;
	submit: FormEventHandler;
	processing: boolean;
}>);

export { RegisterComponent, type RegisterFormProps };
