import apiClient from './axios';
import type { Item } from '../types';

interface GetItemsParams {
  search?: string;
  sort_by?: string;
  order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}

export async function getItems(params?: GetItemsParams): Promise<Item[]> {
  const res = await apiClient.get<Item[]>('/items', { params });
  return res.data;
}

export async function getItem(id: number): Promise<Item> {
  const res = await apiClient.get<Item>(`/items/${id}`);
  return res.data;
}

export async function createItem(data: { name: string; price: number; stock: number }): Promise<Item> {
  const res = await apiClient.post<Item>('/items', data);
  return res.data;
}

export async function updateItem(id: number, data: { name: string; price: number; stock: number }): Promise<Item> {
  const res = await apiClient.put<Item>(`/items/${id}`, data);
  return res.data;
}
