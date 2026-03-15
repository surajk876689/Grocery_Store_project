export interface Item {
  id: number;
  name: string;
  price: number; // whole ₹
  stock: number;
}

export interface CartItem {
  item: Item;
  quantity: number;
}

export interface ReceiptLineItem {
  name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export interface Receipt {
  customer_name: string;
  items: ReceiptLineItem[];
  grand_total: number;
}

export interface SortConfig {
  column: keyof Item;
  direction: 'asc' | 'desc';
}
