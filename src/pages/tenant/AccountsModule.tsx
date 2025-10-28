import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Download,
  DollarSign,
  Scale,
  FileText,
  Receipt
} from 'lucide-react';

const AccountsModule = () => {
  // Dummy data
  const daybookEntries = [
    { id: 1, date: '2025-01-20', type: 'Sale', description: 'Invoice #INV-001', debit: 0, credit: 500 },
    { id: 2, date: '2025-01-20', type: 'Purchase', description: 'Bill #BILL-001', debit: 300, credit: 0 },
    { id: 3, date: '2025-01-20', type: 'Expense', description: 'Rent Payment', debit: 1000, credit: 0 },
  ];

  const ledgerEntries = [
    { id: 1, account: 'Supplier A', type: 'Payable', balance: -5000, status: 'Pending' },
    { id: 2, account: 'Customer John', type: 'Receivable', balance: 1200, status: 'Pending' },
    { id: 3, account: 'Supplier B', type: 'Payable', balance: -3000, status: 'Pending' },
  ];

  const trialBalance = [
    { account: 'Cash', debit: 15000, credit: 0 },
    { account: 'Stock', debit: 47995, credit: 0 },
    { account: 'Accounts Payable', debit: 0, credit: 8000 },
    { account: 'Sales', debit: 0, credit: 13500 },
    { account: 'Purchases', debit: 8000, credit: 0 },
  ];

  const vatReport = [
    { period: 'January 2025', sales: 13500, purchaseVAT: 1440, salesVAT: 2430, payable: 990 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Accounts & Finance</h1>
          <p className="text-muted-foreground mt-1">Manage financial records and statements</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Reports
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Assets</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$62,995</div>
            <p className="text-xs text-muted-foreground mt-1">Cash + Stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Liabilities</CardTitle>
            <DollarSign className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$8,000</div>
            <p className="text-xs text-muted-foreground mt-1">Accounts Payable</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,500</div>
            <p className="text-xs text-success mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">VAT Payable</CardTitle>
            <Receipt className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$990</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different accounts sections */}
      <Tabs defaultValue="daybook" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daybook">Daybook</TabsTrigger>
          <TabsTrigger value="ledger">Ledger</TabsTrigger>
          <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
          <TabsTrigger value="trial-balance">Trial Balance</TabsTrigger>
          <TabsTrigger value="vat">VAT Report</TabsTrigger>
        </TabsList>

        {/* Daybook */}
        <TabsContent value="daybook" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Daily Transaction Book
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Debit</TableHead>
                    <TableHead>Credit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {daybookEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{entry.type}</Badge>
                      </TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell className="text-destructive">${entry.debit || '-'}</TableCell>
                      <TableCell className="text-success">${entry.credit || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ledger */}
        <TabsContent value="ledger" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Account Ledger
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ledgerEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.account}</TableCell>
                      <TableCell>{entry.type}</TableCell>
                      <TableCell className={entry.balance < 0 ? 'text-destructive' : 'text-success'}>
                        ${Math.abs(entry.balance)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{entry.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Balance Sheet */}
        <TabsContent value="balance-sheet" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Assets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between p-3 bg-muted rounded-lg">
                  <span>Cash in Hand</span>
                  <span className="font-bold">$15,000</span>
                </div>
                <div className="flex justify-between p-3 bg-muted rounded-lg">
                  <span>Stock</span>
                  <span className="font-bold">$47,995</span>
                </div>
                <div className="flex justify-between p-3 bg-primary/10 rounded-lg">
                  <span className="font-bold">Total Assets</span>
                  <span className="font-bold text-lg">$62,995</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Liabilities & Equity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between p-3 bg-muted rounded-lg">
                  <span>Accounts Payable</span>
                  <span className="font-bold">$8,000</span>
                </div>
                <div className="flex justify-between p-3 bg-muted rounded-lg">
                  <span>Owner's Equity</span>
                  <span className="font-bold">$54,995</span>
                </div>
                <div className="flex justify-between p-3 bg-primary/10 rounded-lg">
                  <span className="font-bold">Total Liabilities</span>
                  <span className="font-bold text-lg">$62,995</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trial Balance */}
        <TabsContent value="trial-balance" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Trial Balance
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead>Debit</TableHead>
                    <TableHead>Credit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trialBalance.map((entry, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{entry.account}</TableCell>
                      <TableCell className="text-destructive">${entry.debit || '-'}</TableCell>
                      <TableCell className="text-success">${entry.credit || '-'}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold bg-muted">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-destructive">$70,995</TableCell>
                    <TableCell className="text-success">$21,500</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VAT Report */}
        <TabsContent value="vat" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>VAT/Tax Report</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Total Sales</TableHead>
                    <TableHead>Purchase VAT</TableHead>
                    <TableHead>Sales VAT</TableHead>
                    <TableHead>Net Payable</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vatReport.map((entry, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{entry.period}</TableCell>
                      <TableCell>${entry.sales}</TableCell>
                      <TableCell className="text-success">${entry.purchaseVAT}</TableCell>
                      <TableCell className="text-destructive">${entry.salesVAT}</TableCell>
                      <TableCell className="font-bold">${entry.payable}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountsModule;
