"use client"
import React, { useState, useEffect } from "react";
import ItemFormComponent from "/src/components/ItemForm";
import { Item, Inventory } from "/src/utils/inventory";
import {
  db,
  getCollection,
  addToCollection,
  removeFromCollection,
  updateCollectionItem,
} from "../../../firebase.config";

export default function ManagementPage() {
  const [inventory, setInventory] = useState(new Inventory("School Supplies", []));

  useEffect(() => {
    async function fetchData() {
      try {
        const itemsCollection = await getCollection(db, "Items");
        const newItems = itemsCollection.map((doc) => {
          return new Item(doc.data.name, doc.data.quantity, doc.id);
        });

        setInventory(new Inventory(inventory.name, newItems));
      } catch (error) {
        console.log("Failed fetching data", error);
      }
    }

    fetchData();
    return () => {
      console.log("Cleanup");
    };
  }, []);

  async function handleAddItem(event) {
    event.preventDefault();

    const itemName = event.target.name.value;
    const itemQuantity = parseInt(event.target.quantity.value);

    const addedItem = {
      name: itemName,
      quantity: itemQuantity,
    };

    try {
      const itemID = await addToCollection(db, "Items", addedItem);
      const newItem = new Item(itemName, itemQuantity, itemID);

      const newInventory = new Inventory(inventory.name, [...inventory.items, newItem]);
      setInventory(newInventory);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  }

  async function deleteItem(itemID) {
    try {
      await removeFromCollection(db, "Items", itemID);

      const newInventoryItems = inventory.items.filter((item) => item.id !== itemID);
      const newInventory = new Inventory(inventory.name, newInventoryItems);
      setInventory(newInventory);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }

  async function updateItem(itemToUpdate) {
    try {
      const newItems = inventory.items.map((item) =>
        itemToUpdate.id === item.id ? itemToUpdate : item
      );

      const newInventory = new Inventory(inventory.name, newItems);
      setInventory(newInventory);

      await updateCollectionItem(db, "Items", itemToUpdate, itemToUpdate.id);
    } catch (error) {
      console.error("Error updating item:", error);
    }
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
