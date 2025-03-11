import { Head, useForm } from "@inertiajs/react";
import React, { FormEventHandler } from "react";

import RootLayout from "@/layouts/root-layout";

import { LoginComponent, type LoginFormProps } from "./components/login";
import { RegisterComponent, RegisterFormProps } from "./components/register";

const Metadata = [
	{ route: "login", title: "Sign into your Account", description: "Sign in to your account to access your profile, orders, and more." },
	{ route: "register", title: "Create New Customer Account", description: "Sign up to create your account today." },
];

export default function Account({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
	const { data, setData, post, processing, errors, reset } = useForm<LoginFormProps>({
		email: "",
		password: "",
		remember: false,
	});

	const handleDataChange = (key: string, value: string | boolean) => {
		setData((prevData) => {
			const newData = { ...prevData, [key]: value };
			console.log("Updated Data:", newData); // <-- Add this
			return newData;
		});
	};

	const submit: FormEventHandler = React.useCallback(
		(e) => {
			e.preventDefault();

			post(route("login"), {
				onFinish: () => reset("password"),
			});
		},
		[data, post, reset],
	);

	const {
		data: dataRegister,
		setData: setDataRegister,
		post: postRegister,
		processing: processingRegister,
		errors: errorsRegister,
		reset: resetRegister,
	} = useForm({
		name: "",
		email: "",
		password: "",
		password_confirmation: "",
	});

	const submitRegister: FormEventHandler = React.useCallback(
		(e) => {
			e.preventDefault();

			postRegister(route("register"), {
				onFinish: () => resetRegister("password", "password_confirmation"),
			});
		},
		[dataRegister, postRegister, resetRegister],
	);

	const currentRoute = route().current();
	const selectedMetadata = Metadata.find((meta) => meta.route === currentRoute);

	return (
		<RootLayout footer={true}>
			<Head title="Account" />

			<div className="mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-between gap-10 px-2">
				<span className="mt-35 flex h-fit flex-col justify-start gap-1 max-sm:mt-10">
					{selectedMetadata && (
						<React.Fragment>
							<h1 className="font-courgette text-center text-6xl font-semibold tracking-tighter">{selectedMetadata.title}</h1>
							<p className="text-center italic">{selectedMetadata.description}</p>
						</React.Fragment>
					)}
				</span>

				<div className="flex h-full flex-row items-start justify-center gap-5 max-sm:flex-col max-sm:gap-0">
					<LoginComponent
						status={status}
						canResetPassword={canResetPassword}
						errors={errors as Record<keyof LoginFormProps, string>}
						data={data}
						setData={setData}
						submit={submit}
						processing={processing}
					/>

					<RegisterComponent
						errors={errorsRegister as Record<keyof RegisterFormProps, string>}
						data={dataRegister}
						setData={setDataRegister}
						submit={submitRegister}
						processing={processingRegister}
					/>
				</div>
			</div>
		</RootLayout>
	);
}
