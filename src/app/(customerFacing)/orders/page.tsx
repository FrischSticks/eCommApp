"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { emailOrderHistory } from "@/actions/orders";

export default function MyOrdersPage() {
    const [data, action] = useActionState(emailOrderHistory, {})
    // action comes from Form State Hook
    return <form action={action} className="max-w-2xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle> My Orders </CardTitle>
                <CardDescription> Enter your email and we will email you your order history and download links. </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label htmlFor="email"> Email </Label>
                    <Input type="email" name="email" id="email" placeholder="YourEmail@gmail.com" required />
                    { data.error && 
                        <div className="text-destructive">
                            { data.error }
                        </div>
                    }
                </div>
            </CardContent>
            <CardFooter>
                { data.message ? <p> {data.message} </p> : <SubmitButton /> }
            </CardFooter>
        </Card>
    </form>
}

function SubmitButton() {
    const { pending } = useFormStatus()

    return <Button className="w-full" size="lg" disabled={pending} type="submit"> 
        { pending ? "Sending. . ." :  "Send" } 
    </Button>
}