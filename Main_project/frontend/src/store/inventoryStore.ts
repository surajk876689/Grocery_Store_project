import { create } from 'zustand'
import { Item, SortConfig } from '../types/index'
import apiClient from '../api/axios'

interface InventoryState {
  items: Item[]
  loading: boolean
  sortConfig: SortConfig
  searchQuery: string
  currentPage: number
  fetchItems: () => Promise<void>
  addItem: (item: Item) => void
  updateItem: (item: Item) => void
}

const useInventoryStore = create<InventoryState>((set, get) => ({
  items: [],
  loading: false,
  sortConfig: { column: 'name', direction: 'asc' },
  searchQuery: '',
  currentPage: 1,

  fetchItems: async () => {
    const { sortConfig, searchQuery } = get()
    set({ loading: true })
    try {
      const response = await apiClient.get<Item[]>('/items', {
        params: {
          sort_column: sortConfig.column,
          sort_direction: sortConfig.direction,
          search: searchQuery || undefined,
        },
      })
      set({ items: response.data })
    } finally {
      set({ loading: false })
    }
  },

  addItem: (item: Item) => {
    set((state) => ({ items: [...state.items, item] }))
  },

  updateItem: (item: Item) => {
    set((state) => ({
      items: state.items.map((i) => (i.id === item.id ? item : i)),
    }))
  },
}))

export default useInventoryStore
