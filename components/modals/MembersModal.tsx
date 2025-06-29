'use client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { useModal } from "@/hooks/use-modal-store"
import qs from "query-string"
import { Check, Copy, Gavel, Loader2, MoreVertical, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react"
import { ServerWithMembersWithProfiles } from "@/types"
import { ScrollArea } from "../ui/scroll-area"
import UserAvatar from "../user-avatar"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { MemberRole } from "@prisma/client"
import axios from "axios"
import { useRouter } from "next/navigation"

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
    "ADMIN": <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />
}

export default function MembersModal() {
    const [loadingId, setLoadingId] = useState('')
    const router = useRouter()
    const { isOpen, onClose, onOpen, type, data } = useModal()
    const { server } = data as { server: ServerWithMembersWithProfiles }
    const isModalOpen = isOpen && type === "members"

    const handleRoleChange = async (memberId: string, role: MemberRole) => {
        setLoadingId(memberId)
        try {
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id
                }
            })
            const response = await axios.patch(url, { role })
            router.refresh()
            onOpen("members", { server: response.data })
        } catch (err: any) {
            console.log(err)
        } finally {
            setLoadingId("")
        }
    }

    const handleRemove = async (memberId: string) => {
        setLoadingId(memberId)
        try {
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id
                }
            })
            const response = await axios.delete(url)
            router.refresh()
            onOpen("members", { server: response.data })
        } catch (err: any) {
            console.log(err)
        } finally {
            setLoadingId("")
        }
    }

    if (!server) {
        return null
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Gérer les membres
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        {server?.members?.length} membre{server?.members?.length === 1 ? "" : "s"}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="mt-8 max-h-[420px] pr-6">
                    {server?.members?.map(member => {
                        return <div key={member.id} className="flex items-center gap-x-2 mb-6">
                            <UserAvatar src={member.profile.imageUrl} />
                            <div className="flex flex-col gap-y-1">
                                <div className="text-xs-font-semibold flex items-center gap-x-1">
                                    {member.profile.name}
                                    {roleIconMap[member.role]}
                                </div>
                                <p className="text-xs text-zinc-500">
                                    {member.profile.email}
                                </p>
                            </div>
                            <div className="ml-auto">
                                {server.profileId !== member.profileId && loadingId !== member.id && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <MoreVertical className="h-4 w-4 text-zinc-500" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side="left">
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger className="flex items-center">
                                                    <ShieldQuestion className="w-4 h-4 mr-2" />
                                                    <span>Role</span>
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'GUEST')}>
                                                            <ShieldCheck className="w-4 h-4 mr-2" />
                                                            Invité
                                                            {member.role === 'GUEST' && (
                                                                <Check className="h-4 w-4 ml-auto" />
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'MODERATOR')}>
                                                            <ShieldCheck className="w-4 h-4 mr-2" />
                                                            Modérateur
                                                            {member.role === 'MODERATOR' && (
                                                                <Check className="h-4 w-4 ml-auto" />
                                                            )}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleRemove(member.id)}>
                                                <Gavel className="h-4 w-4 mr-2" />
                                                Retirer
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                                {loadingId === member.id && (
                                    <Loader2 className="animate-spin h-4 w-4 text-zinc-500" />
                                )}
                            </div>
                        </div>
                    })}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
