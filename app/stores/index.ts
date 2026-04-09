import { defineStore } from 'pinia';

export interface Item {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  type: string;
  priority?: number;
}

export const useItemStore = defineStore('items', {
  state: () => ({
    items: [] as Item[],
    nextId: 1,
  }),

  actions: {
    addItem(name: string, description: string, enabled: boolean, type: string, priority?: number) {
      this.items.push({
        id: this.nextId++,
        name,
        description,
        enabled,
        type,
        priority,
      });
    },

    removeItem(id: number) {
      const index = this.items.findIndex(p => p.id === id);
      if (index !== -1) {
        this.items.splice(index, 1);
      }
    },

    updateItem(id: number, name: string, description: string, enabled: boolean, type: string, priority?: number) {
      const item = this.items.find(p => p.id === id);
      if (item) {
        item.name = name;
        item.description = description;
        item.enabled = enabled;
        item.type = type;
        item.priority = priority;
      }
    },
  },
});

