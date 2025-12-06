import { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/api/axiosInstance';
import { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/types/api-error.types';
import { CartData } from '@/types/cart.types';

// ======================
// TYPES
// ======================

export type CartContextValue = {
  cart: CartData | undefined;
  isLoading: boolean;

  addToCart: (bookId: number) => Promise<{ success: boolean; message: string }>;

  updateQty: (opts: {
    itemId: number;
    quantity: number;
  }) => Promise<{ success: boolean; message: string }>;

  removeFromCart: (
    itemId: number
  ) => Promise<{ success: boolean; message: string }>;

  clearCart: () => Promise<{ success: boolean; message: string }>;

  refetch: () => Promise<unknown>;
};

// ==================================
// CREATE CONTEXT
// ==================================

export const CartContext = createContext<CartContextValue | null>(null);

// ==================================
// PROVIDER
// ==================================

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const qc = useQueryClient();

  // ambil token — dipakai buat enabled query
  const getToken = () => localStorage.getItem('token');
  const token = getToken();

  // ===========================
  // GET CART
  // ===========================
  const cartQuery = useQuery<CartData>({
    queryKey: ['cart', token],

    // HANYA fetch cart jika sudah login
    enabled: !!token,

    queryFn: async () => {
      const res = await axios.get('/api/cart');
      return res.data.data as CartData;
    },
  });

  // ===========================
  // ADD TO CART
  // ===========================
  const addToCartMutation = useMutation<
    { success: boolean; message: string },
    AxiosError<ApiErrorResponse>,
    number
  >({
    mutationFn: (bookId) =>
      axios
        .post('/api/cart/items', {
          bookId,
          qty: 1,
        })
        .then((r) => r.data),

    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),

    onError: (err) => {
      console.log('STATUS:', err.response?.status);
      console.log('DETAIL ERROR:', err.response?.data);
      console.log('FULL ERROR:', err);
    },
  });

  // ===========================
  // UPDATE QTY
  // ===========================
  const updateQtyMutation = useMutation<
    { success: boolean; message: string },
    AxiosError<ApiErrorResponse>,
    { itemId: number; quantity: number }
  >({
    mutationFn: ({ itemId, quantity }) =>
      axios
        .patch(`/api/cart/items/${itemId}`, { quantity })
        .then((r) => r.data),

    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
  });

  // ===========================
  // REMOVE ITEM
  // ===========================
  const removeItemMutation = useMutation<
    { success: boolean; message: string },
    AxiosError<ApiErrorResponse>,
    number
  >({
    mutationFn: (itemId) =>
      axios.delete(`/api/cart/items/${itemId}`).then((r) => r.data),

    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
  });

  // ===========================
  // CLEAR CART
  // ===========================
  const clearCartMutation = useMutation<
    { success: boolean; message: string },
    AxiosError<ApiErrorResponse>
  >({
    mutationFn: () => axios.delete('/api/cart').then((r) => r.data),

    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
  });

  return (
    <CartContext.Provider
      value={{
        cart: cartQuery.data,
        isLoading: cartQuery.isLoading,

        addToCart: (bookId) => addToCartMutation.mutateAsync(bookId),
        updateQty: (opts) => updateQtyMutation.mutateAsync(opts),
        removeFromCart: (itemId) => removeItemMutation.mutateAsync(itemId),
        clearCart: () => clearCartMutation.mutateAsync(),

        refetch: cartQuery.refetch,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ==================================
// HOOK HELPER
// ==================================

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
};
