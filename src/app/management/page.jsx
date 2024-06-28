"use client"
import React, { useState, useEffect } from "react";
import ItemForm from "@/components/ItemForm";
import { Item, Inventory } from "@/utils/inventory";
import { getAllDocuments, addDocument, updateDocument, deleteDocument } from "/src/utils/firebaseUtils.js";
import { db } from "../../../firebase.config";

const LOCAL_STORAGE_KEY = "school_inventory";

export default function ManagementPage() {
  const [inventory, setInventory] = useState(() => {
    const storedInventory = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedInventory ? JSON.parse(storedInventory) : new Inventory("School Supplies", []);
  });

  const [editItemId, setEditItemId] = useState(null); // State to track the item being edited

  useEffect(() => {
    async function fetchData() {
      try {
        const documents = await getAllDocuments(db, "items");
        const itemInstances = documents.map(doc => {
          const item = new Item(doc.name, doc.quantity);
          item.id = doc.id;
          return item;
        });
        const newInventory = new Inventory("School Supplies", itemInstances);
        setInventory(newInventory);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newInventory));
      } catch (error) {
        console.log("Failed fetching data", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(inventory));
  }, [inventory]);

  function handleAddItem(itemName) {
    const newItem = new Item(itemName, 1);

    addDocument(db, "items", {
      name: newItem.name,
      quantity: newItem.quantity,
    });

    setInventory(prevInventory => {
      const newInventory = new Inventory(prevInventory.name, [...prevInventory.items, newItem]);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newInventory));
      return newInventory;
    });
  }

  function deleteItem(itemName) {
    const updatedItems = inventory.items.filter(item => item.name !== itemName);

    setInventory(prevInventory => {
      const newInventory = new Inventory(prevInventory.name, updatedItems);
      return newInventory;
    });

    const updatedInventory = new Inventory(inventory.name, updatedItems);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedInventory));

    deleteDocument(db, "items", itemName)
      .then(() => {
        // Optionally handle success if needed
      })
      .catch(error => {
        console.error("Failed to delete item:", error);
        // Optionally handle error
      });
  }

  function updateItemQuantity(itemName, newQuantity) {
    const updatedItems = inventory.items.map(item => {
      if (item.name === itemName) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setInventory(prevInventory => {
      const newInventory = new Inventory(prevInventory.name, updatedItems);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newInventory));
      return newInventory;
    });

    updateDocument(db, "items", itemName, { quantity: newQuantity });
  }

  function increaseItemQuantity(itemName, amount = 1) {
    const item = inventory.items.find(item => item.name === itemName);
    if (item) {
      const newQuantity = item.quantity + amount;
      updateItemQuantity(itemName, newQuantity);
    }
  }

  function decreaseItemQuantity(itemName, amount = 1) {
    const item = inventory.items.find(item => item.name === itemName);
    if (item) {
      const newQuantity = item.quantity - amount;
      updateItemQuantity(itemName, newQuantity);
    }
  }

  function handleEditItem(item) {
    setEditItemId(item.id); // Set the id of the item being edited
  }

  function handleSaveItem(updatedItem) {
    const updatedItems = inventory.items.map(item => {
      if (item.id === updatedItem.id) {
        return updatedItem; // Update the item with new details
      }
      return item;
    });

    setInventory(prevInventory => {
      const newInventory = new Inventory(prevInventory.name, updatedItems);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newInventory));
      return newInventory;
    });

    setEditItemId(null); // Exit edit mode
  }

  function cancelEdit() {
    setEditItemId(null); // Exit edit mode
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Manage School Supplies</h1>
      
      <ItemForm addItem={handleAddItem} />

      <ul>
        {inventory.items.map(item => (
          <li key={item.id} className="mb-2 border-red-500 border-2 bg-blue-200 text-black font-bold rounded-lg p-2">
            {editItemId === item.id ? (
              <div className="flex items-center">
                <input
                  type="text"
                  value={item.name}
                  onChange={e => {
                    const newName = e.target.value;
                    const updatedItem = { ...item, name: newName };
                    handleSaveItem(updatedItem); // Save the updated item
                  }}
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={e => {
                    const newQuantity = parseInt(e.target.value);
                    updateItemQuantity(item.name, newQuantity);
                  }}
                />
                <button
                  className="ml-2 px-4 py-2 bg-green-500 text-white rounded"
                  onClick={() => handleSaveItem(item)}
                >
                  Save
                </button>
                <button
                  className="ml-2 px-4 py-2 bg-red-500 text-white rounded"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                {item.name}: {item.quantity}
                <button
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => deleteItem(item.name)}
                >
                  Delete
                </button>
                <button
                  className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
                  onClick={() => increaseItemQuantity(item.name)}
                >
                  Increase
                </button>
                <button
                  className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
                  onClick={() => decreaseItemQuantity(item.name)}
                >
                  Decrease
                </button>
                <button
                  className="ml-2 px-2 py-1 bg-green-500 text-white rounded"
                  onClick={() => handleEditItem(item)}
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
}
