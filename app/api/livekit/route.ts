import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export async function GET(req: NextRequest) {
    try {
        const room = req.nextUrl.searchParams.get("room");
        const username = req.nextUrl.searchParams.get("username");

        console.log("LiveKit API called with:", { room, username });

        if (!room) {
            return new NextResponse("Room is required", { status: 400 })
        } else if (!username) {
            return new NextResponse("Username is required", { status: 400 })
        }

        const apiKey = process.env.LIVEKIT_API_KEY;
        const apiSecret = process.env.LIVEKIT_API_SECRET;
        const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

        console.log("Environment variables check:", {
            hasApiKey: !!apiKey,
            hasApiSecret: !!apiSecret,
            hasWsUrl: !!wsUrl,
            wsUrl: wsUrl
        });

        if (!apiKey || !apiSecret || !wsUrl) {
            console.error("Missing environment variables:", { apiKey: !!apiKey, apiSecret: !!apiSecret, wsUrl: !!wsUrl });
            return new NextResponse("Livekit API keys are not configured", { status: 500 })
        }

        const at = new AccessToken(apiKey, apiSecret, { identity: username });
        at.addGrant({ 
            room: room, 
            roomJoin: true, 
            canPublish: true, 
            canSubscribe: true,
            canPublishData: true
        });

        const token = await at.toJwt();

        return NextResponse.json({ token: token })
        
    } catch (error) {
        console.error("LiveKit API error:", error);
        return new NextResponse("Internal server error", { status: 500 })
    }
}