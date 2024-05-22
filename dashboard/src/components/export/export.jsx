import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

function ExcelDataGrid() {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      
      const columnsData = excelData[0].map((name, index) => ({ field: `field${index}`, headerName: name }));
      const rowsData = excelData.slice(1).map((row, index) => ({ id: index, ...row.reduce((acc, cur, index) => ({ ...acc, [`field${index}`]: cur }), {}) }));
      
      setColumns(columnsData);
      setRows(rowsData);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleExportCSV = () => {
    const csvContent = [
      columns.map(column => column.headerName).join(','), // Headers
      ...rows.map(row => columns.map(column => row[column.field]).join(',')) // Rows
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const fileName = 'export.csv';
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, fileName);
    } else {
      const a = document.createElement('a');
      const url = URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
      <div style={{ marginBottom: '10px' }}>
        <button onClick={handleExportCSV}>Export to CSV</button>
      </div>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
        />
      </div>
    </div>
  );
}

export default ExcelDataGrid;
