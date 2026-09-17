"use client";

import { useState } from "react";
import ThermalReceipt, { dummyReceiptData } from "@/components/ThermalReceipt";
import { printerClient } from "@/lib/printer";

export default function Home() {
  const [printing, setPrinting] = useState(false);

  const handlePrint = async () => {
    setPrinting(true);
    try {
      // 1. Build receipt matching our dummy data using HTML payload
      // In a real application, you'd use ReactDOMServer.renderToString(<ThermalReceipt />)
      // but since we're in a client component, we'll send a basic HTML payload to demonstrate functionality
      const htmlPayload = `
        <div style="font-family: monospace; width: 300px; text-align: center;">
          <h1>${dummyReceiptData.storeName}</h1>
          <p>${dummyReceiptData.addressLine1}</p>
          <hr/>
          <p>Order: ${dummyReceiptData.orderNumber}</p>
          <p>Total: $${dummyReceiptData.total.toFixed(2)}</p>
        </div>
      `;

      // 2. Dispatch job directly from browser to localhost bridge
      await printerClient.print({
        type: "html",
        printer: "receipt", // Using dynamic routing mapped in bridge
        html: htmlPayload,
      });

      alert("Printing initiated successfully!");
    } catch (e) {
      console.error(e);
      alert("Failed to connect to local printer bridge. Make sure the bridge is running!");
    } finally {
      setPrinting(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-10 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Thermal Print Bill Template
      </h1>

      <div className="mb-8 flex space-x-4">
        <button
          onClick={handlePrint}
          disabled={printing}
          className="px-6 py-2 bg-black text-white font-semibold rounded shadow-md hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {printing ? "Printing..." : "Print Receipt (node-print)"}
        </button>
      </div>

      <div className="shadow-2xl bg-white border border-gray-200">
        <ThermalReceipt />
      </div>
    </div>
  );
}
