import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

import GuestLayout from "@/layouts/guest-layout";

import { Button } from "@/components/ui/button";

export default function VerifyEmail({ status }: { status?: string }) {
	const { post, processing } = useForm({});

	const submit: FormEventHandler = (e) => {
		e.preventDefault();

		post(route("verification.send"));
	};

	return (
		<GuestLayout>
			<Head title="Email Verification" />
			{status === "verification-link-sent" && (
				<div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">A new verification link has been sent to the email address you provided during registration.</div>
			)}

			<form onSubmit={submit} className="flex w-full flex-col justify-center gap-2">
				<div className="pb-2 text-sm text-gray-600 dark:text-gray-400">
					Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly
					send you another.
				</div>

				<div className="mt-2 flex w-full flex-col items-center justify-center gap-2">
					<Button
						className="group relative size-auto w-full overflow-hidden rounded-none border-2 border-black bg-black p-3.5 px-2 inset-ring-2 inset-ring-white transition-shadow delay-75 duration-300 hover:bg-black hover:inset-ring-black"
						disabled={processing}
					>
						<div className="absolute -left-16 h-[100px] w-10 -rotate-45 bg-gradient-to-r from-white/10 via-white/50 to-white/10 blur-sm duration-700 group-hover:left-[150%] group-hover:delay-200 group-hover:duration-700" />
						<span className="font-bold uppercase">Resend Verification Email</span>
					</Button>

					<Link
						href={route("logout")}
						method="post"
						as="button"
						className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
					>
						Log Out
					</Link>
				</div>
			</form>
		</GuestLayout>
	);
}
