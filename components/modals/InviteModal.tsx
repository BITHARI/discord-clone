'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { useModal } from "@/hooks/use-modal-store"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Check, Copy, RefreshCcw } from "lucide-react"
import { useOrigin } from "@/hooks/use-origin"
import { useState } from "react"
import axios from "axios"
import Spinner from "../ui/spinner"

export default function InviteModal() {

    const { isOpen, onClose, onOpen, type, data: { server } } = useModal()
    const isModalOpen = isOpen && type === "invite"
    const origin = useOrigin()
    const inviteUrl = `${origin}/invite/${server?.inviteCode}`
    const [copied, setCopied] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteUrl)
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 2000)
    }

    const handleGenerate = async () => {
        setLoading(true)
        try {
            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`)
            onOpen("invite", { server: response.data })
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Inviter des amis
                    </DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">Lien d'invitation au serveur</Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input className="!bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" readOnly value={inviteUrl} />
                        <Button size="icon" onClick={handleCopy} disabled={loading}>
                            {copied
                                ? <Check className="h-4 w-4" />
                                : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                    <Button variant='link' size='sm' className="text-xs text-zinc-500 mt-4" disabled={loading} onClick={handleGenerate}>
                        Générer un nouveau lien{loading? <Spinner size='xs' className="ml-2"/> : <RefreshCcw className="h-4 w-4 ml-2" />}</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
