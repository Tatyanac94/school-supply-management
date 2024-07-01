"use client";
import React, { useState } from "react";
import { Item } from "@/utils/inventory";

export default function ItemFormComponent({
  id,
  name,
  quantity,
  updateItem,
  deleteItem,
  isManagementPage,
  onSave,
  onCancel,
}) {
  const [isEditing, setIsEditing] = useState(false);

  const [updatedItem, setUpdatedItem] = useState({
    id,
    name,
    quantity,
    updateItem,
    deleteItem,
    onSave,
    onCancel
  });

  function handleUpdateFormSubmit() {
   const name = updatedItem.name;
   const quantity = updatedItem.quantity;
   const newItem = {
    id,
    name,
    quantity,
   };

    updateItem(newItem);
    setIsEditing(false);
  }

  return (
    <div className="flex justify-between p-5 m-5 overflow-auto border border-red-500 rounded-md bg-blue-200 text-black">
      {isEditing ? (
        <form onSubmit={handleUpdateFormSubmit} className="flex justify-between w-full">
          <div className="">
            <input
              className="block p-1 border rounded border-red-500 text-black"
              placeholder="Name"
              type="text"
              name="name"
              id="name-input"
              required
              value={updatedItem.name}
              onChange={(e) => setUpdatedItem({ ...updatedItem, name: e.target.value })}
            />

            <input
              className="block p-1 border rounded border-red-600 text-black"
              placeholder="Quantity"
              type="number"
              name="quantity"
              min={0}
              required
              value={updatedItem.quantity}
              onChange={(e) =>
                setUpdatedItem({ ...updatedItem, quantity: parseInt(e.target.value) })
              }
            />
          </div>
          <button
            className="p-2 my-4 border rounded border-red-500 hover:bg-red-600 text-black"
            type="submit"
          >
            Submit
          </button>
          <button
            onClick={onCancel}
            className="p-2 my-4 border rounded border-red-500 hover:bg-red-600 text-black"
            type="button"
          >
            Cancel
          </button>
        </form>
      ) : (
        <>
          <div>
            <p className="my-1">Name: {name}</p>
            <p className="my-1">Quantity: {quantity}</p>
          </div>
          {isManagementPage && (
            <div>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 my-4 rounded border-red-900 hover:bg-red-600 text-black"
              >
                Edit
              </button>

              <button
                onClick={() => deleteItem(name)}
                className="p-2 my-4 rounded border-red-900 hover:bg-red-600 text-black"
              >
                Delete
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
