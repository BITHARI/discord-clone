'use client'

import { Search } from "lucide-react"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

interface ServerSearchProps {
    data: {
        label: string,
        type: "channel" | "member",
        data: {
            icon: React.ReactNode,
            name: string,
            id: string
        }[] | undefined
    }[]
}

export default function ServerSearch({ data }: ServerSearchProps) {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const params = useParams()

    const handleNavigateToSelection = ({id, type}: {id: string, type: "channel" | "member"}) => {
        if (!params?.serverId) return
        setOpen(false)
        if (type === "channel") {
            return router.push(`/servers/${params?.serverId}/conversations/${id}`)
        }
        if (type === "member") {
            return router.push(`/servers/${params?.serverId}/conversations/${id}`)
        }
    }

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen(true)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])
    return <>
        <button
            onClick={() => setOpen(true)}
            className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
            <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
                Rechercher
            </p>
            <kbd className="pointer-events-none inline-flex h-5select-none items-center gap-1 rounded border bg-muted px-1.5 py-1 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
                <span className="text-xs">CTRL</span>K
            </kbd>
        </button>
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Rechercher..." />
            <CommandList>
                <CommandEmpty>Aucun résultat</CommandEmpty>
                {data.map(section => {
                    if (!section?.data?.length) return null
                    return <CommandGroup key={section.label} heading={section.label}>
                        {section.data?.map(command => (
                            <CommandItem key={command.id} onClick={() => handleNavigateToSelection({id: command.id, type: section.type})}>
                                {command.icon}
                                <span>{command.name}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                })}
            </CommandList>
        </CommandDialog>
    </>
}
