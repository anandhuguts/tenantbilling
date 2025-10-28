import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Banknote, CreditCard, Smartphone, Printer, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SupermarketBilling = () => {
  const { toast } = useToast();

  // Static product data (as stock)
  const stock = [
    { code: "01", name: "Rice 1kg", price: 60, tax: 5 },
    { code: "02", name: "Wheat 1kg", price: 55, tax: 5 },
    { code: "03", name: "Oil 1L", price: 150, tax: 12 },
  ];

  const [rows, setRows] = useState([
    { code: "", name: "", qty: 1, price: 0, tax: 0, total: 0 },
  ]);

  const [paymentMethod, setPaymentMethod] = useState("cash");

  const handleItemCodeChange = (index: number, value: string) => {
    const updated = [...rows];
    updated[index].code = value;

    const found = stock.find((item) => item.code.toLowerCase() === value.toLowerCase());
    if (found) {
      updated[index].name = found.name;
      updated[index].price = found.price;
      updated[index].tax = found.tax;
      updated[index].total = found.price * updated[index].qty;
    }
    setRows(updated);
  };

  const handleQtyChange = (index: number, qty: number) => {
    const updated = [...rows];
    updated[index].qty = qty;
    updated[index].total = updated[index].price * qty;
    setRows(updated);
  };

  const addNewRow = () => {
    setRows([...rows, { code: "", name: "", qty: 1, price: 0, tax: 0, total: 0 }]);
  };

  const calculateSubtotal = () => rows.reduce((s, r) => s + r.total, 0);
  const calculateTax = () => rows.reduce((s, r) => s + (r.total * r.tax) / 100, 0);
  const calculateTotal = () => calculateSubtotal() + calculateTax();

  const generateBill = () => {
    if (rows.every((r) => !r.name)) {
      toast({
        title: "No items entered",
        description: "Please enter at least one valid product",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Bill Generated",
      description: `Invoice #INV-${Date.now().toString().slice(-6)} created successfully`,
    });

    setRows([{ code: "", name: "", qty: 1, price: 0, tax: 0, total: 0 }]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Supermarket Billing</h1>
        <p className="text-muted-foreground mt-1">
          Type product codes or names to auto-fill details
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Billing Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Billing Table</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Tax %</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={row.code}
                        onChange={(e) => handleItemCodeChange(index, e.target.value)}
                        placeholder="Enter code"
                      />
                    </TableCell>
                    <TableCell>{row.name || "-"}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={row.qty}
                        min={1}
                        onChange={(e) => handleQtyChange(index, Number(e.target.value))}
                        className="w-16"
                      />
                    </TableCell>
                    <TableCell>₹{row.price.toFixed(2)}</TableCell>
                    <TableCell>{row.tax}%</TableCell>
                    <TableCell>₹{row.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button variant="outline" onClick={addNewRow} className="mt-4">
              + Add Row
            </Button>
          </CardContent>
        </Card>

        {/* Right: Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Bill Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{calculateTax().toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <Separator />

            <div>
              <Label>Payment Method</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={paymentMethod === "cash" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("cash")}
                  className="flex-col h-auto py-3"
                >
                  <Banknote className="h-5 w-5 mb-1" />
                  <span className="text-xs">Cash</span>
                </Button>
                <Button
                  variant={paymentMethod === "card" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("card")}
                  className="flex-col h-auto py-3"
                >
                  <CreditCard className="h-5 w-5 mb-1" />
                  <span className="text-xs">Card</span>
                </Button>
                <Button
                  variant={paymentMethod === "upi" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("upi")}
                  className="flex-col h-auto py-3"
                >
                  <Smartphone className="h-5 w-5 mb-1" />
                  <span className="text-xs">UPI</span>
                </Button>
                <Button
                  variant={paymentMethod === "credit" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("credit")}
                  className="flex-col h-auto py-3"
                >
                  <Receipt className="h-5 w-5 mb-1" />
                  <span className="text-xs">Credit</span>
                </Button>
              </div>
            </div>

            <Button onClick={generateBill} className="w-full mt-4" size="lg">
              <Printer className="mr-2 h-4 w-4" />
              Generate Bill
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupermarketBilling;
