"use server"

import { z } from "zod"
import fs from 'fs/promises'
import { redirect } from "next/navigation"
import db from "@/db/prisma"

// Creating fileSchema & imageSchema, because Zod is not equipped to validate files
const fileSchema = z.instanceof(File, { message: "File Required" })
// If file size = 0, then the validation will not run
const imgSchema = fileSchema.refine( file => file.size  === 0 || file.type.startsWith("image/") )

const addSchema = z.object({

    // Min Length of 1
    name: z.string().min(1),
    description: z.string().min(1),
    // Zod will try to handle the String (from Form) and Coerce it to a Number
    priceInCents: z.coerce.number().int().min(1),
    // Validates that the file is not empty, by confirming size > 0
    file: fileSchema.refine(file => file.size > 0, "File Required"),
    img: imgSchema.refine(file => file.size > 0, "File Required")
})

export async function addProduct(formData: FormData) {
    // Converts formData to usable Object then Parses
    const result = addSchema.safeParse(Object.fromEntries(formData.entries()))

    if ( result.success === false ) {
        return result.error.formErrors.fieldErrors
    }

    const data = result.data

    // SAVING IMAGE AND FILE TO USABLE FILE PATH W/ FS
    // Make Directory
    await fs.mkdir('public/products', { recursive: true })
    // Create File Path to Directory w/ random ID
    const filePath = `public/products/${crypto.randomUUID()}-${data.file.name}`
    // Save File to File Path by Converting w/ Buffer to a format Node JS can read
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))

    const imagePath = `public/products/${crypto.randomUUID()}-${data.img.name}`
    await fs.writeFile(imagePath, Buffer.from(await data.img.arrayBuffer()))

    await db.product.create({ data: {
        name: data.name,
        description: data.description,
        priceInCents: data.priceInCents,
        filePath,
        imagePath,
        isAvailableForPurchase: false
    }})
    
    redirect('/admin/products')
}

// Database: The products are being saved to your Prisma database, which you can view using Prisma Studio or direct database queries.
// Run "npx prisma studio" to view

// File System: The product files and images are saved to the server's file system, but to ensure they are publicly accessible, they are also saved in the public/products directory.
