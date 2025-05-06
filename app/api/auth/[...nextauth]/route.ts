import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import { authConfig } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    return handler(req);
}

export async function POST(req: NextRequest) {
    return handler(req);
}

function handler(req: NextRequest) {
    const host = req.headers.get("host");
    const baseUrl = `https://${host}`;

    const config = {
        ...authConfig,
        providers: [
            MicrosoftEntraID({
                clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID!,
                clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
                issuer: `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_TENANT_ID}/v2.0`,
                authorization: {
                    url: `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_TENANT_ID}/oauth2/v2.0/authorize`,
                    params: {
                        prompt: "login",
                        scope: "openid profile email offline_access",
                        redirect_uri: `${baseUrl}/api/auth/callback/microsoftentra`,
                    },
                },
            }),
        ],
    };
    return NextAuth(config);
}

