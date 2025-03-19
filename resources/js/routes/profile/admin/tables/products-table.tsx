"use no memo";

import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingFn, SortingState, useReactTable } from "@tanstack/react-table";
import React from "react";

import { cn } from "@/lib/utils";
import { Product } from "@/types/stripe";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { ArrowDown, ArrowUp, ChevronsUpDown, EllipsisVertical, LoaderCircleIcon, PlusIcon, SearchIcon } from "lucide-react";

import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerNestedContent, DrawerNestedRoot, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/hooks/use-media-query";
import ProductNewForm from "../forms/new-product-form";

const sortStatusFn: SortingFn<Product> = (rowA, rowB, _columnId) => {
	const statusA = rowA.original.active ? "Active" : "Inactive";
	const statusB = rowB.original.active ? "Active" : "Inactive";
	const statusOrder = ["Active", "Inactive"];
	return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB);
};

export default function ProductsTable({ products }: { products: Product[] }) {
	const isMobile = useMediaQuery("(max-width: 640px)");
	const [newProductOpen, setNewProductOpen] = React.useState(false);
	const [sorting, setSorting] = React.useState<SortingState>([]);

	const [inputValue, setInputValue] = React.useState("");
	const [isLoading, setIsLoading] = React.useState(false);

	const columns = React.useMemo<ColumnDef<Product>[]>(
		() => [
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
				sortingFn: sortStatusFn,
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
				header: ({ column }) => {
					return <div className="text-right">Actions</div>;
				},
				cell: ({ row }) => {
					const newData = { ...row.original };

					return (
						<Drawer autoFocus={true} handleOnly={true} direction="right" key={newData.id}>
							<div className="flex items-center justify-end space-x-2 pr-0">
								<DrawerTrigger asChild>
									<Button variant={"link"} size={"sm"} className="p0 p-0 has-[>svg]:px-0">
										<EllipsisVertical />
									</Button>
								</DrawerTrigger>
							</div>
							<DrawerContent className="w-full rounded-tl-sm rounded-bl-sm data-[vaul-drawer-direction=right]:w-full data-[vaul-drawer-direction=right]:sm:max-w-5xl">
								<DrawerHeader className="flex flex-col items-start justify-start gap-0 border-b border-gray-200">
									<DrawerTitle className="text-left text-lg font-medium text-gray-900 dark:text-gray-100">Edit Product Data</DrawerTitle>
									<DrawerDescription className="text-left text-sm text-gray-600 dark:text-gray-400">Edit the product data below.</DrawerDescription>
								</DrawerHeader>

								<DrawerNestedRoot handleOnly={true} direction="right">
									<DrawerTrigger asChild>
										<Button variant={"link"} size={"sm"} className="p0 p-0 has-[>svg]:px-0">
											<EllipsisVertical />
										</Button>
									</DrawerTrigger>

									<DrawerNestedContent className="w-full rounded-tl-sm rounded-bl-sm data-[vaul-drawer-direction=right]:w-full data-[vaul-drawer-direction=right]:sm:max-w-5xl">
										<DrawerHeader className="flex flex-col items-start justify-start gap-0 border-b border-gray-200">
											<DrawerTitle className="text-left text-lg font-medium text-gray-900 dark:text-gray-100">Edit Product Data 2</DrawerTitle>
											<DrawerDescription className="text-left text-sm text-gray-600 dark:text-gray-400">Edit the product data below. 2</DrawerDescription>
										</DrawerHeader>
									</DrawerNestedContent>
								</DrawerNestedRoot>
							</DrawerContent>
						</Drawer>
					);
				},
			},
		],
		[isMobile],
	);

	const table = useReactTable({
		data: products,
		columns,
		debugTable: true,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
		},
	});

	React.useEffect(() => {
		if (inputValue) {
			setIsLoading(true);

			const timer = setTimeout(() => {
				setIsLoading(false);
			}, 500);

			return () => clearTimeout(timer);
		}

		setIsLoading(false);
	}, [inputValue]);

	return (
		<div className="flex max-h-[35.5rem] flex-col gap-3 overflow-auto bg-white p-5 shadow-sm">
			<header>
				<h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Products</h2>
				<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Manage products for your store.</p>
			</header>

			<div className="flex h-full w-full items-end justify-between gap-1">
				<span className="flex h-full w-full items-start justify-start">
					<div className="relative w-full">
						<Input
							id="filtering"
							className="peer w-full ps-9 pe-2 [&::-webkit-search-cancel-button]:hidden"
							placeholder="Search..."
							type="search"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
						/>
						<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
							{isLoading ? <LoaderCircleIcon className="animate-spin" size={16} role="status" aria-label="Loading..." /> : <SearchIcon size={16} aria-hidden="true" />}
						</div>
					</div>
				</span>

				<span className="flex h-full w-fit items-end justify-end">
					<Button onClick={() => setNewProductOpen(true)} className="group relative size-auto overflow-hidden rounded-sm bg-black/80 p-2 px-3">
						<div className="absolute -left-16 h-[100px] w-10 -rotate-45 bg-gradient-to-r from-white/10 via-white/50 to-white/10 blur-sm duration-700 group-hover:left-[150%] group-hover:delay-200 group-hover:duration-700" />
						<span className="font-semibold max-sm:hidden">New Product</span>
						<PlusIcon className="hidden text-white max-sm:block" size={10} />
					</Button>
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

			<Drawer autoFocus={true} open={newProductOpen} onOpenChange={setNewProductOpen} handleOnly={true} direction="right">
				<DrawerContent className="w-full rounded-tl-sm rounded-bl-sm data-[vaul-drawer-direction=right]:w-full data-[vaul-drawer-direction=right]:sm:max-w-5xl">
					<DrawerHeader className="flex flex-col items-start justify-start gap-0 border-b border-gray-200">
						<DrawerTitle className="text-left text-lg font-medium text-gray-900 dark:text-gray-100">Add a product</DrawerTitle>
						<DrawerDescription className="text-left text-sm text-gray-600 dark:text-gray-400">Add a new product to your store.</DrawerDescription>
					</DrawerHeader>
					<ProductNewForm />
				</DrawerContent>
			</Drawer>
		</div>
	);
}
