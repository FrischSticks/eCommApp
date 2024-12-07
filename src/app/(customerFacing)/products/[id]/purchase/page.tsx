import db from "@/db/prisma"
import { notFound } from "next/navigation"

export default async function PurchasePage({ 
    params: { id }
} : {
    params: { id: string}
}) {
    const product = await db.product.findUnique({ 
        where: { id } })
        if (product == null ) return notFound()


    return <h1>{product.name}</h1>
}