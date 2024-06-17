"use client";
import React, { useState, useEffect } from "react";

export default function Home() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const initialItems = [
      { id: 1, name: 'Pencils' },
      { id: 2, name: 'Notebooks' },
      { id: 3, name: 'Erasers' },
    ];
    setItems(initialItems);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">School Supplies</h1>
      <ul>
        {items.map(item => (
          <li key={item.id} className="mb-2">
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
