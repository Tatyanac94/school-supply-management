"use client"
import React, { useState, useEffect } from "react";
import ItemFormComponent from "@/components/ItemForm";
import { Item, Inventory } from "/src/utils/inventory";
import {
  db,
  getCollection,
  addToCollection,
  removeFromCollection,
  updateCollectionItem,
} from "../../../firebase.config";


// const ItemFormComponent = dynamic(() => import("/src/components/ItemForm"), { ssr: false });

export default function ManagementPage() {
  const [inventory, setInventory] = useState(
    new Inventory("School Supplies", []));

  useEffect(() => {
    async function fetchData() {
      try {
        const itemsCollection = await getCollection(db, "Items");
        const newItems = itemsCollection.map((doc) => {
          return new Item(doc.data.name, 
            doc.data.quantity, 
            doc.id
          );
        });

        setInventory(new Inventory(inventory.name, newItems));
      } catch (error) {
        console.log("Failed fetching data", error);
      }
    }

    fetchData();
		return () => {
			console.log("get all docs cleanup");
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

  async function handleAddItem(event) {
    event.preventDefault();

    const name = event.target.name.value;
    const quantity = parseInt(event.target.quantity.value);
    const itemToAdd = {
      name,
      quantity,
    };
    const itemID = addToCollection(db, "Items", itemToAdd);
    const newItem = new Item(
      name, 
      quantity, 
      itemID
    );
      const newInventory = new Inventory(inventory.name, inventory.items);
      newInventory.addItem(newItem);
      setInventory(newInventory);
      console.log("Added item:");
    }

   function deleteItem(itemID) {
      const newInventory = new Inventory(inventory.name, inventory.items);
      newInventory.deleteItem(itemID);
      removeFromCollection(db, "Items", itemID);
      setInventory(newInventory);
  }

   function updateItem(itemToUpdate) {
     const newItems = inventory.items.map((screen) => {
           return itemToUpdate.id === item.id ? itemToUpdate : item;
     });
     const newInventory = new Inventory(inventory.name, newItems);
     setInventory(newInventory);
     updateCollectionItem(db, "Items", itemToUpdate, itemToUpdate.id);
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
        {inventory.items.map((item, index) => (
          <ItemFormComponent
            key={index}
            name={item.name}
            quantity={item.quantity}
            updateItem={updateItem}
            deleteItem={() => deleteItem(item.id)}  
            id={item.id}
            isManagementPage={true}
          />
        ))}
      </div>
    </div>
  );
}