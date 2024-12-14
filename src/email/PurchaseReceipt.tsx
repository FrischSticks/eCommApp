import { Body, Container, Head, Heading, Html, Preview, Tailwind } from "@react-email/components";
import { OrderInformation } from "./components/OrderInformation";

type PurchaseReceiptEmailProps = {
    product: {
        name: string
    }
}

PurchaseReceiptEmail.PreviewProps = {
    product: { name: "Product Name"}
} satisfies PurchaseReceiptEmailProps

export default function PurchaseReceiptEmail( {product} : PurchaseReceiptEmailProps ) {
    return (
        <Html>
            <Preview> Download {product.name} & View Receipt</Preview>
            <Tailwind>
                <Head />
                <Body className="font-sans bg-white">
                    <Container className="max-w-xl">
                        <Heading> Purchase Receipt </Heading>
                        {/* Shared Component */}
                        <OrderInformation />
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}