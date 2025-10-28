import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  ShoppingCart, 
  TrendingDown, 
  TrendingUp, 
  Search,
  Plus,
  BarChart3
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const InventoryModule = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy data
  const stockItems = [
    { id: 1, name: 'Product A', category: 'Electronics', quantity: 150, minStock: 50, price: 299.99 },
    { id: 2, name: 'Product B', category: 'Clothing', quantity: 20, minStock: 30, price: 49.99 },
    { id: 3, name: 'Product C', category: 'Food', quantity: 200, minStock: 100, price: 9.99 },
  ];

  const salesTransactions = [
    { id: 1, date: '2025-01-20', customer: 'John Doe', items: 3, total: 499.97, payment: 'Card' },
    { id: 2, date: '2025-01-20', customer: 'Jane Smith', items: 2, total: 299.98, payment: 'Cash' },
  ];

  const purchaseTransactions = [
    { id: 1, date: '2025-01-19', supplier: 'Supplier A', items: 50, total: 5000, invoice: 'INV-001' },
    { id: 2, date: '2025-01-18', supplier: 'Supplier B', items: 30, total: 1500, invoice: 'INV-002' },
  ];

  const handleAddSale = () => {
    toast({ title: 'Sale recorded', description: 'Stock has been updated automatically' });
  };

  const handleAddPurchase = () => {
    toast({ title: 'Purchase recorded', description: 'Stock has been updated automatically' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <p className="text-muted-foreground mt-1">Manage sales, purchases, and stock levels</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Stock Value</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-success mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Items</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-destructive mt-1">Needs restocking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,450</div>
            <p className="text-xs text-success mt-1">+8% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Purchases</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,200</div>
            <p className="text-xs text-muted-foreground mt-1">2 transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="purchase">Purchase</TabsTrigger>
          <TabsTrigger value="sales-return">Sales Return</TabsTrigger>
          <TabsTrigger value="purchase-return">Purchase Return</TabsTrigger>
          <TabsTrigger value="stock">Stock View</TabsTrigger>
        </TabsList>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Sales Transactions</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      New Sale
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Record New Sale</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Customer Name</Label>
                        <Input placeholder="Enter customer name" />
                      </div>
                      <div className="space-y-2">
                        <Label>Product</Label>
                        <Input placeholder="Search or scan product" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Quantity</Label>
                          <Input type="number" placeholder="1" />
                        </div>
                        <div className="space-y-2">
                          <Label>Payment Method</Label>
                          <Input placeholder="Cash/Card/UPI" />
                        </div>
                      </div>
                      <Button onClick={handleAddSale} className="w-full">Record Sale</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesTransactions.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell>{sale.customer}</TableCell>
                      <TableCell>{sale.items}</TableCell>
                      <TableCell>${sale.total}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{sale.payment}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Purchase Tab */}
        <TabsContent value="purchase" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Purchase Transactions</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      New Purchase
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Record New Purchase</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Supplier Name</Label>
                        <Input placeholder="Enter supplier name" />
                      </div>
                      <div className="space-y-2">
                        <Label>Invoice Number</Label>
                        <Input placeholder="Enter invoice number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Product</Label>
                        <Input placeholder="Select product" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Quantity</Label>
                          <Input type="number" placeholder="1" />
                        </div>
                        <div className="space-y-2">
                          <Label>Total Amount</Label>
                          <Input type="number" placeholder="0.00" />
                        </div>
                      </div>
                      <Button onClick={handleAddPurchase} className="w-full">Record Purchase</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseTransactions.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell>{purchase.date}</TableCell>
                      <TableCell>{purchase.supplier}</TableCell>
                      <TableCell>{purchase.invoice}</TableCell>
                      <TableCell>{purchase.items}</TableCell>
                      <TableCell>${purchase.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sales Return Tab */}
        <TabsContent value="sales-return" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">No sales returns recorded</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Purchase Return Tab */}
        <TabsContent value="purchase-return" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">No purchase returns recorded</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock View Tab */}
        <TabsContent value="stock" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Stock Summary</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Min Stock</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.minStock}</TableCell>
                      <TableCell>${item.price}</TableCell>
                      <TableCell>
                        <Badge variant={item.quantity < item.minStock ? 'destructive' : 'default'}>
                          {item.quantity < item.minStock ? 'Low Stock' : 'In Stock'}
                        </Badge>
                      </TableCell>
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

export default InventoryModule;
