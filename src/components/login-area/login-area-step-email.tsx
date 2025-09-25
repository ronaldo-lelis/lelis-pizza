"use client"

import { useState } from "react";
import { CustomInput } from "../layout/custom-input";
import { Button } from "../ui/button";
import z from 'zod';
import { api } from "@/lib/axios";

const schema = z.object({
    email: z.string().email('E-mail inválido')
});

type Props = {
    onValidate: (hasEmail: boolean, email: string) => void;
}

export const LoginAreaStepEmail = ({ onValidate }: Props) => {

    const [errors, setErrors] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [emailField, setEmailField] = useState('');

    const handleButton = async () => {

        setErrors(null);
        const valid = schema.safeParse({
            email: emailField
        });
        if(!valid.success) {
            setErrors(valid.error.flatten().fieldErrors);
            return false;
        }
        try {
            setLoading(true);
            const emailReq = await api.post('/validate_email', {
                email: valid.data.email
            });
            setLoading(false);
            onValidate(
                emailReq.data.exists ? true : false,
                valid.data.email
            )         
        } catch (error) {
            setLoading(false);
        }
    }

    return (
        <>
            <div>
                <p className="mb-2"> Digite seu E-mail </p>
                <CustomInput 
                    name="email" 
                    errors={errors}
                    disabled={loading}
                    type="email"
                    value={emailField}
                    onChange={e => setEmailField(e.target.value)}
                />
            </div>
            <Button disabled={loading} onClick={ handleButton }> Continuar </Button>        
        </>
    );
}
