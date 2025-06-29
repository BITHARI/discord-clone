"use client"
import { LiveKitRoom, VideoConference } from "@livekit/components-react"
import "@livekit/components-styles"
import { useUser } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface MediaRoomProps {
    chatId: string
    video: boolean
    audio: boolean
}

export function MediaRoom({ chatId, video, audio }: MediaRoomProps) {
    const { user } = useUser()
    const [token, setToken] = useState("");

    useEffect(() => {
        if (!user?.firstName && !user?.lastName) return;
        const name = `${user.firstName} ${user.lastName}`
        const fetchToken = async () => {
            try {
                const response = await fetch(`/api/livekit?room=${chatId}&username=${name}`)
                const data = await response.json()
                setToken(data.token)
            } catch (error) {
                console.log(error)
            }
        }
        fetchToken()
    }, [user?.firstName, user?.lastName, chatId])

    if (token === '') {
        return <div className="flex flex-col flex-1 justify-center items-center">
            <Loader2 className="w-7 h-7 text-zinc-500 animate-spin" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Chargement...</p>
        </div>
    }
    return (
        <LiveKitRoom
            data-lk-theme="default"
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            token={token}
            video={video}
            audio={audio}
            connect={true}
        >
            <VideoConference />
        </LiveKitRoom>
    )
}