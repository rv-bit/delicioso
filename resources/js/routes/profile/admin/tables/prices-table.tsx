"use no memo";

import { router } from "@inertiajs/react";
import React from "react";
import { toast } from "sonner";

import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingFn, SortingState, useReactTable } from "@tanstack/react-table";

import { useDebounce } from "@/hooks/use-debounce";

import { cn } from "@/lib/utils";
import { StripePrice } from "@/types/stripe";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDown, ArrowUp, ChevronsUpDown, EllipsisVertical, LoaderCircleIcon, SearchIcon } from "lucide-react";

const sortStatusFn: SortingFn<StripePrice> = (rowA, rowB, _columnId) => {
	const statusA = rowA.original.active ? "Active" : "Inactive";
	const statusB = rowB.original.active ? "Active" : "Inactive";
	const statusOrder = ["Active", "Inactive"];
	return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB);
};

export default function PricesTable({ prices }: { prices: StripePrice[] }) {
	const [sorting, setSorting] = React.useState<SortingState>([]);

	const [inputValue, setInputValue] = React.useState("");
	const [filterValues, setFilterValues] = React.useState<ColumnFiltersState>([]);
	const [isLoading, setIsLoading] = React.useState(false);

	const debouncedFilter = useDebounce((inputValue: string) => {
		setFilterValues((prev) => {
			const updatedFilters = prev.filter((f) => f.id !== "lookup_key");
			if (inputValue) {
				updatedFilters.push({ id: "lookup_key", value: inputValue });
			}
			return updatedFilters;
		});

		setIsLoading(false);
	}, 200);

	const columns = React.useMemo<ColumnDef<StripePrice>[]>(
		() => [
			{
				accessorKey: "id",
				header: "Price Id",
			},
			{
				accessorKey: "product",
				header: "Product Id",
			},
			{
				enableColumnFilter: true,
				filterFn: (row, accessorKey, filterValue) => {
					if (row.original.lookup_key) {
						return row.original.lookup_key.toLowerCase().includes(filterValue.toLowerCase());
					}

					return row.original.product.toLowerCase().includes(filterValue.toLowerCase());
				},
				accessorKey: "lookup_key",
				header: "Lookup Key",
			},
			{
				accessorKey: "type",
				header: "Type",
			},
			{
				accessorKey: "billing_scheme",
				header: "Billing Scheme",
			},
			{
				accessorKey: "active",
				header: ({ column }) => {
					return (
						<div className="flex items-center justify-center gap-1">
							<Button
								variant={"link"}
								size={"sm"}
								className="flex items-center justify-center has-[>svg]:px-0"
								onClick={() => {
									column.toggleSorting(column.getIsSorted() === "asc");
								}}
							>
								<h1 className="text-muted-foreground text-center">Status</h1>
								{column.getIsSorted() === "desc" ? (
									<ArrowDown className="size-auto" size={14} />
								) : column.getIsSorted() === "asc" ? (
									<ArrowUp className="size-auto" size={14} />
								) : (
									<ChevronsUpDown className="size-auto" size={14} />
								)}
							</Button>
						</div>
					);
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
				sortingFn: sortStatusFn,
				header: ({ column }) => {
					return <div className="text-right">Actions</div>;
				},
				cell: ({ row }) => {
					return (
						<DropdownMenu key={row.id}>
							<div className="flex items-center justify-end space-x-2 pr-0">
								<DropdownMenuTrigger asChild>
									<Button variant={"link"} size={"sm"} className="p-0 has-[>svg]:px-0">
										<EllipsisVertical />
									</Button>
								</DropdownMenuTrigger>
							</div>
							<DropdownMenuContent className="flex h-auto w-full flex-col items-start justify-center rounded-none">
								{!row.original.active ? (
									<DropdownMenuItem className="w-full">
										<Button
											onClick={() => {
												const formData = new FormData();
												formData.append("id", row.original.id);
												formData.append("actived", "true");

												router.post("/admin-dashboard/stripe/update-archive-price", formData, {
													preserveState: false,
													onSuccess: () => {
														toast.success("Price activated successfully!");
													},
													onStart: () => {
														toast.info("Activating price...");
													},
													onError: (errors) => {
														toast.error(errors.error);
													},
												});
											}}
											disabled={!row.original.active ? false : true}
											variant={"link"}
											className="flex h-auto w-full items-center justify-start gap-2 p-1 text-left text-sm hover:no-underline"
										>
											<span>Activate</span>
										</Button>
									</DropdownMenuItem>
								) : (
									<>
										<DropdownMenuItem className="w-full">
											<Button
												onClick={() => {
													console.log("Edit price", row.original);
												}}
												disabled={row.original.active ? false : true}
												variant={"link"}
												className="flex h-auto w-full items-center justify-start gap-2 p-1 text-left text-sm hover:no-underline"
											>
												<span>Edit</span>
											</Button>
										</DropdownMenuItem>
										<DropdownMenuItem className="w-full">
											<Button
												onClick={() => {
													const formData = new FormData();
													formData.append("id", row.original.id);
													formData.append("actived", "false");

													router.post("/admin-dashboard/stripe/update-archive-price", formData, {
														preserveState: false,
														onSuccess: () => {
															toast.success("Price archived successfully!");
														},
														onStart: () => {
															toast.info("Archiving price...");
														},
														onError: (errors) => {
															toast.error(errors.error);
														},
													});
												}}
												disabled={row.original.active ? false : true}
												variant={"link"}
												className="flex h-auto w-full items-center justify-start gap-2 p-1 text-left text-sm hover:no-underline"
											>
												<span>Archive</span>
											</Button>
										</DropdownMenuItem>
									</>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					);
				},
			},
		],
		[filterValues],
	);

	const table = useReactTable({
		data: prices,
		columns,
		debugTable: true,
		enableColumnFilters: false,
		onSortingChange: setSorting,
		onColumnFiltersChange: setFilterValues,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters: filterValues,
		},
	});

	return (
		<div className="flex max-h-[35.5rem] flex-col gap-3 overflow-auto bg-white p-5 shadow-sm">
			<header>
				<h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Prices</h2>
				<p className="mt-1 text-sm text-gray-600 dark:text-gray-400"> Manage prices for your products.</p>
			</header>

			<div className="flex h-full w-full items-end justify-between gap-1">
				<span className="flex h-full w-full items-start justify-start">
					<div className="relative w-full">
						<Input
							id="filtering"
							className="peer w-full ps-9 pe-2 [&::-webkit-search-cancel-button]:hidden"
							placeholder="Search by lookup key or product id"
							type="search"
							value={inputValue}
							onChange={(e) => {
								const value = e.target.value.toLocaleLowerCase();

								setIsLoading(true);
								setInputValue(value);

								debouncedFilter(value);
							}}
						/>
						<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
							{isLoading ? <LoaderCircleIcon className="animate-spin" size={16} role="status" aria-label="Loading..." /> : <SearchIcon size={16} aria-hidden="true" />}
						</div>
					</div>
				</span>
			</div>

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
