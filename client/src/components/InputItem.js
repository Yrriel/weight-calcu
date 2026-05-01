import React, { useState, useEffect } from "react";
import Select from "react-select"; // 1. Import react-select

const MultiItemSelector = () => {
  const [items, setItems] = useState([]);
  
  const [rows, setRows] = useState([
    { id: Date.now(), selectedItem: '', selectedVariantId: null, weight: 0, qty: 1 }
  ]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/items");
        const jsonData = await response.json();
        setItems(jsonData);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchItems();
  }, []);

  const addRow = () => {
    setRows([
      ...rows,
      { id: Date.now(), selectedItem: '', selectedVariantId: null, weight: 0, qty: 1 }
    ]);
  };

  const removeRow = (id) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const handleRowChange = async (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    if (field === 'selectedItem') {
      updatedRows[index].selectedVariantId = null;
      updatedRows[index].weight = 0;
    }

    if (field === 'selectedVariantId') {
      const selectedVariant = items.find(
        variant => String(variant.item_id) === String(value)
      );

      updatedRows[index].weight = selectedVariant ? Number(selectedVariant.item_weight) : 0;
    }

    setRows(updatedRows);
  };

  const grandTotal = rows.reduce((acc, row) => acc + (row.weight * row.qty), 0);

  // Pre-format the first dropdown's options
  const itemOptions = [...new Set(items.map(item => item.item_name))]
    .map(name => ({ value: name, label: name }));

  return (
    <div style={{ padding: "20px" }}>
      <h2>Multi-Item Weight Calculator</h2>
      
      {rows.map((row, index) => {
        // Format the second dropdown's options dynamically per row
        const variantOptions = items
          .filter(item => item.item_name === row.selectedItem)
          .map(item => ({
            value: item.item_id,
            label: `${item.item_variation} (${item.item_weight}g)`
          }));

        // Find the current selected variant to display the correct label
        const selectedVariantOption = variantOptions.find(
          opt => String(opt.value) === String(row.selectedVariantId)
        ) || null;

        return (
          <div 
            key={row.id} 
            style={{ 
              display: "flex", // Added flexbox to keep items in a nice row
              alignItems: "center", 
              gap: "10px", 
              marginBottom: "15px", 
              borderBottom: "1px solid #ccc", 
              paddingBottom: "10px" 
            }}
          >
            {/* 1st Dropdown */}
            <div style={{ width: "400px" }}>
              <Select 
                options={itemOptions}
                value={row.selectedItem ? { value: row.selectedItem, label: row.selectedItem } : null}
                onChange={(selectedOption) => handleRowChange(index, 'selectedItem', selectedOption ? selectedOption.value : '')}
                placeholder="Select Item"
                isClearable // Allows the user to clear the selection
              />
            </div>

            {/* 2nd Dropdown */}
            <div style={{ width: "250px" }}>
              <Select
                isDisabled={!row.selectedItem}
                options={variantOptions}
                value={selectedVariantOption}
                onChange={(selectedOption) => handleRowChange(index, 'selectedVariantId', selectedOption ? selectedOption.value : null)}
                placeholder="Select Variation"
                isClearable
              />
            </div>

            {/* Quantity */}
            <input 
              type="number" 
              min="1"
              value={row.qty}
              onChange={(e) => handleRowChange(index, 'qty', Number(e.target.value))}
              className="form-control" // Added slight padding to match Select height
              style={{ width: "100px" }}
            />

            <button onClick={() => removeRow(row.id)} className="btn btn-danger">
              Remove
            </button>
            
            <span style={{ fontWeight: "bold" }}>
              Subtotal: {row.weight * row.qty}g
            </span>
          </div>
        );
      })}

      <button onClick={addRow} className="btn btn-primary">
        + Add Another Item
      </button>

      <div style={{ marginTop: "30px", borderTop: "2px solid black", paddingTop: "10px" }}>
        <h3>Grand Total Weight: {grandTotal} g</h3>
      </div>
    </div>
  );
};

export default MultiItemSelector;
