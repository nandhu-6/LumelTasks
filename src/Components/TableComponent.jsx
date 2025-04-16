import React, { useState } from "react";
import Row from "./Row";
import arrayInput from "../arrayInput";

// Deep copy with originalValue
// to add original value to each node and its children
const cloneTree = (nodes) => {
  return nodes.map((node) => ({
    ...node,
    originalValue: node.value,
    children: node.children ? cloneTree(node.children) : undefined,
  }));
};

const TableComponent = () => {
  const [data, setData] = useState(cloneTree(arrayInput.rows));

  const updateTree = (nodes, id, newVal) => {
    return nodes.map((node) => {
      if (node.id === id) { //if its a parent node
        if (node.children) {
          const total = node.children.reduce((sum, c) => sum + c.value, 0);
          const updatedChildren = node.children.map((child) => {
            const ratio = child.value / total;
            return {
              ...child,
              value: parseFloat((newVal * ratio).toFixed(4)),
            };
          });
          const newTotal = updatedChildren.reduce((sum, c) => sum + c.value, 0);
          return {
            ...node,
            value: parseFloat(newTotal.toFixed(4)),
            children: updatedChildren,
          };
        } else {
          return {
            ...node,
            value: parseFloat(newVal.toFixed(4)),
          };
        }
      } else if (node.children) {
        const updatedChildren = updateTree(node.children, id, newVal);
        const newTotal = updatedChildren.reduce((sum, c) => sum + c.value, 0);
        return {
          ...node,
          children: updatedChildren,
          value: parseFloat(newTotal.toFixed(2)),
        };
      }
      return node;
    });
  };

  const handleUpdate = (id, newValue) => {
    setData((prev) => updateTree(prev, id, newValue));
  };

  const renderRows = (nodes, depth = 0) => {
    return nodes.flatMap((node) => [
      <Row
        key={node.id}
        label={node.label}
        value={node.value}
        originalValue={node.originalValue}
        depth={depth}
        onUpdate={(newVal) => handleUpdate(node.id, newVal)}
      />,
      ...(node.children ? renderRows(node.children, depth + 1) : []),
      //if row has children call renderrows recursively with depth + 1 for children
    ]);
  };

  const grandTotal = data.reduce((sum, node) => sum + node.value, 0);

  return (
    <table className="border-collapse border border-gray-400 bg-white shadow-lg">
      <thead>
        <tr className="bg-gray-200">
          <th className="border border-gray-400 px-4 py-2">Label</th>
          <th className="border border-gray-400 px-4 py-2">Value</th>
          <th className="border border-gray-400 px-4 py-2">Input</th>
          <th className="border border-gray-400 px-4 py-2">Add %</th>
          <th className="border border-gray-400 px-4 py-2">Set Value</th>
          <th className="border border-gray-400 px-4 py-2">Variance %</th>
        </tr>
      </thead>
      <tbody>
        {renderRows(data)}
        <tr>
          <td className="border border-gray-400 px-4 py-2"><strong>Grand Total</strong></td>
          <td className="border border-gray-400 px-4 py-2 text-center"><strong>{grandTotal.toFixed(2)}</strong></td>
          <td colSpan={4}></td>
        </tr>
      </tbody>
    </table>
  );
};

export default TableComponent;




//with map :  [  [<Row for Electronics />, [<Row for Phones />, <Row for Laptops />]]  ]

// with flatmap : [
//     <Row for Electronics />,
//     <Row for Phones />,
//     <Row for Laptops />
//   ]

//flattened : 
{/* 
<Row label="Electronics" depth=0 />
<Row label="Phones" depth=1 />
<Row label="Laptops" depth=1 />
<Row label="Furniture" depth=0 />
<Row label="Tables" depth=1 />
<Row label="Chairs" depth=1 /> */}

  
  