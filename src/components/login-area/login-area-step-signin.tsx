"use client"

import { useAuth } from "@/stores/auth";
import { useState } from "react";
import z from "zod";
import { CustomInput } from "../layout/custom-input";
import { Button } from "../ui/button";
import { api } from "@/lib/axios";

const schema = z.object({
    email: z.string().email('E-mail inválido'),
    password: z.string().min(3, 'Campo obrigatório')
});

type Props = {
    email: string;
}

export const LoginAreaSignin =({ email }: Props) => {

    const auth = useAuth();
    const [errors, setErrors] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [emailField, setEmailField] = useState(email);
    const [passwordField, setPasswordField] = useState('');

    const handleButton = async () => {
        setErrors(null);
        const valid = schema.safeParse({
            email: emailField,
            password: passwordField
        });
        if(!valid.success) {
            setErrors(valid.error.flatten().fieldErrors);
            return false;
        }
        try {
            setLoading(true);
            const signinReq = await api.post('/signin', {
                email: valid.data.email,
                password: valid.data.password
            });
            setLoading(false);
            if(!signinReq.data.token) {
                alert(signinReq.data.error);
            } else {
                auth.setToken(signinReq.data.token);
                auth.setOpen(false);
            }
        } catch (error) {
            setLoading(false);            
        }
    }

    return (
        <>            
            <div>
                <p className="mb-2"> Digite seu E-mail: </p>
                <CustomInput 
                    name="email" 
                    errors={errors}
                    disabled={loading}
                    type="email"
                    value={emailField}
                    onChange={e => setEmailField(e.target.value)}
                />
            </div>
            <div>
                <p className="mb-2"> Digite sua senha: </p>
                <CustomInput 
                    name="password" 
                    errors={errors}
                    disabled={loading}
                    type="password"
                    value={passwordField}
                    onChange={e => setPasswordField(e.target.value)}
                    autoFocus
                />
            </div>        
            <Button disabled={loading} onClick={ handleButton }> Continuar </Button>
        </>
    );
}
