import { NextResponse } from "next/server";
import SalesRepository from "@/database/repositories/SalesRepository";
import { authenticateUser } from "../auth/route";

export async function GET() {
    try {
        await authenticateUser();
        const repository = new SalesRepository();

        const rows = await repository.calculateSalesPerDay();
        return NextResponse.json({ total_sales_per_day: rows }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
