import { createContext, useContext, useState } from "react";

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
 const [products, setProducts] = useState([
    { id: 1, name: 'Basmati Rice', category: 'Grocery', brand: 'India Gate', quantity: 45, unit: 'kg', costPrice: 80, sellingPrice: 100, tax: 5, reorderLevel: 20, maxStock: 100, location: 'Warehouse A', barcode: 'BRC001', expiryDate: '2025-12-31', supplierId: 1 },
    { id: 2, name: 'Coca Cola', category: 'Beverage', brand: 'Coca Cola', quantity: 12, unit: 'bottles', costPrice: 30, sellingPrice: 40, tax: 12, reorderLevel: 30, maxStock: 150, location: 'Warehouse B', barcode: 'BEV001', expiryDate: '2025-11-15', supplierId: 2 },
    { id: 3, name: 'Sunflower Oil', category: 'Grocery', brand: 'Fortune', quantity: 28, unit: 'litre', costPrice: 120, sellingPrice: 150, tax: 5, reorderLevel: 15, maxStock: 50, location: 'Storage Room', barcode: 'GRO001', expiryDate: '2026-06-30', supplierId: 1 },
    { id: 4, name: 'Dettol Soap', category: 'Household', brand: 'Dettol', quantity: 67, unit: 'pieces', costPrice: 25, sellingPrice: 35, tax: 18, reorderLevel: 40, maxStock: 100, location: 'Warehouse A', barcode: 'HOU001', expiryDate: '2026-03-20', supplierId: 3 },
    { id: 5, name: 'Amul Butter', category: 'Dairy', brand: 'Amul', quantity: 8, unit: 'pieces', costPrice: 45, sellingPrice: 55, tax: 12, reorderLevel: 10, maxStock: 30, location: 'Warehouse B', barcode: 'DAI001', expiryDate: '2025-11-30', supplierId: 2 },
    { id: 6, name: 'Tata Tea', category: 'Grocery', brand: 'Tata', quantity: 34, unit: 'kg', costPrice: 300, sellingPrice: 380, tax: 5, reorderLevel: 20, maxStock: 60, location: 'Storage Room', barcode: 'GRO002', expiryDate: '2026-08-15', supplierId: 1 },
  ]);

  // 🔽 update stock after sale
  const reduceStock = (productId, soldQty) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, quantity: Math.max(p.quantity - soldQty, 0) }
          : p
      )
    );
  };

  return (
    <InventoryContext.Provider value={{ products, setProducts, reduceStock }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);
