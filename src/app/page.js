"use client";
import { useState, useEffect } from "react";
import ItemFormComponent from "../components/ItemForm";
import { Item, Inventory } from "../utils/inventory";
import { getAllDocuments } from "../utils/firebase.Utils";
import { db } from "../../firebase.config";

export default function Home() {
  const [inventory, setInventory] = useState(
    new Inventory("School Supplies", [])
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const documents = await getAllDocuments(db, "items");
        const setItems = documents.map((doc) => {
          return new Item(doc.name, 
            doc.quantity, 
            doc.id
          );
        });

        setInventory(new Inventory(inventory.name, setItems));
      } catch (error) {
        console.log("Error fetching data", error);
      }
    }

    fetchData();
    return () => {
      console.log("home page side effect cleanup");
    };
  }, []);


  return (
    <main style={{ minHeight: "85vh" }}>
      <h1 className="py-12 text-4xl text-center underline  border-red-500 border-2 bg-blue-300 text-black font-bold rounded-lg">
  School Supplies Inventory
</h1>


      <div>
        <h3 className="m-5 text-xl underline">Item list:</h3>
        <hr className="mx-5"></hr>
        <div className="flex flex-wrap">
        {inventory.items.map((item) => (
          <ItemFormComponent 
            key={item.id}
            name={item.name}
            quantity={item.quantity}
            id={item.id}           
              />
        ))
        }
        </div>
        </div>
    </main>
  );
}
