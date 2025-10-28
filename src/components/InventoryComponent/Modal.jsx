import { X, Save, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export  const Modal = ({ showModal, modalType, editingItem, formData, setFormData, products, sales, saleProducts, setSaleProducts, purchaseProducts, setPurchaseProducts, returnItems, setReturnItems, onClose, onSubmit }) => {
  if (!showModal) return null;

  const getModalTitle = () => {
    const titles = {
      product: editingItem ? 'Edit Product' : 'Add New Product',
      sale: 'New Sale Transaction',
      purchase: 'New Purchase Order',
      salesReturn: 'New Sales Return',
      purchaseReturn: 'New Purchase Return',
      adjustment: 'Stock Adjustment'
    };
    return titles[modalType];
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-background rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 sm:p-6 border-b flex justify-between items-center sticky top-0 bg-background z-10">
          <h2 className="text-lg sm:text-xl font-bold">{getModalTitle()}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="p-4 sm:p-6 space-y-4">
          {modalType === 'product' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Brand *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                  value={formData.brand || ''}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
                <select
                  required
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                  value={formData.category || 'Grocery'}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option>Grocery</option>
                  <option>Beverage</option>
                  <option>Household</option>
                  <option>Dairy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Barcode *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                  value={formData.barcode || ''}
                  onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quantity *</label>
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                  value={formData.quantity || 0}
                  onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Unit *</label>
                <input
                  type="text"
                  required
                  placeholder="kg, litre, pieces, etc."
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                  value={formData.unit || ''}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cost Price (₹) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                  value={formData.costPrice || 0}
                  onChange={(e) => setFormData({...formData, costPrice: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Selling Price (₹) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                  value={formData.sellingPrice || 0}
                  onChange={(e) => setFormData({...formData, sellingPrice: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tax (%) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                  value={formData.tax || 0}
                  onChange={(e) => setFormData({...formData, tax: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reorder Level *</label>
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                  value={formData.reorderLevel || 0}
                  onChange={(e) => setFormData({...formData, reorderLevel: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Max Stock *</label>
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                  value={formData.maxStock || 0}
                  onChange={(e) => setFormData({...formData, maxStock: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Expiry Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                  value={formData.expiryDate || ''}
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Supplier ID *</label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                  value={formData.supplierId || 1}
                  onChange={(e) => setFormData({...formData, supplierId: parseInt(e.target.value) || 1})}
                />
              </div>
            </div>
          )}

          {modalType === 'sale' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Customer ID</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                    value={formData.customerId || ''}
                    onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Customer Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                    value={formData.customerName || ''}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Payment Type *</label>
                  <select
                    required
                    className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                    value={formData.paymentType || 'Cash'}
                    onChange={(e) => setFormData({...formData, paymentType: e.target.value})}
                  >
                    <option>Cash</option>
                    <option>UPI</option>
                    <option>Card</option>
                    <option>Credit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Staff ID *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                    value={formData.staffId || 'S001'}
                    onChange={(e) => setFormData({...formData, staffId: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="font-medium text-sm">Products *</label>
                  <Button type="button" size="sm" onClick={() => setSaleProducts([...saleProducts, { productId: '', qty: 1 }])}>
                    <Plus className="h-3 w-3 mr-1" /> Add Product
                  </Button>
                </div>
                {saleProducts.map((sp, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                    <select
                      required
                      className="sm:col-span-2 px-3 py-2 border rounded-md bg-background text-sm"
                      value={sp.productId}
                      onChange={(e) => {
                        const updated = [...saleProducts];
                        updated[idx].productId = e.target.value;
                        setSaleProducts(updated);
                      }}
                    >
                      <option value="">Select Product</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} - ₹{p.sellingPrice} ({p.quantity} {p.unit} available)</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="Qty"
                      className="px-3 py-2 border rounded-md bg-background text-sm"
                      value={sp.qty}
                      onChange={(e) => {
                        const updated = [...saleProducts];
                        updated[idx].qty = parseInt(e.target.value) || 1;
                        setSaleProducts(updated);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {modalType === 'purchase' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Supplier ID *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                    value={formData.supplierId || 1}
                    onChange={(e) => setFormData({...formData, supplierId: parseInt(e.target.value) || 1})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Supplier Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                    value={formData.supplierName || ''}
                    onChange={(e) => setFormData({...formData, supplierName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Invoice No *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                    value={formData.invoiceNo || ''}
                    onChange={(e) => setFormData({...formData, invoiceNo: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                    value={formData.date || ''}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Payment Mode *</label>
                  <select
                    required
                    className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                    value={formData.paymentMode || 'Cash'}
                    onChange={(e) => setFormData({...formData, paymentMode: e.target.value})}
                  >
                    <option>Cash</option>
                    <option>UPI</option>
                    <option>Card</option>
                    <option>Credit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status *</label>
                  <select
                    required
                    className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                    value={formData.status || 'Unpaid'}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option>Paid</option>
                    <option>Unpaid</option>
                  </select>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="font-medium text-sm">Products *</label>
                  <Button type="button" size="sm" onClick={() => setPurchaseProducts([...purchaseProducts, { productId: '', qty: 1 }])}>
                    <Plus className="h-3 w-3 mr-1" /> Add Product
                  </Button>
                </div>
                {purchaseProducts.map((pp, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                    <select
                      required
                      className="sm:col-span-2 px-3 py-2 border rounded-md bg-background text-sm"
                      value={pp.productId}
                      onChange={(e) => {
                        const updated = [...purchaseProducts];
                        updated[idx].productId = e.target.value;
                        setPurchaseProducts(updated);
                      }}
                    >
                      <option value="">Select Product</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} - ₹{p.costPrice} per {p.unit}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="Qty"
                      className="px-3 py-2 border rounded-md bg-background text-sm"
                      value={pp.qty}
                      onChange={(e) => {
                        const updated = [...purchaseProducts];
                        updated[idx].qty = parseInt(e.target.value) || 1;
                        setPurchaseProducts(updated);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {modalType === 'salesReturn' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Original Sale ID *</label>
                  <select
                    required
                    className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                    value={formData.originalSaleId || ''}
                    onChange={(e) => setFormData({...formData, originalSaleId: e.target.value})}
                  >
                    <option value="">Select Sale</option>
                    {sales.map(s => (
                      <option key={s.id} value={s.id}>Sale #{s.id} - {s.date} - ₹{s.total}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Refund Type *</label>
                  <select
                    required
                    className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                    value={formData.refundType || 'Cash'}
                    onChange={(e) => setFormData({...formData, refundType: e.target.value})}
                  >
                    <option>Cash</option>
                    <option>Replacement</option>
                    <option>Credit</option>
                  </select>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="font-medium text-sm">Return Items *</label>
                  <Button type="button" size="sm" onClick={() => setReturnItems([...returnItems, { productId: '', qty: 1, reason: '' }])}>
                    <Plus className="h-3 w-3 mr-1" /> Add Item
                  </Button>
                </div>
                {returnItems.map((ri, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                    <select
                      required
                      className="px-3 py-2 border rounded-md bg-background text-sm"
                      value={ri.productId}
                      onChange={(e) => {
                        const updated = [...returnItems];
                        updated[idx].productId = e.target.value;
                        setReturnItems(updated);
                      }}
                    >
                      <option value="">Select Product</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="Qty"
                      className="px-3 py-2 border rounded-md bg-background text-sm"
                      value={ri.qty}
                      onChange={(e) => {
                        const updated = [...returnItems];
                        updated[idx].qty = parseInt(e.target.value) || 1;
                        setReturnItems(updated);
                      }}
                    />
                    <input
                      type="text"
                      required
                      placeholder="Reason"
                      className="px-3 py-2 border rounded-md bg-background text-sm"
                      value={ri.reason}
                      onChange={(e) => {
                        const updated = [...returnItems];
                        updated[idx].reason = e.target.value;
                        setReturnItems(updated);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {modalType === 'purchaseReturn' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Supplier ID *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                    value={formData.supplierId || 1}
                    onChange={(e) => setFormData({...formData, supplierId: parseInt(e.target.value) || 1})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Supplier Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                    value={formData.supplierName || ''}
                    onChange={(e) => setFormData({...formData, supplierName: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="font-medium text-sm">Return Items *</label>
                  <Button type="button" size="sm" onClick={() => setReturnItems([...returnItems, { productId: '', qty: 1, reason: '' }])}>
                    <Plus className="h-3 w-3 mr-1" /> Add Item
                  </Button>
                </div>
                {returnItems.map((ri, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                    <select
                      required
                      className="px-3 py-2 border rounded-md bg-background text-sm"
                      value={ri.productId}
                      onChange={(e) => {
                        const updated = [...returnItems];
                        updated[idx].productId = e.target.value;
                        setReturnItems(updated);
                      }}
                    >
                      <option value="">Select Product</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="Qty"
                      className="px-3 py-2 border rounded-md bg-background text-sm"
                      value={ri.qty}
                      onChange={(e) => {
                        const updated = [...returnItems];
                        updated[idx].qty = parseInt(e.target.value) || 1;
                        setReturnItems(updated);
                      }}
                    />
                    <input
                      type="text"
                      required
                      placeholder="Reason"
                      className="px-3 py-2 border rounded-md bg-background text-sm"
                      value={ri.reason}
                      onChange={(e) => {
                        const updated = [...returnItems];
                        updated[idx].reason = e.target.value;
                        setReturnItems(updated);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {modalType === 'adjustment' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product *</label>
                <select
                  required
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                  value={formData.productId || ''}
                  onChange={(e) => setFormData({...formData, productId: e.target.value})}
                >
                  <option value="">Select Product</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - Current: {p.quantity} {p.unit}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type *</label>
                <select
                  required
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                  value={formData.type || 'Add'}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="Add">Add</option>
                  <option value="Remove">Remove</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quantity *</label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                  value={formData.quantity || 0}
                  onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Damage, Expiry, Loss"
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                  value={formData.reason || ''}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button type="submit" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {editingItem ? 'Update' : 'Save'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};