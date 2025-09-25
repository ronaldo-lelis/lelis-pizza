import { deleteCookie, setCookie } from "cookies-next/client";
import { create } from "zustand";


type Store = {
    open: boolean;
    token: string | null;
    setOpen: (newOpen: boolean) => void;
    setToken: (newToken: string | null) => void;
}

export const useAuth = create<Store>()(set => ({
    open: false,
    token: null,
    setOpen: (newOpen) => set(state => ({ ...state, open: newOpen })),
    setToken: (newToken) => set(state => {
        if(newToken) {
            setCookie('token', newToken);
        } else {
            deleteCookie('token');
        }
        return { ...state, token: newToken }
    })
}));
