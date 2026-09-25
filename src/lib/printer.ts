import { NodePrintClient } from '@asithakonara/node-print-client';

console.log("[Test App] Initializing NodePrintClient with bridge url: http://127.0.0.1:18181...");
export const printerClient = new NodePrintClient({
  url: 'http://127.0.0.1:18181', // Assumes bridge is running on the POS terminal
});
console.log("[Test App] NodePrintClient initialized successfully.");
