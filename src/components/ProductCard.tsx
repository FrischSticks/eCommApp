
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { formatCurrency } from "@/lib/formatters";
import Link from "next/link";

type ProductCardProps = {
    id: string
    name: string
    priceInCents: number
    description: string
    imagePath: string
}

export function ProductCardSkeleton() {
    return (
        <Card className="flex overflow-hidden flex-col animate-pulse">
            <div className="w-full aspect-video bg-gray-300" />
            <CardHeader>
                <CardTitle>
                    <div className="w-3/4 h-6 rounded-full bg-gray-300" />
                </CardTitle>
                <CardDescription>
                    <div className="w-1/2 h-4 rounded-full bg-gray-300" />
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="w-full h-4 rounded-full bg-gray-300" />
                <div className="w-full h-4 rounded-full bg-gray-300" />
                <div className="w-3/4 h-4 rounded-full bg-gray-300" />
            </CardContent>
            <CardFooter>
                <Button className="w-full" size="lg" disabled></Button>
            </CardFooter>
        </Card>
    )
}

export function ProductCard( { id, name, priceInCents, description, imagePath }:
    ProductCardProps
 ) {
    return (
        <Card className="flex overflow-hidden flex-col">
            <div className="relative w-full h-auto aspect-video">
                <Image src={imagePath} alt={name} fill />
            </div>
            <CardHeader>
                <CardTitle> {name} </CardTitle>
                <CardDescription> {formatCurrency(priceInCents / 100)} </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="line-clamp-4"> {description} </p>
            </CardContent>
            <CardFooter>
                <Button className="w-full" size="lg" asChild>
                    <Link href={`/products/${id}/purchase`}> <span> Purchase </span> </Link>
                </Button>
            </CardFooter>
        </Card>
)}