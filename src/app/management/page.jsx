"use client"
import React, { useState, useEffect } from "react";
import ItemFormComponent from "@/components/ItemForm";
import { Item, Inventory } from "@/utils/inventory";
import { getAllDocuments, addDocument, updateDocument, deleteDocument } from "/src/utils/firebaseUtils.js"; 
import { db } from "../../../firebase.config";

const LOCAL_STORAGE_KEY = "school_inventory";

export default function ManagementPage() {
  const [inventory, setInventory] = useState(() => {
    const storedInventory = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedInventory ? JSON.parse(storedInventory) : new Inventory("School Supplies", []);
  });

  const [editItemId, setEditItemId] = useState(null); 

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
  function handleAddItem(event) {
    event.preventDefault(); 

    const itemName = event.target.name.value;
    const itemQuantity = parseInt(event.target.quantity.value);

    const newItem = new Item(itemName, itemQuantity);

    addDocument(db, "items", {
      name: newItem.name,
      quantity: newItem.quantity,
    });

    setInventory(prevInventory => {
      const newInventory = new Inventory(prevInventory.name, [...prevInventory.items, newItem]);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newInventory));
      return newInventory;
    });

    event.target.reset();
  }

  function deleteItem(itemName) {
    const updatedItems = inventory.items.filter(item => item.name !== itemName);

    setInventory(prevInventory => {
      const newInventory = new Inventory(prevInventory.name, updatedItems);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newInventory));
      return newInventory;
    });

    deleteDocument(db, "items", itemName)
      .then(() => {
       
      })
      .catch(error => {
        console.error("Failed to delete item:", error);
        
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

  function handleEditItem(item) {
    setEditItemId(item.id); 
  }

  function handleSaveItem(updatedItem) {
    const updatedItems = inventory.items.map(item => {
      if (item.id === updatedItem.id) {
        return updatedItem; 
      }
      return item; 
    });
  
    setInventory(prevInventory => {
      const newInventory = new Inventory(prevInventory.name, updatedItems);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newInventory));
      return newInventory;
    });
  
    setEditItemId(null);
  }
  

  function cancelEdit() {
    setEditItemId(null);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center">Manage School Supplies</h1>

      <form
        onSubmit={handleAddItem}
        className="mb-2 border-red-500 border-2 bg-blue-200 text-black font-bold rounded-lg p-2"
      >
        <h2 className="mb-2 text-2xl">Add an Item</h2>
        <div>
          <input
            className="w-1/4 p-1 border rounded border-red-500 text-black"
            placeholder="Name"
            type="text"
            name="name"
            id="name-input"
            required
          />
          <input
            className="w-1/4 p-1 border rounded border-red-500 text-black"
            placeholder="Quantity"
            type="number"
            name="quantity"
            min={0}
            required
          />
        </div>
        <button
          className="p-2 my-4 border rounded border-red-500 hover:bg-red-600 text-black"
          type="submit"
        >
          Submit
        </button>
      </form>

      {inventory.items.map((item, index) => (
        <ItemFormComponent
          key={item.id}
          id={item.id}
          name={item.name}
          quantity={item.quantity}
          updateItem={updateItemQuantity}
          deleteItem={deleteItem}
          isManagementPage={true}
          onSave={handleSaveItem}
          onCancel={cancelEdit}
        />
      ))}
    </div>
  );
}
