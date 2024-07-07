import React, { useState } from "react";
import { Item } from "@/utils/inventory";

export default function ItemFormComponent({
  id,
  name,
  quantity,
  updateItem,
  deleteItem,
  isManagementPage,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedItem, setUpdatedItem] = useState({
    name,
    quantity,
  });

  function handleUpdateItem(e) {
    e.preventDefault();

    const newItem = new Item(updatedItem.name, updatedItem.quantity);
    newItem.id = id;

    updateItem(newItem);
    setIsEditing(false);
  }

  return (
    <div className="flex justify-between p-5 m-5 overflow-auto border-4 border-dashed border-red-500 rounded-md bg-blue-200 text-black">
      {isEditing ? (
        <form onSubmit={handleUpdateItem} className="flex justify-between w-full">
          <input
            name="name"
            id="name-input"
            required
            type="text"
            value={updatedItem.name}
            onChange={(e) => setUpdatedItem({ ...updatedItem, name: e.target.value })}
            className="block p-1 border rounded border-red-500 text-black"
            placeholder="Name"
          />
          <input
            name="quantity"
            id="quantity-input"
            required
            type="number"
            value={updatedItem.quantity}
            onChange={(e) => setUpdatedItem({ ...updatedItem, quantity: parseInt(e.target.value) || 0 })}
            className="block p-1 border rounded border-red-600 text-black"
            placeholder="Quantity"
            min={0}
          />
          <button
            type="submit"
            className="p-2 my-4 border rounded border-red-500 hover:bg-red-600 text-black"
          >
            Submit
          </button>
        </form>
      ) : (
        <>
          <div>
          <p className="my-1">
            <span className="font-bold underline">Name:</span> {name}
          </p>
          <p className="my-1">
            <span className="font-bold underline">Quantity:</span> {quantity}
          </p>
          </div>
          {isManagementPage && (
            <div>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 my-4 rounded border-red-900 hover:bg-red-600 text-black underline font-bold"
              >
                Edit
              </button>
              <button
                onClick={() => deleteItem(id)}
                className="p-2 my-4 rounded border-red-900 hover:bg-red-600 text-black underline font-bold"
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
