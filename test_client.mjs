import { NodePrintClient, escpos } from "@asithakonara/node-print-client";
console.log("escpos available?", typeof escpos);
const client = new NodePrintClient();
console.log("printers available?", typeof client.printers?.list);
