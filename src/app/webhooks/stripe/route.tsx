import db from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

// npm i resend & react-email (made by same team - work well together!)
const resend = new Resend(process.env.RESEND_API_KEY as string)
console.log(process.env.RESEND_API_KEY)

// Called By Stripe - Gives Info from Body
export async function POST(req: NextRequest) {
    // constructEvent() Verifies that everything being passed is from Stripe
    const event = await stripe.webhooks.constructEvent(await 
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
        const {
            orders: [order],
          } = await db.user.upsert({
            where: { email },
            create: {
                email,
                orders: { create: { productId, pricePaidInCents } }
            },
            update: {
                email,
                orders: { create: { productId, pricePaidInCents } }
            },
            select: {
                orders: { orderBy: { createdAt: "desc" }, take: 1 }
            }
        })

        // Send Email w/ Download Link
        const downloadVerification = await db.downloadVerification.create({ 
            data: {
                productId,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24)  // 24hr Expiration (in milliseconds)
            }
        })

        // NOTE: Will not work in dev environment!
        await resend.emails.send({
            from: `Support <${process.env.SENDER_EMAIL}>`,
            to: email,
            subject: "Order Confirmation",
            react: <h1>Confirmation Email</h1>
        })

        return new NextResponse("Charge Succeeded")

    }

    // HANDLING ALL EVENTS TO RESOLVE ERRORS
    if (event.type === "payment_intent.succeeded") {
        return new NextResponse("Payment Intent Succeeded")
    }

    if (event.type === "payment_intent.created") {
        return new NextResponse("Payment Intent Created")
    }

    if (event.type === "charge.updated") {
        return new NextResponse("Charge Updated")
    }
}