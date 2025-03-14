import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

import GuestLayout from "@/layouts/guest-layout";

import { Button } from "@/components/ui/button";
import InputFocus from "@/components/ui/input-anim";

export default function ConfirmPassword() {
	const { data, setData, post, processing, errors, reset } = useForm({
		password: "",
	});

	const submit: FormEventHandler = (e) => {
		e.preventDefault();

		post(route("password.confirm"), {
			onFinish: () => reset("password"),
		});
	};

	return (
		<GuestLayout>
			<Head title="Confirm Password" />

			<form onSubmit={submit} className="flex w-full flex-col justify-center gap-2">
				<div className="pb-2 text-sm text-gray-600 dark:text-gray-400">This is a secure area of the application. Please confirm your password before continuing.</div>

				<div className="flex h-auto w-full flex-col items-start justify-start gap-1">
					<InputFocus id="password" type="password" name="Password" value={data.password} onChange={(e) => setData("password", e.target.value)} className="rounded-sm px-3 py-7.5 pb-5" />

					{errors.password && (
						<p className="peer-aria-invalid:text-destructive mt-2 text-xs" role="alert" aria-live="polite">
							{errors.password}
						</p>
					)}
				</div>

				<div className="mt-2 flex w-full items-center justify-center">
					<Button
						className="group relative size-auto w-full overflow-hidden rounded-none border-2 border-black bg-black p-5 inset-ring-2 inset-ring-white transition-shadow delay-75 duration-300 hover:bg-black hover:inset-ring-black"
						disabled={processing}
					>
						<div className="absolute -left-16 h-[100px] w-10 -rotate-45 bg-gradient-to-r from-white/10 via-white/50 to-white/10 blur-sm duration-700 group-hover:left-[150%] group-hover:delay-200 group-hover:duration-700" />
						<span className="font-bold uppercase">Confirm</span>
					</Button>
				</div>
			</form>
		</GuestLayout>
	);
}
