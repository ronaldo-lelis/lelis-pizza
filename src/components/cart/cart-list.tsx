"use client"

import { useCart } from "@/stores/cart";
import { Button } from "../ui/button";
import { useProducts } from "@/stores/products";
import { useEffect, useState } from "react";
import { CartProduct } from "./cart-product";
import { decimalToMoney } from "@/lib/utils";
import { useAuth } from "@/stores/auth";

type Props = {
    lista: number
}

export const CartList = ({lista}: Props) => {

    const auth = useAuth();
    const cart = useCart();
    const productsList = useProducts();
    const [subTotal, setSubTotal] = useState(0);
    const [shippingCost, setShippingCost] = useState(10);

    const calculateSubTotal = () => {
        let sub = 0;
        for(let item of cart.items) {
            const product = productsList.products.find(pitem => pitem.id === item.productId);
            if(product) sub += item.quantity * parseFloat(product.price.toString());
        }
        setSubTotal(sub);
    }
    useEffect(calculateSubTotal, [cart]);

    return(
        <>
            <div className="flex flex-col gap-3 my-5">
                { cart.items.map(item => (
                    <CartProduct key={ item.productId } data={ item } />
                ))}
                
            </div>
            <div className="my-4 text-right">
                <div> Sub-total: { decimalToMoney(subTotal) }</div>
                <div> Frete: { decimalToMoney(shippingCost)} </div>
                <div className="font-bold"> Total: { decimalToMoney(subTotal + shippingCost) }</div>
            </div>
            { auth.token && <Button className="bg-green-700 hover:bg-green-900"> Finalizar Compra </Button> }
            { !auth.token && <Button onClick={() => auth.setOpen(true)}> Login / Cadastro </Button> }
        
        </>


    );
}