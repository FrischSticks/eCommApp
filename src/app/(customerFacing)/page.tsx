import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import db from "@/db/prisma"; 
import { Product } from "@prisma/client";
import Link from "next/link"
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Suspense } from "react";
import { cache } from "@/lib/cache";


// Fetch the Top-Selling Products
// Make function a variable & use custom cache function as => 
const getTopSellingProducts = cache(() => {
    return db.product.findMany({
        where: { isAvailableForPurchase: true },
        orderBy: { orders: { _count: "desc" } },
        take: 6,
    });
    // Passing [] for keyParts (MUST BE UNIQUE!)
    // Revalidates data once a day
}, ["/", "getMostPopularProducts"], { revalidate: 60 *  60 * 24 })

// Fetch the Newest Products
const getNewestProducts = cache(() => {
    return db.product.findMany({
        where: { isAvailableForPurchase: true },
        orderBy: { orders: { _count: "desc" } },
        take: 6,
      });
}, ["/", "getNewestProducts"], { revalidate: 60 *  60 * 24 })

export default function HomePage() {
  return (
    <main className="space-y-12">
      <ProductGridSection
        title="Most Popular"
        productsFetcher={getTopSellingProducts}
      />
      <ProductGridSection title="Newest" productsFetcher={getNewestProducts} />
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
          <Link href="/products" className="space-x-2">
            <span>View All</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductSuspense productsFetcher={productsFetcher} />
        </Suspense>
      </div>
    </div>
  )
}

async function ProductSuspense({
  productsFetcher,
}: {
  productsFetcher: () => Promise<Product[]>
}) {
  return (await productsFetcher()).map(product => (
    <ProductCard key={product.id} {...product} />
  ))
}