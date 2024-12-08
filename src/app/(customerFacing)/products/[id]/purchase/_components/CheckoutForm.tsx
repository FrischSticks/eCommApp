"use client"

import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

type CheckoutFormProps = {
    product: {},
    clientSecret: string
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

export function CheckoutForm({ product, clientSecret } : CheckoutFormProps ) {
    // Use Elements like a Conext Wrapper & Add Components
    // Add appearance as option to Customize
    return <Elements options={{clientSecret}} stripe={stripePromise}>
        <Form />
    </Elements>
}

function Form() {
    const stripe = useStripe()
    const elements = useElements()
    
    return <PaymentElement />
}