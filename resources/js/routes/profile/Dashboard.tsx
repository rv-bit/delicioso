import { Head, usePage } from "@inertiajs/react";
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import React from "react";

import { cn, format } from "@/lib/utils";

import AuthenticatedLayout from "@/layouts/authenticated-layout";
import RootLayout from "@/layouts/root-layout";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Charges {
	charge_id: number;
	paid: boolean;
	amount: number;
	receipt_number: string;
	receipt_url: string;
	created: number;
}

export default function Dashboard({ charges }: { charges: Charges[] }) {
	const user = usePage().props.auth.user;

	const columns = React.useMemo<ColumnDef<Charges>[]>(
		() => [
			{
				header: "Charge ID",
				accessorKey: "charge_id",
			},
			{
				header: "Amount",
				accessorKey: "amount",
				cell: ({ row }) => {
					const amount = format(row.original.amount / 100, "GBP");
					return <span className="">{amount}</span>;
				},
			},
			{
				header: "Receipt Number",
				accessorKey: "receipt_number",
				cell: ({ row }) => {
					const number = row.original.receipt_number || "N/A";
					return <span className="">{number}</span>;
				},
			},
			{
				header: "Receipt URL",
				accessorKey: "receipt_url",
				cell: ({ row }) => {
					return (
						<Button
							variant={"link"}
							onClick={() => window.open(row.original.receipt_url, "_blank")}
							className="text-rajah-400 hover:text-rajah-600 pl-0 transition-colors duration-200 ease-in-out"
						>
							View
						</Button>
					);
				},
			},
			{
				accessorKey: "paid",
				header: ({ column }) => {
					return (
						<div className="flex items-center justify-center gap-1">
							<h1 className="text-muted-foreground text-center">Paid</h1>
						</div>
					);
				},
				cell: ({ row }) => {
					const paid = row.original.paid ? "Yes" : "No";
					return (
						<div className="flex w-full items-center justify-center gap-1">
							<span
								className={cn("flex w-fit items-center justify-center rounded-full bg-gray-200 p-2 px-5 text-gray-800", {
									"bg-green-100 text-green-800": row.original.paid,
									"bg-red-100 text-red-800": !row.original.paid,
								})}
							>
								{paid}
							</span>
						</div>
					);
				},
			},
			{
				header: "Created",
				accessorKey: "created",
				cell: ({ row }) => {
					const date = new Date(row.original.created * 1000);
					return <span className="">{date.toLocaleDateString()}</span>;
				},
			},
		],
		[],
	);

	const table = useReactTable({
		data: charges,
		columns,
		debugTable: true,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	return (
		<RootLayout>
			<AuthenticatedLayout>
				<Head title="Dashboard" />

				<div className="mx-auto flex max-w-7xl flex-col gap-2 px-2">
					<div className="flex flex-col gap-3 overflow-auto bg-white p-5 shadow-sm">
						<header>
							<h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Your Orders</h2>
							<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Welcome back, {user.name}!</p>
						</header>

						<Table>
							<TableHeader>
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => {
											return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
										})}
									</TableRow>
								))}
							</TableHeader>
							<TableBody>
								{table.getRowModel().rows?.length ? (
									table.getRowModel().rows.map((row) => (
										<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
											{row.getVisibleCells().map((cell) => (
												<TableCell
													key={cell.id}
													style={{
														width: `${cell.column.columnDef.size}px` || "auto",
														maxWidth: `${cell.column.columnDef.maxSize}px` || "auto",
														minWidth: `${cell.column.columnDef.minSize}px` || "auto",
													}}
													className="truncate"
												>
													{flexRender(cell.column.columnDef.cell, cell.getContext())}
												</TableCell>
											))}
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={columns.length} className="h-24 text-center">
											No results.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</div>
			</AuthenticatedLayout>
		</RootLayout>
	);
}
