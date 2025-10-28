import { useState } from 'react';

export const useInventoryData = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Basmati Rice', category: 'Grocery', brand: 'India Gate', quantity: 45, unit: 'kg', costPrice: 80, sellingPrice: 100, tax: 5, reorderLevel: 20, maxStock: 100, location: 'Warehouse A', barcode: 'BRC001', expiryDate: '2025-12-31', supplierId: 1 },
    // ... other products
  ]);

  const [sales, setSales] = useState([
    // ... sales data
  ]);

  const [purchases, setPurchases] = useState([
    // ... purchases data
  ]);

  const [salesReturns, setSalesReturns] = useState([
    // ... sales returns data
  ]);

  const [purchaseReturns, setPurchaseReturns] = useState([
    // ... purchase returns data
  ]);

  const [stockAdjustments, setStockAdjustments] = useState([
    // ... adjustments data
  ]);

  // Helper functions
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

  // Calculations
  const lowStockItems = products.filter(item => getStockStatus(item.quantity, item.reorderLevel) === 'low').length;
  const totalValue = products.reduce((sum, item) => sum + (item.quantity * item.sellingPrice), 0);
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);

  return {
    products, setProducts,
    sales, setSales,
    purchases, setPurchases,
    salesReturns, setSalesReturns,
    purchaseReturns, setPurchaseReturns,
    stockAdjustments, setStockAdjustments,
    getStockStatus,
    getStockColor,
    getStockPercentage,
    lowStockItems,
    totalValue,
    totalRevenue
  };
};