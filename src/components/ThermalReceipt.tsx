import React, { forwardRef } from 'react';

// Define the shape of our dummy data
export interface ReceiptItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface ReceiptData {
  storeName: string;
  addressLine1: string;
  addressLine2: string;
  phone: string;
  taxId: string;
  orderNumber: string;
  date: string;
  cashier: string;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
}

// Dummy data
export const dummyReceiptData: ReceiptData = {
  storeName: "THE COFFEE SHOP",
  addressLine1: "123 Main Street",
  addressLine2: "Cityville, ST 12345",
  phone: "Tel: (555) 123-4567",
  taxId: "TAX ID: 987654321",
  orderNumber: "ORD-2023-08-001",
  date: "2023-08-15 14:30:00",
  cashier: "John Doe",
  items: [
    { id: "1", name: "Cappuccino", quantity: 2, price: 4.50 },
    { id: "2", name: "Croissant", quantity: 1, price: 3.75 },
    { id: "3", name: "Blueberry Muffin", quantity: 1, price: 3.25 },
    { id: "4", name: "Espresso", quantity: 1, price: 2.50 },
  ],
  subtotal: 18.50,
  tax: 1.48,
  total: 19.98,
  paymentMethod: "CREDIT CARD",
};

interface ThermalReceiptProps {
  data?: ReceiptData;
}

const ThermalReceipt = forwardRef<HTMLDivElement, ThermalReceiptProps>(
  ({ data = dummyReceiptData }, ref) => {
    return (
      // The outer container matches standard 80mm thermal paper width (~300-350px)
      // font-mono is crucial for the receipt aesthetic
      <div
        ref={ref}
        className="w-[320px] bg-white text-black font-mono p-4 mx-auto text-sm"
        style={{
          // Ensure printing only prints this block with correct background and colors
          printColorAdjust: 'exact',
          WebkitPrintColorAdjust: 'exact',
        }}
      >
        {/* Header Section */}
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold uppercase tracking-wider">{data.storeName}</h1>
          <p className="text-xs mt-1">{data.addressLine1}</p>
          <p className="text-xs">{data.addressLine2}</p>
          <p className="text-xs">{data.phone}</p>
          <p className="text-xs mt-1">{data.taxId}</p>
        </div>

        {/* Divider */}
        <div className="border-t-2 border-dashed border-gray-400 my-2"></div>

        {/* Order Info Section */}
        <div className="text-xs mb-2">
          <div className="flex justify-between">
            <span>Order:</span>
            <span>{data.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{data.date}</span>
          </div>
          <div className="flex justify-between">
            <span>Cashier:</span>
            <span>{data.cashier}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t-2 border-dashed border-gray-400 my-2"></div>

        {/* Items Header */}
        <div className="flex justify-between text-xs font-bold mb-1">
          <span className="w-1/2">ITEM</span>
          <span className="w-1/6 text-center">QTY</span>
          <span className="w-1/3 text-right">TOTAL</span>
        </div>

        {/* Items List */}
        <div className="text-xs mb-2">
          {data.items.map((item) => (
            <div key={item.id} className="flex justify-between mb-1">
              <span className="w-1/2 truncate pr-2">{item.name}</span>
              <span className="w-1/6 text-center">{item.quantity}</span>
              <span className="w-1/3 text-right">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t-2 border-dashed border-gray-400 my-2"></div>

        {/* Summary Section */}
        <div className="text-xs">
          <div className="flex justify-between mb-1">
            <span>Subtotal:</span>
            <span>${data.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Tax (8%):</span>
            <span>${data.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-base mt-2 mb-1">
            <span>TOTAL:</span>
            <span>${data.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mt-2">
            <span>Payment:</span>
            <span>{data.paymentMethod}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t-2 border-dashed border-gray-400 my-2 mt-4"></div>

        {/* Footer Section */}
        <div className="text-center mt-4 text-xs">
          <p className="font-bold">THANK YOU FOR YOUR VISIT!</p>
          <p className="mt-1">Please come again</p>
          
          {/* Dummy Barcode Area */}
          <div className="mt-4 flex flex-col items-center justify-center">
            <div className="w-48 h-12 bg-black flex space-x-1 p-1">
               {/* Simulating barcode bars deterministically to prevent hydration mismatch */}
               {[...Array(30)].map((_, i) => {
                 // Deterministic pseudo-random width between 1 and 4
                 const width = (Math.abs(Math.sin(i * 12.345)) * 3) + 1;
                 return (
                   <div 
                     key={i} 
                     className="bg-white h-full" 
                     style={{ width: `${width}px` }}
                   />
                 );
               })}
            </div>
            <span className="mt-1 text-[10px] tracking-[0.2em]">{data.orderNumber.replace(/[^0-9]/g, '')}</span>
          </div>
        </div>
      </div>
    );
  }
);

ThermalReceipt.displayName = 'ThermalReceipt';

export default ThermalReceipt;
