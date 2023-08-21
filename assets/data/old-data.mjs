import XLSX from 'xlsx';

// Load the Excel file
const workbook = XLSX.readFile('./Book1.xlsx');

// Choose the sheet you want to work with (assuming it's the first sheet)
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Convert the sheet data into JSON format
const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

// Extract headers (column names) from the first row of the sheet
const headers = jsonData[0];

// Transform the data into an array of objects
const dataArray = [];
for (let i = 1; i < jsonData.length; i++) {
  const rowData = {};
  for (let j = 1; j < headers.length; j++) { // Start from 1 to skip the first 'undefined' column
    rowData[headers[j]] = jsonData[i][j];
  }
  dataArray.push(rowData);
}

// Now dataArray contains the desired array of objects:
// [{ 'WEATHER': "'sunny'", 'AIR POLLUTION': 1, ... }, ...]
console.log(dataArray);

const rowIndex = 0; // Index of the row (0-based)
const columnIndex = 0; // Index of the column (0-based)

if (dataArray.length > rowIndex) {
  const row = dataArray[rowIndex];
  const columnNames = Object.keys(row);

  if (columnNames.length > columnIndex) {
    const columnName = columnNames[columnIndex];
    const value = row[columnName];
    console.log(value);
  } else {
    console.log("Column index is out of bounds.");
  }
} else {
  console.log("Row index is out of bounds.");
}


if (dataArray.length > 0) {
  const firstRow = dataArray[0];
  const columnNames = Object.keys(firstRow);

  if (columnNames.length > columnIndex) {
    const columnName = columnNames[columnIndex];
    console.log(columnName);
  } else {
    console.log("Column index is out of bounds.");
  }
} else {
  console.log("No data available.");
}