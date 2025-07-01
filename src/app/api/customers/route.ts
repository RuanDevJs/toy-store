import { NextRequest, NextResponse } from "next/server";
import CustomersRepository from "@/database/repositories/CustomersRepository";

import { authenticateUser } from "../auth/route";

type filterOptions = "email" | "name" | "id";

interface IPayload {
    name: string;
    email: string;
}

export async function GET(request: NextRequest) {
    try {
        await authenticateUser();

        const searchParams = request.nextUrl.searchParams;
        const repository = new CustomersRepository();
        const orderBy = searchParams?.get("orderBy") as filterOptions;

        if (searchParams) {
            const rows = await repository.findAll(orderBy);
            return NextResponse.json({ clientes: rows });
        }

        const rows = await repository.findAll();
        return NextResponse.json({ clientes: rows });
    } catch (error) {
        if (error instanceof Error) return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await authenticateUser();

        const payload = (await request.json()) as IPayload;
        const repository = new CustomersRepository();

        await repository.save(payload);
        return NextResponse.json({ created: true });
    } catch (error) {
        if (error instanceof Error) return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
