import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { DatabaseClient } from "@/database/MongoClient";
import { cookies } from "next/headers";

interface IPayload {
    email: string;
    password: string;
}

async function initDatabase() {
    try {
        const client = await DatabaseClient();
        const db = await client?.db(process.env.MONGO_DATABASE);
        return { client, db };
    } catch {
        throw new Error("Failed to establish connection to database");
    }
}

export async function POST(request: NextRequest) {
    try {
        const cookiesHandler = await cookies();

        const SECRET_KEY = process.env.JWT_SECRET!;
        const payload = (await request.json()) as IPayload;
        const passwordCrypted = await bcrypt.hash(payload.password, 10);

        if (!payload.email || !payload.password)
            throw new Error("Missing payload email or password");

        const { db } = await initDatabase()!;

        const user = await db
            ?.collection<IPayload>("users")
            .findOne({ email: payload.email });
        if (user && user.email) throw new Error("Email already exists!")

        const authenticatedUser = await db
            ?.collection<IPayload>("users")
            .insertOne({ email: payload.email, password: passwordCrypted });

        const id = authenticatedUser?.insertedId.toString();

        const token = jwt.sign({ sub: id }, SECRET_KEY, {
            expiresIn: "1h",
        });

        cookiesHandler.set("@toy-store:auth-token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60,
        });
        return NextResponse.json({ token }, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}
