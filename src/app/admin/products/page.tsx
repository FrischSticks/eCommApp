import { PageHeader } from "../_components/PageHeader"
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";


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

function ProductsTable() {
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

        {/* <TableBody>

        </TableBody> */}
    </Table>
}