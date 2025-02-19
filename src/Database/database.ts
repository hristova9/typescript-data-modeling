import { Log } from "../decorators/Log";

export class DataBase<T extends { id: number; username: string }> {
  private data: Map<number, T> = new Map();
  constructor(private itemType: string) {}

  @Log
  add(item: T) {
    this.data.set(item.id, item);
    return `New ${this.itemType} is created!`;
  }

  @Log
  getAll() {
    const items = Array.from(this.data.values());
    if (items.length === 0) {
      return `There is no ${this.itemType} created!`;
    }
    return JSON.stringify(items);
  }

  @Log
  getById(id: number) {
    const item = this.data.get(id);
    if (!item) {
      return `Can't find such ${this.itemType}!`;
    }
    return JSON.stringify(item);
  }

  @Log
  update(id: number, item: Partial<T>) { //Using Partial Utility Type for partially updating
    const existingItem = this.data.get(id);
    if (!existingItem) {
      return `Can't find such ${this.itemType}!`;
    } else {
      const updatedItem = { ...existingItem, ...item };
      this.data.set(id, updatedItem);
      return `${this.itemType} is updated!`;
    }
  }

  @Log
  delete(id: number) {
    const item = this.data.get(id);
    if (!item) {
      return `Can't find such ${this.itemType}!`;
    }
    this.data.delete(id);
    return `${this.itemType} has been deleted!`;
  }
}
