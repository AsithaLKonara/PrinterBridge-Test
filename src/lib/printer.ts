import { NodePrintClient } from '@asithakonara/node-print-client';

export const printerClient = new NodePrintClient({
  url: 'http://127.0.0.1:18181', // Assumes bridge is running on the POS terminal
});
