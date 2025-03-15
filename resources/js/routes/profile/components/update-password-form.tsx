import { Transition } from "@headlessui/react";
import { useForm } from "@inertiajs/react";
import React, { FormEventHandler } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import InputFocus from "@/components/ui/input-anim";

export default function UpdatePasswordForm({ className }: { className?: string }) {
	const passwordInput = React.useRef<HTMLInputElement>(null);
	const currentPasswordInput = React.useRef<HTMLInputElement>(null);

	const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
		current_password: "",
		password: "",
		password_confirmation: "",
	});

	const submit: FormEventHandler = (e) => {
		e.preventDefault();

		put(route("password.update"), {
			preserveScroll: true,
			onSuccess: () => reset(),
			onError: (errors) => {
				if (errors.password) {
					reset("password", "password_confirmation");
					passwordInput.current?.focus();
				}

				if (errors.current_password) {
					reset("current_password");
					currentPasswordInput.current?.focus();
				}
			},
		});
	};

	return (
		<section className={cn("flex flex-col items-start justify-start gap-5", className)}>
			<header>
				<h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Update Password</h2>
				<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Ensure your account is using a long, random password to stay secure.</p>
			</header>

			<form onSubmit={submit} className="flex w-full flex-col justify-center gap-2">
				<div className="flex h-auto w-full flex-col items-start justify-start gap-1">
					<InputFocus
						ref={currentPasswordInput}
						id="current_password"
						type="password"
						name="Current Password"
						autoComplete="current-password"
						value={data.current_password}
						onChange={(e) => setData("current_password", e.target.value)}
						className="rounded-sm px-3 py-7.5 pb-5"
					/>

					{errors.current_password && (
						<p className="peer-aria-invalid:text-destructive mt-2 text-xs" role="alert" aria-live="polite">
							{errors.current_password}
						</p>
					)}
				</div>

				<div className="flex h-auto w-full flex-col items-start justify-start gap-1">
					<InputFocus
						ref={passwordInput}
						id="password"
						type="password"
						name="New Password"
						autoComplete="new-password"
						value={data.password}
						onChange={(e) => setData("password", e.target.value)}
						className="rounded-sm px-3 py-7.5 pb-5"
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
						autoComplete="new-password"
						value={data.password_confirmation}
						onChange={(e) => setData("password_confirmation", e.target.value)}
						className="rounded-sm px-3 py-7.5 pb-5"
					/>

					{errors.password_confirmation && (
						<p className="peer-aria-invalid:text-destructive mt-2 text-xs" role="alert" aria-live="polite">
							{errors.password_confirmation}
						</p>
					)}
				</div>

				<div className="mt-2 flex w-full flex-col items-center justify-center gap-2">
					<Button
						className="group relative size-auto w-full overflow-hidden rounded-none border-2 border-black bg-black p-3.5 px-2 inset-ring-2 inset-ring-white transition-shadow delay-75 duration-300 hover:bg-black hover:inset-ring-black"
						disabled={processing}
					>
						<div className="absolute -left-16 h-[100px] w-10 -rotate-45 bg-gradient-to-r from-white/10 via-white/50 to-white/10 blur-sm duration-700 group-hover:left-[150%] group-hover:delay-200 group-hover:duration-700" />
						<span className="font-bold uppercase">Save</span>
					</Button>

					<Transition show={recentlySuccessful} enter="transition ease-in-out" enterFrom="opacity-0" leave="transition ease-in-out" leaveTo="opacity-0">
						<p className="text-sm text-gray-600 dark:text-gray-400">Saved.</p>
					</Transition>
				</div>
			</form>
		</section>
	);
}
