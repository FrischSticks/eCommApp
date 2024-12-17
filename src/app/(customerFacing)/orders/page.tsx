"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export default function MyOrdersPage() {
    return <form className="max-2-xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle> My Orders </CardTitle>
                <CardDescription> Enter your email and we will email you your order history and download links. </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label htmlFor="email"> Email </Label>
                    <Input type="email" name="email" id="email" required />
                </div>
            </CardContent>
            <CardFooter>
                <SubmitButton />
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