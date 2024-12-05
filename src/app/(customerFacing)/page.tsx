import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import db from "@/db/prisma"; 
import { Product } from "@prisma/client";
import Link from "next/link"


// Fetch the Top-Selling Products
async function getTopSellingProducts() {
    return db.product.findMany({
        where: { isAvailableForPurchase: true },
        orderBy: { orders: { _count: "desc" } },
        take: 6,
    });
}

// Fetch the Newest Products
async function getNewestProducts() {
    return db.product.findMany({
        where: { isAvailableForPurchase: true },
        orderBy: { orders: { _count: "desc" } },
        take: 6,
      })
}

export default function HomePage() {
    return (
      <main className="space-y-12">
        <ProductGridSection
          title="Most Popular"
          productsFetcher={ getTopSellingProducts }
        />
        <ProductGridSection 
          title="Newest" 
          productsFetcher={ getNewestProducts } 
        />
      </main>
    )
  }
  
  type ProductGridSectionProps = {
    title: string
    productsFetcher: () => Promise<Product[]>
  }
  
  function ProductGridSection({
    productsFetcher,
    title,
  }: ProductGridSectionProps) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <h2 className="text-3xl font-bold">{title}</h2>
          <Button variant="outline" asChild>
            <div className="space-x-2">
              <Link href="/products">
                <span>View All</span>
              </Link>
              <ArrowRight className="size-4" />
            </div>
          </Button>
        </div>
      </div>
)}
