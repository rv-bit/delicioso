import { Product } from "@/types/stripe";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const columns: ColumnDef<Product>[] = [
	{
		header: "Name",
		accessorKey: "name",
	},
	{
		header: "Description",
		accessorKey: "description",
	},
	{
		header: "Price",
		accessorKey: "default_price",
	},
];

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export default function ProductsTable({ products }: { products: Product[] }) {
	const table = useReactTable({
		data: products,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="overflow-hidden rounded-sm bg-white p-5 shadow-sm">
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

			{/* <div className="p-6 text-gray-900 dark:text-gray-100">You're logged in!, and found the admin dashboard</div>
				<div className="flex items-center gap-4">
					<div className="flex flex-col">
						<div className="text-sm font-semibold">{product.name}</div>
						<div className="text-xs text-gray-500">{product.description}</div>
					</div>
				</div>

				<div className="flex items-center gap-4">
					<div className="text-sm font-semibold">{product.id}</div>
					<div className="text-sm font-semibold">{product.default_price}</div>
				</div> */}
		</div>
	);
}
