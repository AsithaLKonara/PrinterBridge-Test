"use client";

import { useState } from "react";
import ThermalReceipt, { dummyReceiptData } from "@/components/ThermalReceipt";
import { printerClient } from "@/lib/printer";

export default function Home() {
  const [printing, setPrinting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(`[Test App] ${message}`);
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const handlePrint = async () => {
    setLogs([]); // Clear logs on new print
    addLog("Step 1: Initiating print process (v2.0.0 architecture)...");
    setPrinting(true);
    
    try {
      addLog("Step 2: Connecting to bridge service...");
      await printerClient.connect();
      
      addLog("Step 3: Fetching available printers...");
      const printers = await printerClient.printers.list();
      
      if (!printers || printers.length === 0) {
        addLog("Step X: No printers found on the bridge (will fallback to default routing).");
      } else {
        addLog(`Found ${printers.length} printer(s). Using printer: ${printers[0].id}`);
      }

      addLog("Step 4: Building HTML payload matching dummy data...");
      const htmlPayload = `
        <div style="font-family: monospace; width: 300px; text-align: center;">
          <h1>${dummyReceiptData.storeName}</h1>
          <p>${dummyReceiptData.addressLine1}</p>
          <hr/>
          <p>Order: ${dummyReceiptData.orderNumber}</p>
          <p>Total: $${dummyReceiptData.total.toFixed(2)}</p>
        </div>
      `;
      
      addLog("Step 5: HTML Payload generated. Dispatching job...");
      
      const response = await printerClient.print({
        printer: printers && printers.length > 0 ? printers[0].id : "receipt",
        type: "html",
        html: htmlPayload,
      });

      addLog(`Step 6: Job dispatched successfully. Response from printerClient: ${JSON.stringify(response)}`);
      alert("Printing initiated successfully via v2 architecture!");
    } catch (e) {
      addLog(`Step X: Failed during print process. Error details: ${e instanceof Error ? e.message : String(e)}`);
      alert("Failed to connect to local printer bridge or print. Make sure the bridge is running!");
    } finally {
      addLog("Step 7: Cleaning up state (printing = false)...");
      setPrinting(false);
      addLog("Step 8: Print process completed.");
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-100 py-10 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Thermal Print Bill Template
      </h1>

      <div className="flex flex-col md:flex-row justify-center max-w-6xl mx-auto w-full gap-8 px-4 items-start">
        {/* Left Side: Bill & Button */}
        <div className="flex flex-col items-center w-full md:w-auto">
          <div className="shadow-2xl bg-white border border-gray-200 mb-6">
            <ThermalReceipt />
          </div>
          <button
            onClick={handlePrint}
            disabled={printing}
            className="px-6 py-3 bg-black text-white font-semibold rounded shadow-md hover:bg-gray-800 transition-colors disabled:opacity-50 w-full max-w-[320px]"
          >
            {printing ? "Printing..." : "Print Receipt (node-print)"}
          </button>
        </div>

        {/* Right Side: Log Console */}
        <div className="flex-1 bg-gray-900 text-green-400 p-4 rounded-lg shadow-inner overflow-y-auto h-[600px] font-mono text-sm w-full md:max-w-2xl">
          <h2 className="text-white mb-4 font-bold border-b border-gray-700 pb-2 flex justify-between items-center">
            <span>Process Logs</span>
            {logs.length > 0 && (
              <button 
                onClick={() => setLogs([])}
                className="text-xs text-gray-400 hover:text-white px-2 py-1 bg-gray-800 rounded"
              >
                Clear
              </button>
            )}
          </h2>
          {logs.length === 0 && <p className="text-gray-500 italic">Waiting for print action...</p>}
          <div className="flex flex-col gap-2">
            {logs.map((log, index) => (
              <div key={index} className="break-all">{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
