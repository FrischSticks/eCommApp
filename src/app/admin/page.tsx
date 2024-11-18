import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import db from '@/db/prisma'

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

export default async function AdminDashboard() {
    const salesData = await getSalesData()

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DashboardCard title="Sales" subtitle={salesData.numberOfSales} body={salesData.revenue} />
            <DashboardCard title="Sales" subtitle="Subtitle" body="Body" />
            <DashboardCard title="Sales" subtitle="Subtitle" body="Body" />
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
