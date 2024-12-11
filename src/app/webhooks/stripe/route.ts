import db from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_WEBHOOK_SECRET as string)

// Called By Stripe - Gives Info from Body
export async function POST(req: NextRequest) {
    // constructEvent() Verifies that everything being passed is from Stripe
    const event = await stripe.webhooks.constructEvent( await 
        req.text(), 
        req.headers.get("stripe-signature") as string,
        process.env.STRIPE_WEBHOOK_SECRET as string
    )

    // Called Every Successful Charge on Stripe
    if (event.type === "charge.succeeded") {
        // Customer Charge
        const charge = event.data.object

        const productId = charge.metadata.productId
        const email = charge.billing_details.email
        const pricePaidInCents = charge.amount

        // Ensure Product Exists
        const product = await db.product.findUnique({ where: { id: productId}})
        if ( product == null || email == null ) return new NextResponse("Bad Request", {status: 400})

        // Create or Update User by Adding Order (Prisma upsert)
const userWithOrder = await db.user.upsert({
    where: { email },
    create: {
        email,
        orders: { create: { productId, pricePaidInCents } }
    },
    update: {
        orders: { create: { productId, pricePaidInCents } }
    },
    select: {
        orders: { orderBy: { createdAt: "desc" }, take: 1 }
    }
        })

    }
}