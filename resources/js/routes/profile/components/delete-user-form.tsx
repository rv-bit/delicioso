import { useForm } from "@inertiajs/react";
import React, { FormEventHandler } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import InputFocus from "@/components/ui/input-anim";

export default function DeleteUserForm({ className }: { className?: string }) {
	const [confirmingUserDeletion, setConfirmingUserDeletion] = React.useState(false);
	const passwordInput = React.useRef<HTMLInputElement>(null);

	const {
		data,
		setData,
		delete: destroy,
		processing,
		reset,
		errors,
		clearErrors,
	} = useForm({
		password: "",
	});

	const submit: FormEventHandler = (e) => {
		e.preventDefault();

		destroy(route("profile.destroy"), {
			preserveScroll: true,
			onSuccess: () => closeModal(),
			onError: () => passwordInput.current?.focus(),
			onFinish: () => reset(),
		});
	};

	const confirmUserDeletion = () => {
		setConfirmingUserDeletion(true);
	};

	const closeModal = () => {
		setConfirmingUserDeletion(false);

		clearErrors();
		reset();
	};

	return (
		<section className={cn("flex flex-col items-start justify-start gap-5", className)}>
			<header>
				<h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Delete Account</h2>
				<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
					Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to
					retain.
				</p>
			</header>

			<div className="mt-2 flex w-full flex-col items-center justify-center gap-2">
				<Button variant={"destructive"} className="group relative size-auto w-full overflow-hidden rounded-sm p-3.5 px-2" onClick={confirmUserDeletion}>
					<div className="absolute -left-16 h-[100px] w-10 -rotate-45 bg-gradient-to-r from-white/10 via-white/50 to-white/10 blur-sm duration-700 group-hover:left-[150%] group-hover:delay-200 group-hover:duration-700" />
					<span className="font-bold uppercase">Delete Account</span>
				</Button>
			</div>

			<Dialog open={confirmingUserDeletion} onOpenChange={setConfirmingUserDeletion}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">Are you sure you want to delete your account?</DialogTitle>
						<DialogDescription className="mt-1 text-sm text-gray-600 dark:text-gray-400">
							Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your
							account.
						</DialogDescription>
					</DialogHeader>

					<DialogContent>
						<form onSubmit={submit} className="flex w-full flex-col justify-center gap-2">
							<div className="flex h-auto w-full flex-col items-start justify-start gap-1">
								<h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Are you sure you want to delete your account?</h2>
								<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
									Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete
									your account.
								</p>
							</div>

							<div className="flex h-auto w-full flex-col items-start justify-start gap-1">
								<InputFocus
									id="password"
									type="password"
									name="Password"
									value={data.password}
									autoFocus
									onChange={(e) => setData("password", e.target.value)}
									className="rounded-sm px-3 py-7.5 pb-5"
								/>

								{errors.password && (
									<p className="peer-aria-invalid:text-destructive mt-2 text-xs" role="alert" aria-live="polite">
										{errors.password}
									</p>
								)}
							</div>

							<div className="mt-2 flex items-center justify-end gap-2">
								<Button className="group relative h-auto w-auto overflow-hidden rounded-xs p-3 px-5" onClick={closeModal}>
									<div className="absolute -left-16 h-[100px] w-10 -rotate-45 bg-gradient-to-r from-white/10 via-white/50 to-white/10 blur-sm duration-700 group-hover:left-[150%] group-hover:delay-200 group-hover:duration-700" />
									<span className="font-bold uppercase">Cancel</span>
								</Button>

								<Button type="submit" variant={"destructive"} className="group relative h-auto w-auto overflow-hidden rounded-xs p-3 px-6" disabled={processing}>
									<div className="absolute -left-16 h-[100px] w-10 -rotate-45 bg-gradient-to-r from-white/10 via-white/50 to-white/10 blur-sm duration-700 group-hover:left-[150%] group-hover:delay-200 group-hover:duration-700" />
									<span className="font-bold uppercase">Delete Account</span>
								</Button>
							</div>
						</form>
					</DialogContent>
				</DialogContent>
			</Dialog>
		</section>
	);
}
