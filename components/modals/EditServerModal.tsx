'use client'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import axios from "axios"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import FileUpload from "../file-upload"
import { useRouter } from "next/navigation"
import Spinner from "../ui/spinner"
import { useModal } from "@/hooks/use-modal-store"
import { useEffect } from "react"

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Le nom du serveur est requis"
    }),
    imageUrl: z.string().min(1, {
        message: "L'image du serveur est requise"
    })
})

export default function EditServerModal() {

    const {isOpen, onClose, type, data : {server}} = useModal()
    const isModalOpen = isOpen && type === "editServer"
    const router = useRouter()
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: ""
        }
    })

    const onSubmit = async (values : z.infer<typeof formSchema>) => {
        console.log(values)
        try {
            await axios.patch(`/api/servers/${server?.id}`, values)
            form.reset()
            router.refresh()
            onClose()
        } catch (error) {
            console.log(error)
        }
    }

    const handleClose = () => {
        form.reset()
        onClose()
    }

    useEffect(() => {
        if (server) {
            form.setValue("name", server.name)
            form.setValue("imageUrl", server.imageUrl)
        }
    }, [server, form])

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Modifier votre serveur
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Modifier les informations de votre serveur
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                    control={form.control}
                                    name='imageUrl'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload
                                                    endpoint="serverImage"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                        >
                                            Nom du serveur
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={form.formState.isSubmitting}
                                                className="!bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Entrez un nom pour votre serveur"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant='primary' type='submit' disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? <Spinner size="xs"/> : "Sauvegarder"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
