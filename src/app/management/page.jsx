'use client';
import React, { useState } from 'react';
import ItemForm from '/src/ItemForm';

const Management = () => {
  const initialItems = [
    { id: 1, name: 'Pencils' },
    { id: 2, name: 'Notebooks' },
    { id: 3, name: 'Erasers' },
  ];

  const [items, setItems] = useState(initialItems);
  const [editItemId, setEditItemId] = useState(null);
  const [editItemName, setEditItemName] = useState('');

  const addItem = (itemName) => {
    const newItem = {
      id: Math.max(...items.map(item => item.id), 0) + 1,
      name: itemName,
    };
    setItems([...items, newItem]);
  };

  const deleteItem = (itemId) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
  };

  const startEditing = (itemId, itemName) => {
    setEditItemId(itemId);
    setEditItemName(itemName);
  };

  const cancelEditing = () => {
    setEditItemId(null);
    setEditItemName('');
  };

  const saveEditedItem = () => {
    const updatedItems = items.map(item => {
      if (item.id === editItemId) {
        return { ...item, name: editItemName };
      }
      return item;
    });
    setItems(updatedItems);
    setEditItemId(null);
    setEditItemName('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Manage School Supplies</h1>
      <ItemForm addItem={addItem}/>
      <ul>
        {items.map(item => (
          <li key={item.id} className="mb-2 border-red-500 border-2 bg-blue-200 text-black font-bold rounded-lg p-2">
            {editItemId === item.id ? (
              <div className="flex items-center">
                <input
                  type="text"
                  value={editItemName}
                  onChange={(e) => setEditItemName(e.target.value)}
                  className="px-3 py-2 border border-gray-300 text-black rounded mr-2"
                />
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded mr-2"
                  onClick={saveEditedItem}
                >
                  Save
                </button>
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                  onClick={cancelEditing}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                {item.name}
                <button
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => deleteItem(item.id)}
                >
                  Delete
                </button>
                <button
                  className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
                  onClick={() => startEditing(item.id, item.name)}
                >
                  Edit
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Management;
