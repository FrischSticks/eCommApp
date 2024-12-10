"use server"

import db from "@/db/prisma"

export async function userOrderExists(email: string, productId: string) {
    // Find First Order Where & Product ID match (Maybe Null)
    return (await db.order.findFirst({
        where: { user: {email}, productId }, 
        select: {id: true}
    })) != null
}