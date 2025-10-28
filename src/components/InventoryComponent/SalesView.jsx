import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { TrendingDown,ShoppingCart } from "lucide-react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

export const SalesView = ({ sales, openModal, handleDelete }) => (
  <Card>
    <CardHeader>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <ShoppingCart className="h-5 w-5 text-primary" />
          Sales Transactions ({sales.length})
        </CardTitle>
        <Button onClick={() => openModal('sale')} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Sale
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">Sale ID</th>
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">Date & Time</th>
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">Customer</th>
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">Products</th>
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">Payment</th>
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">Total</th>
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">Profit</th>
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">Staff</th>
              <th className="text-right py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-8 text-muted-foreground text-sm">
                  No sales recorded yet. Create your first sale!
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-2 sm:px-4 font-medium text-sm">#{sale.id}</td>
                  <td className="py-3 px-2 sm:px-4 text-sm">{sale.date}</td>
                  <td className="py-3 px-2 sm:px-4 text-sm">{sale.customerName || sale.customerId || 'Walk-in'}</td>
                  <td className="py-3 px-2 sm:px-4 text-sm">
                    {sale.products.map(p => `${p.name} (${p.qty})`).join(', ')}
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <Badge variant="outline">{sale.paymentType}</Badge>
                  </td>
                  <td className="py-3 px-2 sm:px-4 font-semibold text-sm">₹{sale.total}</td>
                  <td className="py-3 px-2 sm:px-4 text-green-600 font-medium text-sm">₹{sale.profit}</td>
                  <td className="py-3 px-2 sm:px-4 text-sm">{sale.staffId}</td>
                  <td className="py-3 px-2 sm:px-4">
                    <div className="flex gap-1 sm:gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={() => handleDelete('sale', sale.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);