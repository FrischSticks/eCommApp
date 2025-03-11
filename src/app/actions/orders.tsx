"use server";

import db from "@/db/prisma";
import OrderHistoryEmail from "@/email/OrderHistory"
import { Resend } from "resend";
import { z } from "zod";

const emailSchema = z.string().email();

export async function userOrderExists(email: string, productId: string) {
    // Check if the user has purchased a specific product
    return (
        (await db.order.findFirst({
            where: { user: { email }, productId },
            select: { id: true }
        })) != null
    );
}

export async function emailOrderHistory(
    prevState: unknown,
    formData: FormData
): Promise<{ message?: string; error?: string }> {
    const result = emailSchema.safeParse(formData.get("email"));

    if (!result.success) {
        return { error: "Invalid email address" };
    }

    if (!process.env.RESEND_API_KEY) {
        console.error("Missing RESEND_API_KEY in environment variables");
        return { error: "Internal server error. Please try again later." };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const user = await db.user.findUnique({
        where: { email: result.data },
        select: {
            email: true,
            orders: {
                select: {
                    pricePaidInCents: true,
                    id: true,
                    createdAt: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                            imagePath: true,
                            description: true,
                        },
                    },
                },
            },
        },
    });

    if (!user) {
        return { message: "Check your email to view your order history and download your products." };
    }

    const orders = await Promise.all(
        user.orders.map(async (order) => {
            // Check if user has previously ordered this product
            const hasPurchased = await userOrderExists(user.email, order.product.id);

            return {
                ...order,
                downloadVerificationId: hasPurchased
                    ? (
                          await db.downloadVerification.create({
                              data: {
                                  expiresAt: new Date(Date.now() + 24 * 1000 * 60 * 60), // 24-hour expiration
                                  productId: order.product.id,
                              },
                          })
                      ).id
                    : "", // If they haven't purchased it, no verification ID is created
            };
        })
    );

    try {
        // Emails Won't Send /o Verified Email YOU OWN! (ADD DOMAIN ON RESEND)
        await resend.emails.send({
            from: `Support <${process.env.SENDER_EMAIL}>`,
            to: user.email,
            subject: "Order History",
            react: <OrderHistoryEmail orders={orders} />,
        });

        return { message: "Check your email to view your order history and download your products." };
    } catch (error) {
        console.error("Error sending email:", error);
        return { error: "There was an error sending your email. Please try again." };
    }
}
