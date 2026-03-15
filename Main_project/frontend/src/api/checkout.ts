import apiClient from './axios';
import type { Receipt } from '../types';

interface CheckoutRequest {
  customer_name: string;
  items: { item_id: number; quantity: number }[];
}

export async function postCheckout(request: CheckoutRequest): Promise<Receipt> {
  const res = await apiClient.post<Receipt>('/checkout', request);
  return res.data;
}
