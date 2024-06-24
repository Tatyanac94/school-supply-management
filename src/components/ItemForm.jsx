import React, { useState } from 'react';

const ItemForm = ({ addItem }) => {
  const [itemName, setItemName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (itemName.trim()) {
      addItem(itemName);
      setItemName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        placeholder="Enter item name"
        className="px-3 py-2 border border-gray-300 rounded mr-2 text-black"
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Add Item
      </button>
    </form>
  );
};

export default ItemForm;
