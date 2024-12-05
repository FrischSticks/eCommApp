import { NextRequest, NextResponse } from "next/server";
import { isValidPassword } from "./lib/isValidPassword";

export async function middleware(req: NextRequest) {
    if ( await isAuthenticated(req) === false ) {
        return new NextResponse("Unauthorized Access", { status: 401,
            // Basic Authentication (Built into Browser!) ---> Great for Admin Pages (Simple)
            headers: {"WWW-Authenticate": "Basic", "Cache-Control": "no-cache, no-store, must-revalidate"}})
    }
}

async function isAuthenticated(req: NextRequest) {
    // Grab Header (Check both!)
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization")

    // If null, Browser will try to Authenticate the User
    if (authHeader == null) return false


    try {
        // Use Buffer.from() because the Values are Encrypted
        // Split by " " and Return the 2nd value [1], because the authHeader will look something like this...
        // Example: "Basic fwgu15h292b"
        const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64")
            .toString()
            // Split toString by ":", because the decoded value will be username:password
            .split(":");
        return username === process.env.ADMIN_USERNAME && (await isValidPassword
                (password, process.env.HASHED_ADMIN_PASSWORD as string))
    } catch (error) {
        console.error("Malformed Authorization header", error);
        return false;
    }
}

// Grabs All Admin Pages & Applies this Middleware (Runs w/ Every Admin Page)
export const config = {
    matcher: "/admin/:path*"
}