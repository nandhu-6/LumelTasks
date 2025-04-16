import React, { useState } from "react";

const Row = ({ label, value, originalValue, depth, onUpdate }) => {
  const [input, setInput] = useState("");

  const variance = originalValue === 0 ? 0 : ((value - originalValue) / originalValue) * 100;

  const handleClick = (isPercentage) => {
    const num = parseFloat(input);
    if (isNaN(num)) return;
    let newVal = value;
    if (isPercentage) {
      newVal = value + (value * num) / 100;
    } else {
      newVal = num;
    }
    onUpdate(newVal);
    setInput("");
  };

  return (
    <tr>
      <td className="border border-gray-400 px-4 py-2" style={{ paddingLeft: `${depth * 20 + 10}px` }}>{label}</td>
      <td className="border border-gray-400 px-4 py-2">{value.toFixed(2)}</td>
      <td className="border border-gray-400 px-4 py-2">
        <input className="border rounded" type="number" value={input} onChange={(e) => setInput(e.target.value)}/>
      </td>
      <td className="border border-gray-400 px-4 py-2">
        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-400" onClick={() => handleClick(true)}>Add %</button>
      </td>
      <td className="border border-gray-400 px-4 py-2">
        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-400" onClick={() => handleClick(false)}>Set Value</button>
      </td>
      <td className="border border-gray-400 px-4 py-2 text-center">{variance.toFixed(2)}%</td>
    </tr>
  );
};

export default Row;
