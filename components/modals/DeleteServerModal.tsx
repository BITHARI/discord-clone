'use client'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { useModal } from "@/hooks/use-modal-store"
import { Button } from "../ui/button"
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Spinner from "../ui/spinner"

export default function DeleteServerModal() {

    const { isOpen, onClose, type, data: { server } } = useModal()
    const isModalOpen = isOpen && type === "deleteServer"
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleLeave = async () => {
        if (!server) {
            return
        }
        setIsLoading(true)
        try {
            await axios.delete(`/api/servers/${server?.id}`)
            onClose()
            router.refresh()
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Supprimer
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        <p>
                            Êtes-vous sûr de vouloir continuer?<br />
                            Le serveur <span className="font-semibold text-indigo-500">{server?.name}</span> sera supprimé définitivement.
                        </p>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-end gap-x-2 w-full">
                        <Button disabled={isLoading} onClick={onClose} variant="ghost">
                            Annuler
                        </Button>
                        <Button disabled={isLoading} onClick={handleLeave} variant="primary">
                            {isLoading ? <Spinner size="xs" /> : "Supprimer le serveur"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
