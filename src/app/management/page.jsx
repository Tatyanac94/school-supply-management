"use client"

import React, { useState, useEffect } from "react";
import ItemFormComponent from "@/components/ItemForm";
import { Item, Inventory } from "@/utils/inventory";
import { getAllDocuments, addDocument, updateDocument, deleteDocument } from "@/utils/firebase.Utils";
import { db, auth } from "../../../firebase.config";

export default function ManagementPage() {
  const [inventory, setInventory] = useState(new Inventory("School Supplies", []));

  useEffect(() => {
    async function fetchData() {
      try {
        const documents = await getAllDocuments(db, "items");
        const setItems = documents.map((doc) => {
          const item = new Item(
            doc.name,
            doc.quantity
          );
          item.id = doc.id;
          return item;
        });
        setInventory(prevInventory => ({
          ...prevInventory,
          items: setItems
        }));
      } catch (error) {
        console.log("Error fetching data", error);
      }
    }

    fetchData();
    return () => {
      console.log("get all docs cleanup");
    };
  }, []);

  function handleAddItem(event) {
    event.preventDefault();

    const newItem = new Item(
      event.target.name.value,
      parseInt(event.target.quantity.value)
    );

    addDocument(db, "items", {
      name: newItem.name,
      quantity: newItem.quantity
    }).then(() => {
      const newItems = [...inventory.items, newItem];
      setInventory(prevInventory => ({
        ...prevInventory,
        items: newItems
      }));
      console.log("Added item");
    }).catch(error => {
      console.error("Error adding item:", error);
    });

    event.target.reset(); 
  }

  async function updateItem(itemToUpdate) {
    console.log("UPDATED ITEM FROM INVENTORY", itemToUpdate);

    const itemObj = {
      name: itemToUpdate.name,
      quantity: itemToUpdate.quantity,
    };

    await updateDocument(db, "items", itemToUpdate.id, itemObj);

    const newItems = inventory.items.map((item) =>
      item.id === itemToUpdate.id ? itemToUpdate : item
    );

    setInventory(prevInventory => ({
      ...prevInventory,
      items: newItems
    }));
  }

  async function deleteItem(id) {
    try {
      await deleteDocument(db, "items", id);
      const newItems = inventory.items.filter((item) => item.id !== id);
      setInventory(prevInventory => ({
        ...prevInventory,
        items: newItems
      }));
      console.log(`Item with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  }
  

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center">Manage School Supplies</h1>

      <form
        onSubmit={handleAddItem}
        className="mb-2 border-red-500 border-2 bg-blue-300 text-black font-bold rounded-lg p-2"
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
        <h2 className="text-xl font-bold mb-2 divide-y divide-gray-200 underline">Items:</h2>
        {inventory.items.map((item, index) => (
          <ItemFormComponent
            id={item.id}
            key={index}
            name={item.name}
            quantity={item.quantity}
            updateItem={updateItem}
            deleteItem={deleteItem}
            isManagementPage={true}
          />
        ))}
      </div>
    </div>
  );
}
