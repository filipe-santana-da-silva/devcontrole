'use client';

import { Input } from "@/components/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useState } from "react";

import { FiSearch,FiX } from "react-icons/fi";
import { FormTicket } from "./components/FormTicket";

import { api } from "@/lib/api";

const schema = z.object({
    email: z.string().email("Digite o email do cliente para localizar.").min(1,"O campo email é obrigatório")
})

type FormData = z.infer<typeof schema>

export interface CustomerDataInfo{
    id: string;
    name: string;
}

export default function OpenTicket(){
    const [customer, setCustomer] = useState<CustomerDataInfo | null>(null);
    const { register, setError, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema)
    })

    function handleClearCustomer(){
        setCustomer(null)
        setValue("email","")
    }

    async function handleSearchCustomer(data:FormData){
        const response = await api.get("/api/customer", {
            params: {
                email: data.email
            }
        })

        if(response.data === null){
            setError("email",{type: "custom", message: "Ops, cliente não foi encontrado"})
            return;
        }
        setCustomer({
            id: response.data.id,
            name: response.data.name
        })
    }
    return(
        <div className="w-full max-w-2xl mx-auto px-2">
            <h1 className="font-bold text-3xl text-center mt-24">Abrir Chamado</h1>
            <main className="flex flex-col mt-4 mb-2">
               { customer ? (
                <div className="bg-slate-100 py-6 px-4 rounded border-2 flex items-center justify-between">
                    <p className="text-lg"><strong>Cliente selecionado:</strong> {customer.name}</p>
                    <button className="bg-red-600 h-11 px-2 flex items-center justify-center rounded" onClick={handleClearCustomer}><FiX size={24} color="#fff"/></button>
                </div>
               ) : (
                 <form className="bg-slate-50 py-6 px-2 rounded border-2" onSubmit={handleSubmit(handleSearchCustomer)}>
                    <div className="flex flex-col gap-3">
                        <Input
                            name="email"
                            placeholder="Digite o email do cliente..."
                            type="text"
                            error={errors.email?.message}
                            register={register}
                        />
                        <button type="submit" className="bg-blue-500 flex flex-row gap-3 px-2 h-11 items-center justify-center font-bold rounded text-white">Procurar cliente <FiSearch size={24} color="#fff"/></button>
                    </div>
                </form>
               )}
               { customer !== null && <FormTicket customer={customer}/>}
            </main>
        </div>
    )
}