'use client'

import { Video, VideoOff } from "lucide-react"
import ActionTooltip from "../action-tooltip"
import queryString from "query-string"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

interface ChatVideoButtonProps {

}

export default function ChatVideoButton({ }: ChatVideoButtonProps) {

    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const isVideo = searchParams?.get("video");

    const toggleVideo = () => {
        const url = queryString.stringifyUrl({
            url: pathname || "",
            query: {
                video: isVideo ? undefined : true,
            }
        }, {
            skipNull: true
        })
        router.push(url);
    }
    return (
        <ActionTooltip side="bottom" label={isVideo ? "Terminer l'appel" : "Commencer un appel video"}>
            <button onClick={toggleVideo} className="hover:opacity-75 transition mr-4">
                {isVideo
                    ? <Video className="w-6 h-6 text-zinc-500 dark:text-zinc-400" />
                    : <VideoOff className="w-6 h-6 text-zinc-500 dark:text-zinc-400" />
                }
            </button>
        </ActionTooltip>
    )
}
