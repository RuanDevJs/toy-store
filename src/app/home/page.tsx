'use client';
import ENV from '@/settings/env';
import axios from 'axios';
import Link from 'next/link';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

type TypeEstatisticas = {
    data: string;
    valor: number;
};

type TypeInfo = {
    nomeCompleto: string;
    detalhes: {
        email: string;
        nascimento: string;
    };
};

interface ICustomers {
    info: TypeInfo;
    estatisticas: { vendas: TypeEstatisticas[] };
    duplicado?: { nomeCompleto: string };
}

interface IFormatedCustomer {
    name: string;
    email: string;
    birthday: string;
    totalSales: number;
    averageSales: number;
    frequency: number;
    sales: TypeEstatisticas[];
    missingLetter: string;
}

interface IMedia {
    maiorVolume: IFormatedCustomer;
    maiorMedia: IFormatedCustomer;
    maiorFrequencia: IFormatedCustomer;
}

interface IVendasPorDia {
    data: string;
    total: number;
}

export default function Home() {
    const [customers, setCustomers] = useState<IFormatedCustomer[]>([]);
    const [loadingCustomer, setLoadingCustomer] = useState(true);
    const [media, setMedia] = useState<IMedia>({} as IMedia);
    const [vendasPorDia, setVendasPorDia] = useState<IVendasPorDia[]>([]);

    function getFirstMissingLetter(name: string): string {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
        const normalizedName = name
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z]/g, '');

        for (const letter of alphabet) {
            if (!normalizedName.includes(letter)) {
                return letter;
            }
        }

        return '-';
    }

    useEffect(() => {
        async function fetchCustomers() {
            const response = await axios.get(`${ENV.JSON_SERVER_API}/clientes`);
            const data = response.data as ICustomers[];

            const vendasDiaMap: Record<string, number> = {};

            const formatedResponse: IFormatedCustomer[] = data.map((cliente) => {
                const name = cliente.info?.nomeCompleto || cliente.duplicado?.nomeCompleto || "Desconhecido";
                const email = cliente.info.detalhes.email;
                const birthday = cliente.info.detalhes.nascimento;
                const salesList = cliente.estatisticas.vendas;

                const total = salesList.reduce((acc, venda) => {
                    vendasDiaMap[venda.data] = (vendasDiaMap[venda.data] || 0) + venda.valor;
                    return acc + venda.valor;
                }, 0);

                const freq = salesList.length;
                const average = freq ? total / freq : 0;

                return {
                    name,
                    email,
                    birthday,
                    sales: salesList,
                    averageSales: average,
                    frequency: freq,
                    totalSales: total,
                    missingLetter: getFirstMissingLetter(name)
                };
            });

            const maiorVolume = formatedResponse.reduce((prev, curr) => (curr.totalSales > prev.totalSales ? curr : prev));
            const maiorMedia = formatedResponse.reduce((prev, curr) => (curr.averageSales > prev.averageSales ? curr : prev));
            const maiorFrequencia = formatedResponse.reduce((prev, curr) => (curr.frequency > prev.frequency ? curr : prev));

            const vendasList: IVendasPorDia[] = Object.entries(vendasDiaMap).map(([data, total]) => ({ data, total }));

            setCustomers(formatedResponse);
            setMedia({ maiorVolume, maiorMedia, maiorFrequencia });
            setVendasPorDia(vendasList);
            setLoadingCustomer(false);
        }

        fetchCustomers();
    }, []);

    function Body({ value }: { value: number }) {
        const formatedValue = value.toLocaleString('pt-br', {
            currency: 'BRL',
            style: "currency"
        });
        return (
            <p>{formatedValue}</p>
        )
    }

    return (
        <main className='w-full mx-auto my-20 space-y-10'>
            <header className='w-full flex flex-col items-center'>
                <h1 className='text-4xl font-semibold text-zinc-900'>Toy Store - Dashboard</h1>
                <div className='my-3 flex gap-3'>
                    <Link href="/home/create-new-customer" className="block bg-green-600 text-white px-4 py-1 rounded">Registrar novo cliente</Link>
                </div>
            </header>
            <section className='w-[75%] mx-auto bg-zinc-300 p-3 rounded'>
                <DataTable value={customers} loading={loadingCustomer}>
                    <Column field="name" header="Nome do cliente" />
                    <Column field="email" header="Email do cliente" />
                    <Column field="birthday" header="Data de nascimento" />
                    <Column field='averageSales' header="Média de Vendas" body={value => <Body value={value.averageSales} />} />
                    <Column field="totalSales" header="Total de Vendas" body={value => <Body value={value.totalSales} />} />
                    <Column field='frequency' header="Frequência" />
                    <Column field='missingLetter' header="Letra faltante do alfabeto" />
                </DataTable>
            </section>
            <section className='w-[75%] mx-auto'>
                <h2 className='text-2xl font-semibold mb-4'>Total de Vendas por Dia</h2>
                <div className="bg-white p-4 rounded shadow">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={vendasPorDia}>
                            <XAxis dataKey="data" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="total" fill="#4F46E5" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </section>
            <section className='w-[75%] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='bg-blue-100 p-4 rounded-xl shadow'>
                    <h3 className='text-lg font-semibold text-center'>O cliente com maior volume de vendas</h3>
                    <p className='text-blue-800'>{media.maiorVolume?.name}</p>
                    <p>Total vendido: {media.maiorVolume?.totalSales.toLocaleString('pt-br', {
                        currency: 'BRL',
                        style: "currency"
                    })}</p>
                </div>
                <div className='bg-green-100 p-4 rounded-xl shadow'>
                    <h3 className='text-lg font-semibold text-center'>O cliente com maior média de valor por venda</h3>
                    <p className='text-green-800'>{media.maiorMedia?.name}</p>
                    <p>Média por venda: {media.maiorMedia?.averageSales.toLocaleString('pt-br', {
                        currency: 'BRL',
                        style: "currency"
                    })}</p>
                </div>
                <div className='bg-yellow-100 p-4 rounded-xl shadow'>
                    <h3 className='text-lg font-semibold text-center'>O cliente com maior frequência de compras</h3>
                    <p className='text-yellow-800'>{media.maiorFrequencia?.name}</p>
                    <p>Compras: {media.maiorFrequencia?.frequency}</p>
                </div>
            </section>
        </main>
    );
}
