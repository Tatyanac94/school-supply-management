// inventory.js

class Item {
  constructor(name, quantity, id = null) {
    this.name = name;
    this.quantity = quantity;
    this.id = id;
  }
}

class Inventory {
  constructor(name, items = []) {
    this.name = name;
    this.items = items;
  }

  addItem(newItem) {
    const existingItemIndex = this.items.findIndex(item => item.name === newItem.name);

    if (existingItemIndex !== -1) {
      const updatedItems = [...this.items];
      updatedItems[existingItemIndex].quantity += newItem.quantity;
      this.items = updatedItems;
    } else {
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
