import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import db from '@/db/prisma'
import { formatCurrency, formatNumber } from '@/lib/formatters';

async function getSalesData() {
    const data = await db.order.aggregate({
        // Sum of all pricePaidInCents
        _sum: { pricePaidInCents: true},
        // Counts Rows in Db
        _count: true
    })

    return {
        // Returns Amount in $ rather than Cents
        revenue: (data._sum.pricePaidInCents || 0) / 100,
        numberOfSales: data._count
    }
}

async function getUserData() {
    const [ userCount, orderData ] = await Promise.all([
        db.user.count(),
        db.order.aggregate({
            _sum: { pricePaidInCents: true }
        })
    ])

    return {
        userCount,
        averageValuePerUser: userCount === 0 ? 0: (orderData._sum.pricePaidInCents || 0) / 100 / userCount
    }
}

async function getProductData() {
    const [ activeProducts, inactiveProducts ] = await Promise.all([
        db.product.count({ where: { isAvailableForPurchase: true }}),
        db.product.count({ where: { isAvailableForPurchase: false }})
    ])

    return { activeProducts, inactiveProducts }
}

export default async function AdminDashboard() {
    const [ salesData, userData, productData ] = await Promise.all([
        getSalesData(),
        getUserData(),
        getProductData()
    ])

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DashboardCard 
                title= "Sales" 
                subtitle= {`${formatNumber(salesData.numberOfSales)}  Orders`}
                body= {formatCurrency(salesData.revenue)} 
            />

            <DashboardCard 
                title= "Customers" 
                subtitle= {`Average Value: ${formatCurrency(userData.averageValuePerUser)}`} 
                body= {formatNumber(userData.userCount)}
            />

            <DashboardCard 
                title= "Products" 
                subtitle= {`${formatNumber(productData.inactiveProducts)} Inactive`}
                body= {`${formatNumber(productData.activeProducts)} Active`}
            />
        </div>
    );
}

type DashboardCardProps = {
    title: string;
    subtitle: string | number;
    body: string | number;
};

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle> {title} </CardTitle>
                <CardDescription> {subtitle} </CardDescription>
            </CardHeader>
            <CardContent>
                <p> {body} </p>
            </CardContent>
        </Card>
    );
}
