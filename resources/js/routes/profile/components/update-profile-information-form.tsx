import { Transition } from "@headlessui/react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { FormEventHandler } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import InputFocus from "@/components/ui/input-anim";

export default function UpdateProfileInformation({ mustVerifyEmail, status, className }: { mustVerifyEmail: boolean; status?: string; className?: string }) {
	const user = usePage().props.auth.user;

	const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
		name: user.name,
		email: user.email,
	});

	const submit: FormEventHandler = (e) => {
		e.preventDefault();

		patch(route("profile.update"));
	};

	return (
		<section className={cn("flex flex-col items-start justify-start gap-5", className)}>
			<header>
				<h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Profile Information</h2>
				<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Update your account's profile information and email address.</p>
			</header>

			<form onSubmit={submit} className="flex w-full flex-col justify-center gap-2">
				<div className="flex h-auto w-full flex-col items-start justify-start gap-1">
					<InputFocus id="name" name="Name" autoComplete="name" value={data.name} onChange={(e) => setData("name", e.target.value)} className="rounded-sm px-3 py-7.5 pb-5" />

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
						autoComplete="email"
						value={data.email}
						onChange={(e) => setData("email", e.target.value)}
						className="rounded-sm px-3 py-7.5 pb-5"
					/>

					{errors.email && (
						<p className="peer-aria-invalid:text-destructive mt-2 text-xs" role="alert" aria-live="polite">
							{errors.email}
						</p>
					)}
				</div>

				{mustVerifyEmail && user.email_verified_at === null && (
					<div className="flex h-auto w-full flex-col items-start justify-start gap-1">
						<p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
							Your email address is unverified.
							<Link
								href={route("verification.send")}
								method="post"
								as="button"
								className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
							>
								Click here to re-send the verification email.
							</Link>
						</p>

						{status === "verification-link-sent" && (
							<div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">A new verification link has been sent to your email address.</div>
						)}
					</div>
				)}

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
