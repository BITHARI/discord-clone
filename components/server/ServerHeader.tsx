'use client'

import { ServerWithMembersWithProfiles } from "@/types"
import { MemberRole } from "@prisma/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react"
import { useModal } from "@/hooks/use-modal-store"

interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles,
    role: MemberRole
}

export default function ServerHeader({ server, role }: ServerHeaderProps) {
    const {onOpen} = useModal()
    const isAdmin = role === MemberRole.ADMIN
    const isModerator = isAdmin || role === MemberRole.MODERATOR

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none" asChild>
                <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
                    {server.name}
                    <ChevronDown className="h-5 w-5 ml-auto" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px] bg-zinc-200 dark:bg-zinc-700 py-1.5">
                {isModerator && (
                    <DropdownMenuItem
                        onClick={() => onOpen("invite", {server})}
                        className="px-3 py-2 text-sm">
                        Inviter un membre <UserPlus className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => { }}
                        className="px-3 py-2 text-sm">
                        Paramètres du serveur <Settings className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isModerator && (
                    <>
                        <DropdownMenuItem
                            onClick={() => { }}
                            className="px-3 py-2 text-sm">
                            Gérer les membres <Users className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => { }}
                            className="px-3 py-2 text-sm">
                            Ajouter un canal <PlusCircle className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    </>
                )}
                {isModerator && (
                    <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-700"/>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => { }}
                        className="px-3 py-2 text-rose-600 dark:text-rose-400 text-sm cursor-pointer">
                        Supprimer le serveur <Trash className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {!isAdmin && (
                    <DropdownMenuItem
                        onClick={() => { }}
                        className="px-3 py-2 text-rose-600 dark:text-rose-400 text-sm cursor-pointer">
                        Quitter le serveur <LogOut className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
