import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { TrendingDown } from "lucide-react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

export const PurchasesView = ({ purchases, openModal, handleDelete }) => (
  <Card>
    <CardHeader>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <TrendingDown className="h-5 w-5 text-primary" />
          Purchase Records ({purchases.length})
        </CardTitle>
        <Button onClick={() => openModal('purchase')} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Purchase
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">Purchase ID</th>
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">Supplier</th>
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">Invoice No</th>
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">Date</th>
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">Products</th>
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">Payment</th>
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">Total</th>
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">Status</th>
              <th className="text-right py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchases.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-8 text-muted-foreground text-sm">
                  No purchases recorded yet. Create your first purchase!
                </td>
              </tr>
            ) : (
              purchases.map((purchase) => (
                <tr key={purchase.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-2 sm:px-4 font-medium text-sm">#{purchase.id}</td>
                  <td className="py-3 px-2 sm:px-4 text-sm">{purchase.supplierName || `Supplier-${purchase.supplierId}`}</td>
                  <td className="py-3 px-2 sm:px-4 text-sm">{purchase.invoiceNo}</td>
                  <td className="py-3 px-2 sm:px-4 text-sm">{purchase.date}</td>
                  <td className="py-3 px-2 sm:px-4 text-sm">
                    {purchase.products.map(p => `${p.name} (${p.qty})`).join(', ')}
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <Badge variant="outline">{purchase.paymentMode}</Badge>
                  </td>
                  <td className="py-3 px-2 sm:px-4 font-semibold text-sm">₹{purchase.total}</td>
                  <td className="py-3 px-2 sm:px-4">
                    <Badge className={purchase.status === 'Paid' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}>
                      {purchase.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <div className="flex gap-1 sm:gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={() => handleDelete('purchase', purchase.id)}>
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