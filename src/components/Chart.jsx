import React from 'react';

function Chart() {
  // Mock data for the chart
  const data = [
    { label: 'Jan', value: 65 },
    { label: 'Feb', value: 78 },
    { label: 'Mar', value: 90 },
    { label: 'Apr', value: 81 },
    { label: 'May', value: 95 },
    { label: 'Jun', value: 88 }
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="chart-wrapper">
      <h3 className="chart-title">Monthly Statistics</h3>
      <div className="chart-container">
        <div className="chart-bars">
          {data.map((item, index) => (
            <div key={index} className="chart-bar-group">
              <div className="chart-bar-container">
                <div 
                  className="chart-bar" 
                  style={{ height: `${(item.value / maxValue) * 100}%` }}
                >
                  <span className="chart-value">{item.value}</span>
                </div>
              </div>
              <div className="chart-label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Chart;