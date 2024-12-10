import db from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";

export async function GET(
    req: NextRequest,
    props: {
        params: Promise<{ downloadVerificationId: string}>
    }
) {
    const params = await props.params;

    const {
        downloadVerificationId
    } = params;

    // 
    const data = await db.downloadVerification.findUnique({
        where: { 
            id: downloadVerificationId,
            // Only gets Verification if expiresAt is AFTER current time
            expiresAt: {gt: new Date()} 
        },
        // Select Needed Fields
        select: { product: { select: {filePath: true, name: true} } }
    })

    // Two Cases: Expired Verification Code || Or No Code in Db 
    if (data == null) {
        return NextResponse.redirect(new URL("/products/download/expired", req.url))
    }

    const { size } = await fs.stat(data.product.filePath)
    const file = await fs.readFile(data.product.filePath)
    // Provides type of file (exe, pdf, png, etc.)
    const extension = data.product.filePath.split(".").pop()

    return new NextResponse(file, 
        {headers: {
            // Default Name for File
            "Content-Disposition": `attachment; filename="${data.product.name}.${extension}"`,
            "Content-Length": size.toString()
        }}
    )
}