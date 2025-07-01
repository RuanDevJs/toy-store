'use client';
import ENV from '@/settings/env';
import axios from 'axios';
import React, { FormEvent, useState } from 'react'

export default function Page() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [dtNasc, setDtNasc] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const payload = {
            "info": {
                nomeCompleto: username,
                "detalhes": {
                    "email": email,
                    "nascimento": dtNasc
                }
            },
            "estatisticas": {
                "vendas": [
                    { "data": "2024-01-05", "valor": 150 },
                    { "data": "2024-01-06", "valor": 180 },
                    { "data": "2024-01-09", "valor": 72 }
                ]
            }
        }
        await axios.post(`${ENV.JSON_SERVER_API}/clientes`, { ...payload });

    }
    return (
        <main className='w-full mx-auto my-20 space-y-10'>
            <form className='w-[80%] m-auto flex flex-col items-center' onSubmit={handleSubmit}>
                <h1 className='text-4xl font-semibold text-zinc-900'>Toy Store - Save New Customer</h1>
                <div className='w-[32%] flex flex-col gap-3 mt-5'>
                    <div className='w-full flex flex-col'>
                        <label htmlFor="email" className='text-zinc-700 font-normal text-lg'>Email</label>
                        <input onChange={e => setEmail(e.target.value)} type="email" id="email" className='w-full p-3.5 bg-zinc-100 rounded outline-none' placeholder='ruan.vitor@gmail.com' />
                    </div>
                    <div>
                        <label htmlFor="username" className='text-zinc-700 font-normal text-lg'>Nome completo</label>
                        <input onChange={e => setUsername(e.target.value)} type="username" id="username" className='w-full p-3.5 bg-zinc-100 rounded outline-none' placeholder='Ruan Vitor' />
                    </div>
                    <div>
                        <label htmlFor="dtNasc" className='text-zinc-700 font-normal text-lg'>Email</label>
                        <input onChange={e => setDtNasc(e.target.value)} type="date" id="dtNasc" className='w-full p-3.5 bg-zinc-100 rounded outline-none' />
                    </div>
                    <button className='w-[42%] m-auto p-2.5 bg-blue-600 mt-3 rounded text-white cursor-pointer'>
                        Registrar novo cliente
                    </button>
                </div>
            </form>
        </main>
    )
}
