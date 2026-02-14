import React from 'react';

function Table({ title = "Data Table", rows = 3, cols = 3 }) {
  // Generate table data
  const tableData = Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: cols }, (_, colIndex) => 
      rowIndex === 0 
        ? `Header ${colIndex + 1}` 
        : `Cell ${rowIndex}-${colIndex + 1}`
    )
  );

  return (
    <div className="table-wrapper">
      <h3 className="table-title">{title}</h3>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {tableData[0].map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;