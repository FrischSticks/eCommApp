"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/formatters"
import { Elements, LinkAuthenticationElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import Image from "next/image"
import { FormEvent, useState } from "react"

type CheckoutFormProps = {
    product: {
        imagePath: string,
        name: string,
        priceInCents: number,
        description: string
    },
    clientSecret: string
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

export function CheckoutForm({ product, clientSecret } : CheckoutFormProps ) {
    // Use Elements like a Conext Wrapper & Add Components
    // Add appearance as option to Customize
    return (
        <div className="max-w-5xl w-full mx-auto space-y-8">
            <div className="flex gap-4 items-center">
                <div className="aspect-video flex-shrink-0 w-1/3 relative">
                    <Image src={product.imagePath} fill alt={product.name} className="object-cover" />
                </div>
                <div>
                    <div className="text-lg"> {formatCurrency(product.priceInCents / 100)} </div>
                    <h1 className="text-2xl font-bold"> { product.name } </h1>
                    <div className="line-clamp-3 text-muted-foreground"> { product.description } </div>
                </div>
            </div>
            <Elements options={{clientSecret}} stripe={stripePromise}>
                <Form priceInCents={product.priceInCents} />
            </Elements>
        </div>
)}

function Form( {priceInCents} : {priceInCents: number} ) {
    const stripe = useStripe()
    const elements = useElements()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>()

    function handleSubmit(e: FormEvent) {
        e.preventDefault()

        if (stripe == null || elements == null) return
        setIsLoading(true)

        // Check for Existing Order, No Duplicate Orders!

        stripe.confirmPayment({ 
            elements,
            // Payment Success Page
            confirmParams: { return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`}
        // .then will only run if payment is unsuccessful
        }).then(({ error }) => {
            // Only Include Error Codes Decipherable to Average Individual (Not Devs)
            if (error.type === "card_error" || error.type === "validation_error") {
                setErrorMessage(error.message)
            } else {
                setErrorMessage("ERROR: Unable to Process Payment")
            }
        }).finally(() => setIsLoading(false))
    }

    return (
        <form onSubmit={ handleSubmit }>
            <Card>
                <CardHeader>
                    <CardTitle> Checkout </CardTitle>
                    {/* CONTAINER FOR ERROR MESSAGES IF ERROR EXISTS */}
                    { errorMessage && (
                        <CardDescription className="text-destructive"> {errorMessage} </CardDescription> 
                    )}
                </CardHeader>
                <CardContent>
                    <PaymentElement />
                    {/* Add Email Field to Form */}
                    <div className="mt-4">
                        <LinkAuthenticationElement />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" size="lg" disabled={ stripe == null || elements == null || isLoading } > 
                        {isLoading ? "Purchasing. . ." : `Purchase - ${formatCurrency(priceInCents / 100)}`}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}