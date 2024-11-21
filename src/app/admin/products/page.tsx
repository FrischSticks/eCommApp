import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { PageHeader } from "../_components/PageHeader"
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table";
import db from "@/db/prisma"
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { CheckCircle2, MoreVertical, XCircleIcon } from "lucide-react";
import Link from "next/link";


export default function AdminProductsPage() {
    return (<>
        <div className="flex justify-between items-center gap-4">
            <PageHeader>Products</PageHeader>
            <a
                href="/admin/products/new"
                className="inline-block px-4 py-2 bg-foreground text-white rounded hover:bg-secondary hover:text-secondary-foreground hover:border-2 hover:border-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground">
                Add Product
            </a>
        </div>
        <ProductsTable />
        </>);
}

async function ProductsTable() {

    // Pulling Product Data from DB
    const products = await db.product.findMany({
        select: {
            id: true, 
            name: true, 
            priceInCents: true, 
            isAvailableForPurchase: true, 
            _count: { select: {orders: true }}
        },
        orderBy: { name: "asc"}
    })

    if (products.length === 0) return <p> No Products </p>

    return <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="w-0">
                    <span className="sr-only"> Available for Purchase </span>
                </TableHead>
                <TableHead> Name </TableHead>
                <TableHead> Price </TableHead>
                <TableHead> Orders </TableHead>
                <TableHead className="w-0">
                    <span className="sr-only"> Actions </span>
                </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {/* LOOP THROUGH PRODUCTS */}
            {products.map(product => (
                <TableRow key={product.id}>
                    <TableCell>
                        { product.isAvailableForPurchase ? (
                            <>
                                <CheckCircle2 />
                                <span className="sr-only"> Available </span>
                            </>
                        ) : (
                            <>
                                <XCircleIcon />
                                <span className="sr-only"> Unavailable </span>
                            </>
                        )}
                    </TableCell>
                    <TableCell> {product.name} </TableCell>
                    <TableCell> {formatCurrency(product.priceInCents / 100)} </TableCell>
                    <TableCell> {formatNumber(product._count.orders)} </TableCell>
                    <TableCell> 
                        <DropdownMenu>
                            {/* Trigger Acts as Btn */}
                            <DropdownMenuTrigger>
                                <MoreVertical/>
                                <span className="sr-only"> Actions </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>
                                    <a download href={`/admin/products/${product.id}/download`}> Download </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href={`/admin/products/${product.id}/edit`}> Edit </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
}