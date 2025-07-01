import { NextRequest, NextResponse } from "next/server";
import CustomersRepository, { ISavePayload } from "@/database/repositories/CustomersRepository";

import { authenticateUser } from "../auth/route";

type filterOptions = "email" | "name" | "id";

export async function GET(request: NextRequest) {
    try {
        await authenticateUser();

        const searchParams = request.nextUrl.searchParams;
        const repository = new CustomersRepository();
        const orderBy = searchParams?.get("orderBy") as filterOptions;

        if (searchParams) {
            const rows = await repository.findAll(orderBy);
            return NextResponse.json({ clientes: rows }, { status: 200 });
        }

        const rows = await repository.findAll();
        return NextResponse.json({ clientes: rows }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await authenticateUser();

        const payload = (await request.json()) as ISavePayload;
        const repository = new CustomersRepository();

        if (!payload.name || !payload.email) throw new Error("Missing payload name or email!");

        const user = await repository.findByCustomerEmail(payload.email);
        if (user && user.email) throw new Error("Email already in user!");

        await repository.save(payload);

        return NextResponse.json({ created: true }, { status: 201 });
    } catch (error) {
        if (error instanceof Error) return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
