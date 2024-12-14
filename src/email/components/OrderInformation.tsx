import { formatCurrency } from "@/lib/formatters"
import { Column, Row, Section, Text } from "@react-email/components"

type OrderInformationProps = {
    order: { 
        id: string,
        createdAt: Date,
        pricePaidInCents: number
    }
    product: {}
    downloadVerificationId: string
}

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" })

export function OrderInformation( {order, product, downloadVerificationId} : OrderInformationProps) {
    return <>
        <Section>
            <Row>
                <Column>
                    <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4"> Order ID </Text>
                    <Text className="mt-0 mr-4"> {order.id} </Text>
                </Column>
                <Column>
                    <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4"> Purchase Date </Text>
                    <Text className="mt-0 mr-4"> { dateFormatter.format(order.createdAt) } </Text>
                </Column>
                <Column>
                    <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4"> Price Paid </Text>
                    <Text className="mt-0 mr-4"> { formatCurrency(order.pricePaidInCents / 100) } </Text>
                </Column>
            </Row>
        </Section>
    </>
}