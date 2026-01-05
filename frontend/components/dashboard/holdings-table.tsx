import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const holdings = [
    {
        symbol: "VTI",
        name: "Vanguard Total Stock Market",
        amount: "42.50 shares",
        price: "$240.45",
        total: "$10,219.12",
        change: "+0.45%",
    },
    {
        symbol: "AAPL",
        name: "Apple Inc.",
        amount: "12.00 shares",
        price: "$185.92",
        total: "$2,231.04",
        change: "-1.24%",
    },
    { symbol: "ETH", name: "Ethereum", amount: "1.45 ETH", price: "$2,240.12", total: "$3,248.17", change: "+2.12%" },
    { symbol: "BTC", name: "Bitcoin", amount: "0.04 BTC", price: "$42,500.00", total: "$1,700.00", change: "+4.20%" },
]

export function HoldingsTable() {
    return (
        <Card className="shadow-md bg-sidebar">
            <CardHeader>
                <CardTitle>Active Holdings</CardTitle>
                <CardDescription>Detailed overview of your current investments</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="w-[100px] pl-6">Symbol</TableHead>
                                <TableHead>Asset Name</TableHead>
                                <TableHead className="hidden md:table-cell">Amount</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">Total Value</TableHead>
                                <TableHead className="text-right pr-6">Change</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {holdings.map((holding) => (
                                <TableRow key={holding.symbol} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-bold pl-6">{holding.symbol}</TableCell>
                                    <TableCell className="max-w-[150px] truncate">{holding.name}</TableCell>
                                    <TableCell className="hidden md:table-cell text-muted-foreground">{holding.amount}</TableCell>
                                    <TableCell className="text-right">{holding.price}</TableCell>
                                    <TableCell className="text-right font-medium">{holding.total}</TableCell>
                                    <TableCell className="text-right pr-6">
                                        <Badge variant={holding.change.startsWith("+") ? "secondary" : "destructive"} className="font-mono">
                                            {holding.change}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
