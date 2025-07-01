import CustomersRepository, {
    IUpdatePayload,
} from "@/database/repositories/CustomersRepository";
import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "../../auth/route";

interface IContext {
    params: {
        id: string;
    };
}

export async function GET(request: NextRequest, context: IContext) {
    await authenticateUser();
    const repository = new CustomersRepository();
    const params = await context.params;

    try {
        const rows = await repository.findByCustomerId(params.id);
        return NextResponse.json({ cliente: rows });
    } catch (error) {
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, context: IContext) {
    await authenticateUser();
    const repository = new CustomersRepository();
    const params = await context.params;
    const payload = (await request.json()) as IUpdatePayload;

    try {
        await repository.update(params.id, payload);
        return NextResponse.json({ updated: true });
    } catch (error) {
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, context: IContext) {
    await authenticateUser();
    const repository = new CustomersRepository();
    const params = await context.params;

    try {
        await repository.delete(params.id);
        return NextResponse.json({ deleted: true });
    } catch (error) {
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
