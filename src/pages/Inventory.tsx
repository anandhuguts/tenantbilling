import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {Modal} from '../components/InventoryComponent/Modal';
import {StatsCard} from '../components/InventoryComponent/StatsCard';
import {LowStockAlert,SearchFilter,TabNavigation} from '../components/InventoryComponent/SmallComponents';
import {StockView} from '../components/InventoryComponent/StockView';
import {SalesView} from '../components/InventoryComponent/SalesView';
import {PurchasesView} from '../components/InventoryComponent/PurchasesView';
import {ReturnsView} from '../components/InventoryComponent/ReturnsView';
import {AdjustmentsView} from '../components/InventoryComponent/AdjustmentsView';

import {StockTableRow} from '../components/InventoryComponent/StockTableRow';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Package, Plus, AlertTriangle, ShoppingCart, TrendingUp, TrendingDown, RotateCcw, Edit, Trash2, Search, X, Save } from 'lucide-react';

// Stats Card Component


// Low Stock Alert Component


// Stock Table Row Component


// Stock View Component


// Sales View Component


// Purchases View Component


// Returns View Component

// Adjustments View Component



// Main Component
const GroceryInventory = () => {
  const [activeTab, setActiveTab] = useState('stock');
  const [products, setProducts] = useState([
    { id: 1, name: 'Basmati Rice', category: 'Grocery', brand: 'India Gate', quantity: 45, unit: 'kg', costPrice: 80, sellingPrice: 100, tax: 5, reorderLevel: 20, maxStock: 100, location: 'Warehouse A', barcode: 'BRC001', expiryDate: '2025-12-31', supplierId: 1 },
    { id: 2, name: 'Coca Cola', category: 'Beverage', brand: 'Coca Cola', quantity: 12, unit: 'bottles', costPrice: 30, sellingPrice: 40, tax: 12, reorderLevel: 30, maxStock: 150, location: 'Warehouse B', barcode: 'BEV001', expiryDate: '2025-11-15', supplierId: 2 },
    { id: 3, name: 'Sunflower Oil', category: 'Grocery', brand: 'Fortune', quantity: 28, unit: 'litre', costPrice: 120, sellingPrice: 150, tax: 5, reorderLevel: 15, maxStock: 50, location: 'Storage Room', barcode: 'GRO001', expiryDate: '2026-06-30', supplierId: 1 },
    { id: 4, name: 'Dettol Soap', category: 'Household', brand: 'Dettol', quantity: 67, unit: 'pieces', costPrice: 25, sellingPrice: 35, tax: 18, reorderLevel: 40, maxStock: 100, location: 'Warehouse A', barcode: 'HOU001', expiryDate: '2026-03-20', supplierId: 3 },
    { id: 5, name: 'Amul Butter', category: 'Dairy', brand: 'Amul', quantity: 8, unit: 'pieces', costPrice: 45, sellingPrice: 55, tax: 12, reorderLevel: 10, maxStock: 30, location: 'Warehouse B', barcode: 'DAI001', expiryDate: '2025-11-30', supplierId: 2 },
    { id: 6, name: 'Tata Tea', category: 'Grocery', brand: 'Tata', quantity: 34, unit: 'kg', costPrice: 300, sellingPrice: 380, tax: 5, reorderLevel: 20, maxStock: 60, location: 'Storage Room', barcode: 'GRO002', expiryDate: '2026-08-15', supplierId: 1 },
  ]);

  const [sales, setSales] = useState([
    { id: 1, date: '2025-10-28 10:30', customerId: 'C001', customerName: 'Rajesh Kumar', products: [{productId: 1, name: 'Basmati Rice', qty: 5, price: 100, tax: 5}], paymentType: 'UPI', total: 525, profit: 100, staffId: 'S001' },
    { id: 2, date: '2025-10-28 11:15', customerId: 'C002', customerName: 'Priya Sharma', products: [{productId: 2, name: 'Coca Cola', qty: 6, price: 40, tax: 12}], paymentType: 'Cash', total: 269, profit: 60, staffId: 'S001' },
  ]);

  const [purchases, setPurchases] = useState([
    { id: 1, supplierId: 1, supplierName: 'ABC Distributors', invoiceNo: 'INV-2025-001', date: '2025-10-25', products: [{productId: 1, name: 'Basmati Rice', qty: 50, cost: 80}], paymentMode: 'Credit', total: 4000, status: 'Unpaid' },
    { id: 2, supplierId: 2, supplierName: 'XYZ Wholesale', invoiceNo: 'INV-2025-002', date: '2025-10-26', products: [{productId: 2, name: 'Coca Cola', qty: 100, cost: 30}], paymentMode: 'Cash', total: 3000, status: 'Paid' },
  ]);

  const [salesReturns, setSalesReturns] = useState([
    { id: 1, originalSaleId: 1, date: '2025-10-28', items: [{productId: 1, name: 'Basmati Rice', qty: 1, reason: 'Damaged packaging'}], refundType: 'Cash', totalRefund: 105 },
  ]);

  const [purchaseReturns, setPurchaseReturns] = useState([
    { id: 1, supplierId: 1, supplierName: 'ABC Distributors', date: '2025-10-27', items: [{productId: 1, name: 'Basmati Rice', qty: 5, reason: 'Poor quality'}], amountAdjusted: 400 },
  ]);

  const [stockAdjustments, setStockAdjustments] = useState([
    { id: 1, productId: 1, productName: 'Basmati Rice', type: 'Remove', quantity: 2, reason: 'Damage', date: '2025-10-27' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [saleProducts, setSaleProducts] = useState([{ productId: '', qty: 1 }]);
  const [purchaseProducts, setPurchaseProducts] = useState([{ productId: '', qty: 1 }]);
  const [returnItems, setReturnItems] = useState([{ productId: '', qty: 1, reason: '' }]);

  const getStockStatus = (quantity, reorderLevel) => {
    if (quantity < reorderLevel) return 'low';
    if (quantity < reorderLevel * 1.5) return 'warning';
    return 'good';
  };

  const getStockColor = (status) => {
    switch (status) {
      case 'low': return 'bg-red-500/10 text-red-500';
      case 'warning': return 'bg-yellow-500/10 text-yellow-500';
      case 'good': return 'bg-green-500/10 text-green-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStockPercentage = (quantity, maxStock) => {
    return Math.min((quantity / maxStock) * 100, 100);
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    if (item) {
      setFormData(item);
    } else {
      switch(type) {
        case 'product':
          setFormData({ name: '', category: 'Grocery', brand: '', quantity: 0, unit: 'kg', costPrice: 0, sellingPrice: 0, tax: 0, reorderLevel: 0, maxStock: 0, location: '', barcode: '', expiryDate: '', supplierId: 1 });
          break;
        case 'sale':
          setFormData({ customerId: '', customerName: '', paymentType: 'Cash', staffId: 'S001' });
          setSaleProducts([{ productId: '', qty: 1 }]);
          break;
        case 'purchase':
          setFormData({ supplierId: 1, supplierName: '', invoiceNo: '', date: new Date().toISOString().split('T')[0], paymentMode: 'Cash', status: 'Unpaid' });
          setPurchaseProducts([{ productId: '', qty: 1 }]);
          break;
        case 'salesReturn':
          setFormData({ originalSaleId: '', refundType: 'Cash' });
          setReturnItems([{ productId: '', qty: 1, reason: '' }]);
          break;
        case 'purchaseReturn':
          setFormData({ supplierId: 1, supplierName: '' });
          setReturnItems([{ productId: '', qty: 1, reason: '' }]);
          break;
        case 'adjustment':
          setFormData({ productId: '', type: 'Add', quantity: 0, reason: '' });
          break;
      }
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
    setSaleProducts([{ productId: '', qty: 1 }]);
    setPurchaseProducts([{ productId: '', qty: 1 }]);
    setReturnItems([{ productId: '', qty: 1, reason: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    switch(modalType) {
      case 'product':
        if (editingItem) {
          setProducts(products.map(p => p.id === editingItem.id ? { ...formData, id: editingItem.id } : p));
        } else {
          const newProduct = { ...formData, id: Math.max(...products.map(p => p.id), 0) + 1 };
          setProducts([...products, newProduct]);
        }
        break;
        
      case 'sale':
        const saleProductsData = saleProducts
          .filter(sp => sp.productId)
          .map(sp => {
            const product = products.find(p => p.id === parseInt(sp.productId));
            return {
              productId: product.id,
              name: product.name,
              qty: parseInt(sp.qty),
              price: product.sellingPrice,
              tax: product.tax
            };
          });
        
        const saleTotal = saleProductsData.reduce((sum, p) => {
          const taxAmount = (p.price * p.qty * p.tax) / 100;
          return sum + (p.price * p.qty) + taxAmount;
        }, 0);
        
        const saleProfit = saleProductsData.reduce((sum, p) => {
          const product = products.find(pr => pr.id === p.productId);
          return sum + ((p.price - product.costPrice) * p.qty);
        }, 0);
        
        const newSale = { 
          ...formData, 
          id: Math.max(...sales.map(s => s.id), 0) + 1,
          date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          products: saleProductsData,
          total: Math.round(saleTotal),
          profit: Math.round(saleProfit)
        };
        setSales([...sales, newSale]);
        
        saleProductsData.forEach(p => {
          setProducts(products.map(pr => 
            pr.id === p.productId ? { ...pr, quantity: pr.quantity - p.qty } : pr
          ));
        });
        break;
        
      case 'purchase':
        const purchaseProductsData = purchaseProducts
          .filter(pp => pp.productId)
          .map(pp => {
            const product = products.find(p => p.id === parseInt(pp.productId));
            return {
              productId: product.id,
              name: product.name,
              qty: parseInt(pp.qty),
              cost: product.costPrice
            };
          });
        
        const purchaseTotal = purchaseProductsData.reduce((sum, p) => sum + (p.qty * p.cost), 0);
        
        const newPurchase = { 
          ...formData, 
          id: Math.max(...purchases.map(p => p.id), 0) + 1,
          products: purchaseProductsData,
          total: purchaseTotal
        };
        setPurchases([...purchases, newPurchase]);
        
        purchaseProductsData.forEach(p => {
          setProducts(products.map(pr => 
            pr.id === p.productId ? { ...pr, quantity: pr.quantity + p.qty } : pr
          ));
        });
        break;
        
      case 'salesReturn':
        const returnItemsData = returnItems
          .filter(ri => ri.productId)
          .map(ri => {
            const product = products.find(p => p.id === parseInt(ri.productId));
            return {
              productId: product.id,
              name: product.name,
              qty: parseInt(ri.qty),
              reason: ri.reason
            };
          });
        
        const originalSale = sales.find(s => s.id === parseInt(formData.originalSaleId));
        const refundTotal = returnItemsData.reduce((sum, i) => {
          const saleProduct = originalSale?.products.find(p => p.productId === i.productId);
          if (saleProduct) {
            const taxAmount = (saleProduct.price * i.qty * saleProduct.tax) / 100;
            return sum + (saleProduct.price * i.qty) + taxAmount;
          }
          return sum;
        }, 0);
        
        const newSalesReturn = { 
          ...formData, 
          id: Math.max(...salesReturns.map(r => r.id), 0) + 1,
          date: new Date().toISOString().split('T')[0],
          items: returnItemsData,
          totalRefund: Math.round(refundTotal)
        };
        setSalesReturns([...salesReturns, newSalesReturn]);
        
        returnItemsData.forEach(i => {
          if (i.reason !== 'Damaged') {
            setProducts(products.map(p => 
              p.id === i.productId ? { ...p, quantity: p.quantity + i.qty } : p
            ));
          }
        });
        break;
        
      case 'purchaseReturn':
        const purchaseReturnItemsData = returnItems
          .filter(ri => ri.productId)
          .map(ri => {
            const product = products.find(p => p.id === parseInt(ri.productId));
            return {
              productId: product.id,
              name: product.name,
              qty: parseInt(ri.qty),
              reason: ri.reason
            };
          });
        
        const adjustedAmount = purchaseReturnItemsData.reduce((sum, i) => {
          const product = products.find(p => p.id === i.productId);
          return sum + (product.costPrice * i.qty);
        }, 0);
        
        const newPurchaseReturn = { 
          ...formData, 
          id: Math.max(...purchaseReturns.map(r => r.id), 0) + 1,
          date: new Date().toISOString().split('T')[0],
          items: purchaseReturnItemsData,
          amountAdjusted: adjustedAmount
        };
        setPurchaseReturns([...purchaseReturns, newPurchaseReturn]);
        
        purchaseReturnItemsData.forEach(i => {
          setProducts(products.map(p => 
            p.id === i.productId ? { ...p, quantity: Math.max(0, p.quantity - i.qty) } : p
          ));
        });
        break;
        
      case 'adjustment':
        const product = products.find(p => p.id === parseInt(formData.productId));
        const newAdjustment = { 
          ...formData, 
          id: Math.max(...stockAdjustments.map(a => a.id), 0) + 1,
          productName: product.name,
          date: new Date().toISOString().split('T')[0]
        };
        setStockAdjustments([...stockAdjustments, newAdjustment]);
        
        if (product) {
          const newQty = formData.type === 'Add' 
            ? product.quantity + parseInt(formData.quantity)
            : Math.max(0, product.quantity - parseInt(formData.quantity));
          setProducts(products.map(p => 
            p.id === product.id ? { ...p, quantity: newQty } : p
          ));
        }
        break;
    }
    
    closeModal();
  };

  const handleDelete = (type, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    switch(type) {
      case 'product':
        setProducts(products.filter(p => p.id !== id));
        break;
      case 'sale':
        setSales(sales.filter(s => s.id !== id));
        break;
      case 'purchase':
        setPurchases(purchases.filter(p => p.id !== id));
        break;
    }
  };

  const lowStockItems = products.filter(item => getStockStatus(item.quantity, item.reorderLevel) === 'low').length;
  const totalValue = products.reduce((sum, item) => sum + (item.quantity * item.sellingPrice), 0);
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);

  const categories = ['All', ...new Set(products.map(p => p.category))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.barcode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package },
    { label: 'Low Stock Items', value: lowStockItems, icon: AlertTriangle, color: 'text-red-500' },
    { label: 'Total Stock Value', value: `₹${totalValue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-500' },
    { label: 'Total Sales Today', value: `₹${totalRevenue.toLocaleString()}`, icon: ShoppingCart, color: 'text-blue-500' },
  ];

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Inventory Management</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">Complete grocery store inventory system</p>
          </div>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatsCard key={index} stat={stat} />
          ))}
        </div>

        <LowStockAlert count={lowStockItems} />

        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'stock' && (
          <StockView
            products={filteredProducts}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            categories={categories}
            openModal={openModal}
            handleDelete={(id) => handleDelete('product', id)}
            getStockStatus={getStockStatus}
            getStockColor={getStockColor}
            getStockPercentage={getStockPercentage}
          />
        )}
        
        {activeTab === 'sales' && (
          <SalesView
            sales={sales}
            openModal={openModal}
            handleDelete={handleDelete}
          />
        )}
        
        {activeTab === 'purchases' && (
          <PurchasesView
            purchases={purchases}
            openModal={openModal}
            handleDelete={handleDelete}
          />
        )}
        
        {activeTab === 'returns' && (
          <ReturnsView
            salesReturns={salesReturns}
            purchaseReturns={purchaseReturns}
            openModal={openModal}
          />
        )}
        
        {activeTab === 'adjustments' && (
          <AdjustmentsView
            stockAdjustments={stockAdjustments}
            openModal={openModal}
          />
        )}
      </div>

      <Modal
        showModal={showModal}
        modalType={modalType}
        editingItem={editingItem}
        formData={formData}
        setFormData={setFormData}
        products={products}
        sales={sales}
        saleProducts={saleProducts}
        setSaleProducts={setSaleProducts}
        purchaseProducts={purchaseProducts}
        setPurchaseProducts={setPurchaseProducts}
        returnItems={returnItems}
        setReturnItems={setReturnItems}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default GroceryInventory;