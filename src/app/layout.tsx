import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";

import { PrimeReactProvider } from "primereact/api"
import "primereact/resources/primereact.min.css"

import "./globals.css";

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Toy Store",
    description: "Desafio técnico feito por Ruan Vitor",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <PrimeReactProvider>
                <body className={`${geistMono.variable} antialiased`}>
                    {children}
                </body>
            </PrimeReactProvider>
        </html>
    );
}
