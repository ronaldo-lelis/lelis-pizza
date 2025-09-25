import { CartItem } from "@/types/cart-item";
import { create } from "zustand";

type Store = {
    open: boolean;
    setOpen: (open: boolean) => void;

    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (productId: number) => void;
}

export const useCart = create<Store>()((set) => ({
    open: false,
    items: [],
    setOpen: (open) => set(state => ({ ...state, open })),
    addItem: (item) => set(state => {
        const cloneItems = [...state.items];
        const existingItemIndex = state.items.find(
            cartItem => cartItem.productId === item.productId
        );
        if(existingItemIndex) {
            for(let key in cloneItems) {
                if(cloneItems[key].productId === item.productId) {
                    cloneItems[key].quantity += item.quantity;
                }
            }
        } else {
            cloneItems.push(item);
        }
        return { ...state, items: cloneItems }
    }),
    removeItem: (productId) => set(state => ({
        ...state,
        items: state.items.filter(item => item.productId !== productId)
    }))
}));
