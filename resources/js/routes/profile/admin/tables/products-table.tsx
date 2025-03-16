import { Product } from "@/types/stripe";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import React from "react";
import ProductNewForm from "../forms/new-product-form";

const columns: ColumnDef<Product>[] = [
	{
		header: "Product Id",
		accessorKey: "id",
	},
	{
		header: "Default Price Id",
		accessorKey: "default_price",
	},
	{
		header: "Name",
		accessorKey: "name",
	},
	{
		header: "Description",
		accessorKey: "description",
	},
	{
		accessorKey: "active",
		header: ({ column }) => {
			return <div className="text-center">Status</div>;
		},
		cell: ({ row }) => {
			const isActive = row.original.active ? "Active" : "Inactive";

			return (
				<span
					className={cn("flex items-center justify-center rounded-full bg-gray-200 p-2 text-gray-800", {
						"bg-green-100 text-green-800": row.original.active,
						"bg-red-100 text-red-800": !row.original.active,
					})}
				>
					{isActive}
				</span>
			);
		},
	},
	{
		accessorKey: "actions",
		header: ({ column }) => {
			return <div className="text-right">Actions</div>;
		},
		cell: ({ row }) => {
			const newData = { ...row.original };

			// return (
			// 	<Dialog key={row.index}>
			// 		<div className="flex items-center justify-end space-x-2 pr-0">
			// 			<DialogTrigger asChild>
			// 				<Button variant={"link"} size={"sm"} onClick={() => {}} className="p0 p-0 has-[>svg]:px-0">
			// 					<EllipsisVertical />
			// 				</Button>
			// 			</DialogTrigger>
			// 		</div>
			// 		<DialogContent>
			// 			<DialogHeader className="flex flex-col items-start justify-start gap-0.5">
			// 				<DialogTitle className="text-left text-lg font-medium text-gray-900 dark:text-gray-100">Editing Price</DialogTitle>
			// 				<DialogDescription className="text-left text-sm text-gray-600 dark:text-gray-400">Edit the price details below.</DialogDescription>
			// 			</DialogHeader>
			// 		</DialogContent>
			// 	</Dialog>
			// );
		},
	},
];

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export default function ProductsTable({ products }: { products: Product[] }) {
	const [newProductOpen, setNewProductOpen] = React.useState(false);

	const table = useReactTable({
		data: products,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="flex max-h-96 flex-col gap-2 overflow-auto bg-white p-5 shadow-sm">
			<span className="flex h-full w-full items-end justify-end">
				<Button onClick={() => setNewProductOpen(true)} className="group relative size-auto overflow-hidden rounded-sm bg-black/80 p-2 px-3">
					<div className="absolute -left-16 h-[100px] w-10 -rotate-45 bg-gradient-to-r from-white/10 via-white/50 to-white/10 blur-sm duration-700 group-hover:left-[150%] group-hover:delay-200 group-hover:duration-700" />
					<span className="font-semibold">New Product</span>
				</Button>
			</span>

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
									<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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

			<Sheet open={newProductOpen} onOpenChange={setNewProductOpen}>
				<SheetContent className="w-full rounded-tl-sm rounded-bl-sm sm:max-w-5xl">
					<SheetHeader className="flex flex-col items-start justify-start gap-0 border-b border-gray-200">
						<SheetTitle className="text-left text-lg font-medium text-gray-900 dark:text-gray-100">Add a product</SheetTitle>
						<SheetDescription className="text-left text-sm text-gray-600 dark:text-gray-400">Add a new product to your store.</SheetDescription>
					</SheetHeader>
					<ProductNewForm />
				</SheetContent>
			</Sheet>
		</div>
	);
}
