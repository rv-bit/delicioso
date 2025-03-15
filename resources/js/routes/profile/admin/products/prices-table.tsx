import { Price } from "@/types/stripe";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const columns: ColumnDef<Price>[] = [
	{
		header: "Price Id",
		accessorKey: "id",
	},
	{
		accessorKey: "active",
		header: ({ column }) => {
			return <div className="text-center">Active</div>;
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
		header: "Type",
		accessorKey: "type",
	},
	{
		header: "Product Id",
		accessorKey: "product",
	},
	{
		header: "Billing Scheme",
		accessorKey: "billing_scheme",
	},
	{
		header: "Actions",
		accessorKey: "actions",
		cell: ({ row }) => {
			return (
				<div className="flex items-center justify-start space-x-2">
					<button className="btn btn-sm btn-primary">Edit</button>
					<button className="btn btn-sm btn-danger">Delete</button>
				</div>
			);
		},
	},
];

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export default function PricesTable({ prices }: { prices: Price[] }) {
	const table = useReactTable({
		data: prices,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="max-h-50 overflow-hidden rounded-sm bg-white p-5 shadow-sm">
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
		</div>
	);
}
