import React from "react";

export default function AddItemForm({ handleAddItem }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Extract data from the form
    const formData = new FormData(event.target);
    const newItem = {
      name: formData.get("name"),
      quantity: parseInt(formData.get("quantity")),
    };
    // Call the handleAddItem function with the new item data
    handleAddItem(newItem);
    // Optionally, clear the form fields
    event.target.reset();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 m-5 border border-blue-800"
    >
      <h2 className="mb-2 text-2xl">Add an Item</h2>
      <div>
        <input
          className="w-1/4 p-1 border rounded border-blue-600 text-black"
          placeholder="Name"
          type="text"
          name="name"
          id="name-input"
          required
        />
        <input
          className="w-1/4 p-1 border rounded border-blue-600 text-black"
          placeholder="Quantity"
          type="number"
          name="quantity"
          min={0}
          required
        />
      </div>
      <button
        className="p-2 my-4 border rounded border-blue-500 hover:bg-blue-600"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
}
