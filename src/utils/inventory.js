// inventory.js

// Item class definition
class Item {
    constructor(name, quantity) {
      this.name = name;
      this.quantity = quantity;
    }
  }
  
  // Inventory class definition
  class Inventory {
    constructor(name, items = []) {
      this.name = name;
      this.items = items;
    }
  
    addItem(newItem) {
      const existingItemIndex = this.items.findIndex(item => item.name === newItem.name);
  
      if (existingItemIndex !== -1) {
        // Item already exists, update quantity
        const updatedItems = [...this.items];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        this.items = updatedItems;
      } else {
        // Item doesn't exist, add new item
        this.items = [...this.items, newItem];
      }
    }
  
    updateItemQuantity(name, newQuantity) {
      const itemToUpdate = this.items.find(item => item.name === name);
  
      if (itemToUpdate) {
        const updatedItems = this.items.map(item =>
          item.name === name ? { ...item, quantity: newQuantity } : item
        );
        this.items = updatedItems;
      } else {
        console.error(`Item '${name}' not found in inventory.`);
      }
    }
  
    removeItem(name) {
      const updatedItems = this.items.filter(item => item.name !== name);
      if (updatedItems.length === this.items.length) {
        console.error(`Item '${name}' not found in inventory.`);
      } else {
        this.items = updatedItems;
      }
    }
  }
  
  export { Item, Inventory };
  