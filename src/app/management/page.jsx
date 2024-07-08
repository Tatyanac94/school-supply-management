"use client"
import React, { useState, useEffect } from "react";
import ItemFormComponent from "@/components/ItemForm";
import { Item, Inventory } from "@/utils/inventory";
import { getAllDocuments, addDocument, updateDocument, deleteDocument } from "@/utils/firebase.Utils";
import { db, auth } from "../../../firebase.config";
import AddAuthItemForm from "@/components/addAuthItemForm";
import RegisterForm from "@/components/registerForm";
import LoginForm from "@/components/loginForm";
import LogoutButton from "@/components/logoutButton";

export default function ManagementPage() {
  const [inventory, setInventory] = useState(new Inventory("School Supplies", []));
  
  useEffect(() => {
    async function fetchData() {
      try {
        const documents = await getAllDocuments(db, "items");
        const items = documents.map(doc => ({
          id: doc.id,
          name: doc.name,
          quantity: doc.quantity
        }));
        setInventory(prevInventory => ({
          ...prevInventory,
          items: items
        }));
      } catch (error) {
        console.log("Error fetching data", error);
      }
    }

    fetchData();
    return () => {
      console.log("Cleanup: Removing listeners or subscriptions if any.");
    };
  }, []);

  const handleAddItem = async (event) => {
    event.preventDefault();

    const newItem = new Item(
      event.target.name.value,
      parseInt(event.target.quantity.value)
    );

    try {
      await addDocument(db, "items", {
        name: newItem.name,
        quantity: newItem.quantity
      });
      setInventory(prevInventory => ({
        ...prevInventory,
        items: [...prevInventory.items, newItem]
      }));
      console.log("Added item successfully");
      event.target.reset();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const updateItem = async (itemToUpdate) => {
    try {
      await updateDocument(db, "items", itemToUpdate.id, {
        name: itemToUpdate.name,
        quantity: itemToUpdate.quantity
      });
      const updatedItems = inventory.items.map(item =>
        item.id === itemToUpdate.id ? itemToUpdate : item
      );
      setInventory(prevInventory => ({
        ...prevInventory,
        items: updatedItems
      }));
      console.log("Item updated successfully:", itemToUpdate);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await deleteDocument(db, "items", id);
      const filteredItems = inventory.items.filter(item => item.id !== id);
      setInventory(prevInventory => ({
        ...prevInventory,
        items: filteredItems
      }));
      console.log(`Item with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const scrollToLoginForm = () => {
    document
      .getElementById("login-form")
      .scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center">Manage School Supplies</h1>

      {!auth.currentUser ? (
        <>
          <RegisterForm />
          <p className="text-center bg-blue-50 text-blue-500 hover:text-blue-600">
            Already registered?
            <button
              onClick={scrollToLoginForm}
              className="text-blue-500 hover:text-blue-600"
            >
              &nbsp;Login here
            </button>
          </p>
          <LoginForm />
        </>
      ) : (
        <>
          <div className="my-2 text-center">
            <LogoutButton />
          </div>

          <div className="items-list">
            <h2 className="text-xl font-bold mb-2 divide-y divide-gray-200 underline">Items:</h2>
            <AddAuthItemForm handleAddItem={handleAddItem} />
            {inventory.items.map((item, index) => (
              <ItemFormComponent
                key={index}
                id={item.id}
                name={item.name}
                quantity={item.quantity}
                updateItem={updateItem}
                deleteItem={deleteItem}
                isManagementPage={true}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
