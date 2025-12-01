export type CartItemBook = {
  id: number;
  title: string;
  coverImage?: string | null;
  Author?: { id: number; name: string } | null;
  Category?: { id: number; name: string } | null;
};

export type CartItem = {
  id: number;
  bookId: number;
  quantity: number;
  Book?: CartItemBook | null;
};

export type CartData = {
  cartId: number;
  items: CartItem[];
  grandTotal: number;
};
