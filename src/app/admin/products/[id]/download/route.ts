import db from "@/db/prisma";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises"
import { headers } from "next/headers";

export async function GET(req: NextRequest,
    { params: {id} } : { params: {id: string} }
) {
    const product = await db.product.findUnique({ 
        where: { id }, 
        select: { filePath: true, name: true } 
    })

    if ( product === null ) return notFound()
    else {
        const { size } = await fs.stat(product.filePath)
        const file = await fs.readFile(product.filePath)
        // Provides type of file (exe, pdf, png, etc.)
        const extension = await product.filePath.split(".").pop()

        return new NextResponse(file, { headers: {
            // Default Name for File
            "Content-Disposition": `attachment; filename="${product.name}.${extension}"`,
            "Content-Length": size.toString()
        }})
    }
}