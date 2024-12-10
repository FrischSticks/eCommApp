import db from "@/db/prisma"
import { notFound } from "next/navigation"
import Stripe from "stripe"
import { CheckoutForm } from "./_components/CheckoutForm"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export default async function PurchasePage(
    props: {
        params: Promise<{ id: string }>
    }
) {
    const params = await props.params;

    const {
        id
    } = params;

    const product = await db.product.findUnique({ 
        where: { id } })
    if (product == null ) return notFound()

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
        amount: product.priceInCents,
        currency: "USD",
        // Ties Purchase to Given Product
        metadata: {productId: product.id}
    })

    // This is Used by the Client to Associate w/ paymentIntent Created Above (almost like an id)
    if ( paymentIntent.client_secret == null ) {
        throw Error("Stripe Failed to Create Payment Intent")
    }

    // Return as Separate Component, because there are a Lot of React Hooks (CSR)
    return <CheckoutForm product={product} clientSecret={paymentIntent.client_secret} />
}