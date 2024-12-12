import { Button } from "@/components/ui/button";
import db from "@/db/prisma";
import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export default async function SuccessfulPurchasePage(
    props: {
        // Comes from url (passed from order)
        searchParams: Promise<{ payment_intent: string }>
    }
) {
    const searchParams = await props.searchParams;

    // Contains Info on Success/Fail & Product Info from Metadata
    const paymentIntent = await stripe.paymentIntents.retrieve(searchParams.payment_intent)
    console.log(paymentIntent)

    if (paymentIntent.metadata.productId == null) return notFound()

    const product = await db.product.findUnique({where: {id: paymentIntent.metadata.productId },})
    if (product == null) return notFound()
    console.log(product)

    // Determine Successful Purchase vs Error (boolean)
    const isSuccess = paymentIntent.status === "succeeded"

    // Precompute the download link if the purchase was successful
    let downloadLink: string | undefined;
    if (isSuccess) {
        const downloadVerificationId = await createDownloadVerification(product.id);
        console.log(`Download Verification ID: ${downloadVerificationId}`)
        downloadLink = `/products/download/${downloadVerificationId}`;
        console.log(`Download Link: ${downloadLink}`)
    }

    async function createDownloadVerification(productId: string) {
    return ((await db.downloadVerification.create({ 
        // Expiration Date is 24hr After Purchase (Math is for milliseconds in Day)
        data: { productId, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24)}}))
    // Returns only the id
    ).id;
}

    return (
        (<div className="max-w-5xl w-full mx-auto space-y-8">
            <h1 className="text-3xl font-bold">{ isSuccess ? "Purchase Successful" : "Error Purchasing" }</h1>
            <div className="flex gap-4 items-center">
                <div className="aspect-video flex-shrink-0 w-1/3 relative">
                    <Image src={product.imagePath} fill alt={product.name} className="object-cover" />
                </div>
                <div>
                    <div className="text-lg"> {formatCurrency(product.priceInCents / 100)} </div>
                    <h1 className="text-2xl font-bold"> { product.name } </h1>
                    <div className="line-clamp-3 text-muted-foreground"> { product.description } </div>
                    {/* Button to Download File */}
                    {/* asChild, because it is a Link */}
                    <Button className="mt-4" size="lg" asChild>
                        {isSuccess ? (
                            // Contains Download w/ Verification Link (Limited Time Download)
                            <Link href={`${downloadLink}`}> Download </Link>
                         ) : (
                            // Links back to Purchase Page if Unsuccessful Purchase
                            <Link href={`/products/${product.id}/purchase`}> Try Again </Link>
                        )}
                    </Button>
                </div>
            </div>
        </div>)
    );
}