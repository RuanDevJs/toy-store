import React from 'react'
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export default async function Layout({ children }: React.PropsWithChildren) {
    try {
        const cookiesHandler = await cookies();
        const token = cookiesHandler.get("@toy-store:auth-token");

        if (token === undefined) return redirect("/?error=invalid-token");

        const decoded = jwt.verify(token.value, process.env.JWT_SECRET!);
        if (!decoded) return redirect("/?error=expired-token");;

        return (
            <div>
                {children}
            </div>
        )
    } catch (error) {
        console.error(error);
        return redirect("/?error=user-not-authenticated");
    }
}
