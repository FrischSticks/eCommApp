import db from "@/db/prisma";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Suspense } from "react";

function getProducts() {
    return db.product.findMany({ 
        where: { isAvailableForPurchase: true }, 
        orderBy: { name: "asc" }
    })
}

async function ProductSuspense() {
    const products = await getProducts()

    return products.map(product => (
        <ProductCard key={product.id} {...product} />
    ))
}

export default function ProductsPage() {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <Suspense
      fallback={
        <>
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </>
      }
    >
      <ProductSuspense />
    </Suspense>
  </div>
}