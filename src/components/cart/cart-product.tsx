"use client"

import { decimalToMoney } from "@/lib/utils";
import { useProducts } from "@/stores/products";
import { CartItem } from "@/types/cart-item";
import Image from "next/image";
import { Button } from "../ui/button";
import { useState } from "react";
import { useCart } from "@/stores/cart";

type Props = {
    data: CartItem;
}

export const CartProduct = ({ data }: Props) => {

    const [qtde, setQtde] = useState(data.quantity);
    const productsList = useProducts();
    const cart = useCart();
    let product = productsList.products.find(item => item.id === data.productId);
    if(!product) return null;

    const handleMinusClick = () => {
        if(qtde -1 <= 0) {
            cart.removeItem(data.productId);
        } else {
            cart.addItem({ productId: data.productId, quantity: -1 });
            setQtde(qtde - 1);
        }
    }

    const handlePlusClick = () => {
        cart.addItem({ productId: data.productId, quantity: 1 });
        setQtde(qtde + 1);
    }

    return(
        <div className="flex items-center gap-3">
            <div className="w-10">
                <Image 
                    src={ product.image }
                    alt={ product.name }
                    width={ 100 }
                    height={ 100 }
                    className="w-full"
                />
            </div>
            <div className="flex-1">
                <div className="text-base font-bold"> { product.name } </div>
                <div className="text-sm text-amber-700"> { decimalToMoney(product.price) } </div>
            </div>
            <div className="flex items-center bg-secondary p-2 rounded-md">
                <Button size="sm" variant="ghost" onClick={ handleMinusClick }> - </Button>
                <div className="mx-3"> { qtde } </div>
                <Button size="sm" variant="ghost" onClick={ handlePlusClick }> + </Button>
            </div>
        </div>
    );
}