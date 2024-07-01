"use client"
import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';  // Import dynamic from next/dynamic for client-side components
import { Item, Inventory } from "/src/utils/inventory";
import {
  db,
  getCollection,
  addToCollection,
  removeFromCollection,
  updateCollectionItem,
} from "../../../firebase.config";

// Import ItemFormComponent dynamically for client-side rendering
const ItemFormComponent = dynamic(() => import("/src/components/ItemForm"), { ssr: false });

// Define ManagementPage component
export default function ManagementPage() {
  // Initialize state using useState hook
  const [inventory, setInventory] = useState(new Inventory("School Supplies", []));

  // Use useEffect hook to fetch data on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        const itemsCollection = await getCollection(db, "Items");
        const newItems = itemsCollection.map((doc) => {
          return new Item(doc.data.name, doc.data.quantity, doc.id);
        });

        // Set local state with fetched data
        setInventory(new Inventory("School Supplies", newItems));
      } catch (error) {
        console.log("Failed fetching data", error);
      }
    }

    fetchData();
  }, []);

  // Function to handle item addition
  async function handleAddItem(event) {
    event.preventDefault();

    const itemName = event.target.name.value;
    const itemQuantity = parseInt(event.target.quantity.value);

    const addedItem = {
      name: itemName,
      quantity: itemQuantity,
    };

    try {
      // Add item to Firestore
      const itemID = await addToCollection(db, "Items", addedItem);

      // Create new Item object
      const newItem = new Item(itemName, itemQuantity, itemID);

      // Update local state with new item
      const updatedItems = [...inventory.items, newItem];
      setInventory(new Inventory("School Supplies", updatedItems));
    } catch (error) {
      console.error("Error adding item:", error);
    }
  }

  // Function to delete an item
  async function deleteItem(itemID) {
    try {
      // Remove item from Firestore
      await removeFromCollection(db, "Items", itemID);

      // Filter out deleted item from local state
      const updatedItems = inventory.items.filter((item) => item.id !== itemID);
      setInventory(new Inventory("School Supplies", updatedItems));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }

  // Function to update an item
  async function updateItem(itemToUpdate) {
    try {
      // Update item in Firestore
      await updateCollectionItem(db, "Items", itemToUpdate, itemToUpdate.id);

      // Update local state with updated item
      const updatedItems = inventory.items.map((item) =>
        item.id === itemToUpdate.id ? itemToUpdate : item
      );
      setInventory(new Inventory("School Supplies", updatedItems));
    } catch (error) {
      console.error("Error updating item:", error);
    }
  }

  // Render component JSX
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

      <div className="items-list">
        <h2 className="text-xl font-bold mb-2 divide-y divide-gray-200">Items:</h2>
        {inventory.items.map((item) => (
          <ItemFormComponent
            key={item.id}
            name={item.name}
            quantity={item.quantity}
            updateItem={updateItem}
            deleteItem={() => deleteItem(item.id)}  // Pass item.id to deleteItem
            id={item.id}
            isManagementPage={true}
          />
        ))}
      </div>
    </div>
  );
}
