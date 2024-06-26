"use client"
import React, { useState, useEffect } from "react";
import ItemForm from "@/components/ItemForm"; 
import { Item, Inventory } from "@/utils/inventory"; 
import { getAllDocuments, addDocument, updateDocument } from "/src/utils/firebaseUtils.js"; 
import { db } from "../../../firebase.config"; 

export default function ManagementPage() {
  const [inventory, setInventory] = useState(new Inventory("School Supplies", []));
  const [editItemId, setEditItemId] = useState(null); 
  useEffect(() => {
    async function fetchData() {
      try {
        const documents = await getAllDocuments(db, "items");
        const itemInstances = documents.map((doc) => {
          const item = new Item(doc.name, doc.quantity);
          item.id = doc.id;
          return item;
        });
        setInventory(new Inventory("School Supplies", itemInstances));
      } catch (error) {
        console.log("Failed fetching data", error);
      }
    }

    fetchData();
  }, []);

  function handleAddItem(itemName) {
    const newItem = new Item(itemName, 1); 

    addDocument(db, "items", {
      name: newItem.name,
      quantity: newItem.quantity,
    });

    setInventory(prevInventory => {
      const newInventory = new Inventory(prevInventory.name, [...prevInventory.items, newItem]);
      return newInventory;
    });
  }

  function handleEditItem(item) {
    setEditItemId(item.id); 
  }

  async function handleSaveItem(updatedItem) {
    try {
      const itemObj = {
        name: updatedItem.name,
        quantity: updatedItem.quantity,
      };

      await updateDocument(db, "items", updatedItem.id, itemObj);

      setInventory(prevInventory => {
        const updatedItems = prevInventory.items.map(item => {
          if (item.id === updatedItem.id) {
            return updatedItem;
          }
          return item;
        });
        return new Inventory(prevInventory.name, updatedItems);
      });

      setEditItemId(null); 
    } catch (error) {
      console.error("Failed to update item", error);
    }
  }

  function cancelEdit() {
    setEditItemId(null); 
  }

  function deleteItem(name) {
    const updatedItems = inventory.items.filter(item => item.name !== name);
    setInventory(prevInventory => new Inventory(prevInventory.name, updatedItems));
  }

  function updateItemQuantity(name, newQuantity) {
    const updatedItems = inventory.items.map(item => {
      if (item.name === name) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setInventory(prevInventory => new Inventory(prevInventory.name, updatedItems));
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Manage School Supplies</h1>
      
      <ItemForm addItem={handleAddItem} />

      <ul>
        {inventory.items.map((item, index) => (
          <li key={index} className="mb-2 border-red-500 border-2 bg-blue-200 text-black font-bold rounded-lg p-2">
            {editItemId === item.id ? (
              
              <div className="flex items-center">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    setInventory(prevInventory => {
                      const updatedItems = prevInventory.items.map(existingItem => {
                        if (existingItem.id === item.id) {
                          return { ...existingItem, name: newName };
                        }
                        return existingItem;
                      });
                      return new Inventory(prevInventory.name, updatedItems);
                    });
                  }}
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const newQuantity = parseInt(e.target.value);
                    setInventory(prevInventory => {
                      const updatedItems = prevInventory.items.map(existingItem => {
                        if (existingItem.id === item.id) {
                          return { ...existingItem, quantity: newQuantity };
                        }
                        return existingItem;
                      });
                      return new Inventory(prevInventory.name, updatedItems);
                    });
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
                  onClick={() => updateItemQuantity(item.name, item.quantity + 1)}
                >
                  Increase
                </button>
                <button
                  className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
                  onClick={() => updateItemQuantity(item.name, item.quantity - 1)}
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
