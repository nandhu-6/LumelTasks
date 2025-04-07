import React, { useState, useEffect } from "react";
import arrayInput from "./arrayInput";
import "./index.css";

function App() {
  const [rows, setRows] = useState(arrayInput.rows);
  const [input, setInput] = useState({});

  const handleInputChange = (id, value) => {
    setInput((prevData) => ({ ...prevData, [id]: value }));
  };

  const calculateVariance = (newValue, oldValue) => {
    return (((newValue - oldValue) / oldValue) * 100).toFixed(2);
  };

  const updateRowData = (id, isPercentage) => {
    let updatedRows = [...rows]; //copy of entire rows state
    const updatedRow = updateSingleRow(updatedRows, id, isPercentage);
    setRows(updatedRow);
  };

  const updateSingleRow = (rows, id, isPercentage) => {
    return rows.map((row) => { //maps all row one by one
      const oldValue = row.value;

      if (row.id == id) { //if row is a direct match
        if (isPercentage) {
          row.value += row.value * (input[id] / 100); //calculates percentage
          if (row.children) { //if any child is present
            row.children = row.children.map((child) => { //traverse each child and calculate child variance
              let childOldValue = child.value;
              child.value += child.value * (input[id] / 100);
              child.variance = calculateVariance(child.value, childOldValue);
              return child;
            });
          }
        } else { //if set value
          let oldRowValue = row.value;
          row.value = Number(input[id]);

          if (row.children) {
            row.children = row.children.map((child) => {
              let oldChildValue = child.value;
              let proportion = oldChildValue / oldRowValue;
              child.value = Number((row.value * proportion).toFixed(2));
              child.variance = calculateVariance(child.value, oldChildValue);
              return child;
            });
          }
        }
        row.variance = calculateVariance(row.value, oldValue);
      }
      else if (row.children) { //row is not a direct match, but has a child
        let updatedChildren = updateSingleRow(row.children, id, isPercentage);
        let newChildrenValue = updatedChildren.reduce((total, child) => total + Number(child.value), 0); //calculates sum of children after child value being modified

        if (newChildrenValue !== oldValue) {
          row.value = newChildrenValue;
          row.variance = calculateVariance(row.value, oldValue);
        }

        row.children = updatedChildren;
      }

      return row;
    });
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <table className="border-collapse border border-gray-400 bg-white shadow-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 px-4 py-2">Label</th>
            <th className="border border-gray-400 px-4 py-2">Value</th>
            <th className="border border-gray-400 px-4 py-2">Input</th>
            <th className="border border-gray-400 px-4 py-2">Allocate in %</th>
            <th className="border border-gray-400 px-4 py-2">Allocate in Value</th>
            <th className="border border-gray-400 px-4 py-2">Variance %</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <React.Fragment key={row.id}>
              <tr>
                <td className="border border-gray-400 px-4 py-2 font-bold">{row.label}</td>
                <td className="border border-gray-400 px-4 py-2">{row.value}</td>
                <td className="border border-gray-400 px-4 py-2">
                  <input
                    type="number"
                    className="border p-1 text-center"
                    onChange={(e) => handleInputChange(row.id, e.target.value)}
                  />
                </td>
                <td className="border border-gray-400 px-4 py-2 text-center">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-blue-400"
                    onClick={() => updateRowData(row.id, true)}
                  >
                    Add %
                  </button>
                </td>
                <td className="border border-gray-400 px-4 py-2 text-center">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-blue-400"
                    onClick={() => updateRowData(row.id, false)}
                  >
                    Set value
                  </button>
                </td>
                <td className="border border-gray-400 px-4 py-2 text-center">
                  {row.variance ? `${row.variance}%` : "0%"}

                </td>
              </tr>
              {/* Render children */}
              {row.children &&
                row.children.map((child) => (
                  <tr key={child.id}>
                    <td className="border border-gray-400 px-4 py-2">
                    ➥ {child.label}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {child.value}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      <input
                        type="number"
                        className="border p-1 text-center"
                        onChange={(e) => handleInputChange(child.id, e.target.value)}
                      />
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-center">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-blue-400"
                        onClick={() => updateRowData(child.id, true)}
                      >
                        Add %
                      </button>
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-center">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-blue-400"
                        onClick={() => updateRowData(child.id, false)}
                      >
                        Set value
                      </button>
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-center">
                      {child.variance ? `${child.variance}%` : "0%"}

                    </td>
                  </tr>
                ))}
            </React.Fragment>
          ))}
          <tr>
            <td className="border border-gray-400 px-4 py-2 text-center font-bold">Total</td>
            <td className="border border-gray-400 px-4 py-2 text-center"> {rows.reduce((acc, row) => acc + row.value, 0)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;
