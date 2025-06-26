'use client'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import axios from "axios"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useParams, useRouter } from "next/navigation"
import Spinner from "../ui/spinner"
import { useModal } from "@/hooks/use-modal-store"
import { ChannelType } from "@prisma/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import qs from "query-string"
import { useEffect } from "react"

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Le nom du canal est requis"
    }).refine(name => name !== "general", {
        message: "Ce nom n'est pas disponible"
    }),
    type: z.nativeEnum(ChannelType)
})

export default function CreateChannelModal() {

    const {isOpen, onClose, type, data : {defaultChannelType}} = useModal()
    const isModalOpen = isOpen && type === "createChannel"
    const router = useRouter()
    const {serverId} = useParams()

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: ChannelType.TEXT
        }
    })

    const onSubmit = async (values : z.infer<typeof formSchema>) => {
        if (!serverId) {
            return
        }
        try {
            const url = qs.stringifyUrl({
                url: "/api/channels",
                query: {
                    serverId: serverId
                }
            })
            await axios.post(url, values)
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
        if (defaultChannelType) {
            form.setValue("type", defaultChannelType)
        }
    }, [defaultChannelType, form])

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Créer un nouveau canal
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">                          
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                        >
                                            Nom du canal
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={form.formState.isSubmitting}
                                                className="!bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Entrez un nom pour votre canal"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='type'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                        >
                                            Type
                                        </FormLabel>
                                        <Select
                                            disabled={form.formState.isSubmitting}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl className="w-full">
                                                <SelectTrigger className="!bg-zinc-300/50 border-0  focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                                                    <SelectValue placeholder="Sélectionnez un type"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(ChannelType).map((type) => (
                                                    <SelectItem key={type} value={type} className="capitalize">
                                                        {type.toLowerCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant='primary' type='submit' disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? <Spinner size="xs"/> : "Créer"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
