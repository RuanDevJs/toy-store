"use client";
import React, { FormEvent, useRef, useState } from 'react'
import axios from 'axios';

import ENV from '@/settings/env'
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Page() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const formRef = useRef<HTMLFormElement>(null);
    const toastRef = useRef<Toast>(null);

    const navigate = useRouter();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (toastRef.current === null) return;

        try {

            if (!email.length || !password.length) {
                return toastRef.current.show({ severity: "error", summary: "Erro ao autenticar usuário", detail: "Email ou senha não informado!" });
            }

            const payload = { email, password };
            await axios.post(`${ENV.BACKEND_API}/api/auth/register`, { ...payload });

            navigate.push("/home");
        } catch (error) {
            if (error instanceof Error) {
                return toastRef.current.show({ severity: "error", summary: "Erro ao cadastrar usuário", detail: "Email já cadastrado!" });
            }
        } finally {
            formRef.current?.reset();
        }
    }
    return (
        <main className='w-full mx-auto my-20 space-y-10' onSubmit={handleSubmit}>
            <form ref={formRef} className='w-[80%] m-auto flex flex-col items-center'>
                <h1 className='text-4xl font-semibold text-zinc-900'>Toy Store - Cadastrar</h1>
                <div className='w-[32%] flex flex-col gap-3 mt-5'>
                    <div className='w-full flex flex-col'>
                        <label htmlFor="email" className='text-zinc-700 font-normal text-lg'>Email</label>
                        <input onChange={event => setEmail(event.target.value)} type="email" id="email" className='w-full p-3.5 bg-zinc-100 rounded outline-none' placeholder='ruan.vitor@gmail.com' />
                    </div>
                    <div className='w-full flex flex-col'>
                        <label htmlFor="password" className='text-zinc-700 font-normal text-lg'>Senha</label>
                        <input onChange={event => setPassword(event.target.value)} type="password" id="password" className='w-full p-3.5 bg-zinc-100 rounded outline-none' placeholder='****' />
                    </div>
                    <button className='w-[42%] m-auto p-2.5 bg-blue-600 mt-3 rounded text-white cursor-pointer'>
                        Fazer cadastro
                    </button>
                    <Link className='text-zinc-600 font-medium text-sm text-right' href="/">
                        Gostaria de fazer login
                    </Link>
                </div>
            </form>
            <Toast ref={toastRef} />
        </main>
    )
}
