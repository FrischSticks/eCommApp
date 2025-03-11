import { Body, Container, Head, Heading, Hr, Html, Preview, Tailwind } from "@react-email/components"
  import { OrderInformation } from "./components/OrderInformation"
  import React from "react"
  
  type OrderHistoryEmailProps = {
    orders: {
      id: string
      pricePaidInCents: number
      createdAt: Date
      downloadVerificationId: string
      product: {
        name: string
        imagePath: string
        description: string
      }
    }[]
  }
  
  OrderHistoryEmail.PreviewProps = {
    orders: [
      {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        pricePaidInCents: 10000,
        downloadVerificationId: crypto.randomUUID(),
        product: {
          name: "Product Name 1",
          description: "Description 1",
          imagePath:
            "/products/13c88e02-6509-4432-bdb5-e328bc8968a5-FanDuel.png",
        },
      },
      {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        pricePaidInCents: 2000,
        downloadVerificationId: crypto.randomUUID(),
        product: {
          name: "Product Name 2",
          description: "Description 2",
          imagePath:
            "/products/25e27a0f-b48e-4a33-8e8f-186ff07ed275-nvm.png",
        },
      },
    ],
  } satisfies OrderHistoryEmailProps
  
  export default function OrderHistoryEmail({ orders }: OrderHistoryEmailProps) {
    return (
      <Html>
        <Preview> Order History & Downloads </Preview>
        <Tailwind>
          <Head />
          <Body className="font-sans bg-white">
            <Container className="max-w-xl">
              <Heading> Order History </Heading>
              {orders.map((order, index) => (
                <React.Fragment key={order.id}>
                  <OrderInformation
                    order={order}
                    product={order.product}
                    downloadVerificationId={order.downloadVerificationId}
                  />
                  {index < orders.length - 1 && <Hr />}
                </React.Fragment>
              ))}
            </Container>
          </Body>
        </Tailwind>
      </Html>
    )
  }