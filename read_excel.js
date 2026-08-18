const XLSX = require('xlsx');
const wb = XLSX.readFile('Sokrio custom report July2026_Workplan .xlsx');

// Read all rows from sheet 1
const ws1 = wb.Sheets[wb.SheetNames[0]];
const data1 = XLSX.utils.sheet_to_json(ws1, {header: 1});
console.log('=== Sheet: ' + wb.SheetNames[0] + ' ===');
console.log('Total rows:', data1.length);
data1.forEach((row, i) => {
  console.log('Row ' + i + ': ' + JSON.stringify(row));
});

console.log('\n\n');

// Read all rows from sheet 2
const ws2 = wb.Sheets[wb.SheetNames[1]];
const data2 = XLSX.utils.sheet_to_json(ws2, {header: 1});
console.log('=== Sheet: ' + wb.SheetNames[1] + ' ===');
console.log('Total rows:', data2.length);
data2.forEach((row, i) => {
  console.log('Row ' + i + ': ' + JSON.stringify(row));
});
