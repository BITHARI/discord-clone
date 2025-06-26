'use client'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import axios from "axios"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Form, FormControl, FormField, FormItem,  FormMessage } from "../ui/form"
import { Button } from "../ui/button"
import FileUpload from "../file-upload"
import { useRouter } from "next/navigation"
import Spinner from "../ui/spinner"
import { useModal } from "@/hooks/use-modal-store"
import queryString from "query-string"

const formSchema = z.object({
    fileUrl: z.string().min(1, {
        message: "Le fichier est requis"
    })
})

export default function MessageFileModal() {

    const {isOpen, onClose, type, data : {apiUrl, query}} = useModal()
    const isModalOpen = isOpen && type === "messageFile"
    const router = useRouter()
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: ""
        }
    })

    const onSubmit = async (values : z.infer<typeof formSchema>) => {
        console.log(values)
        try {
            const url = queryString.stringifyUrl({
                url : apiUrl || "",
                query
            })
            await axios.post(url, {
                ...values,
                content: values.fileUrl
            })
            form.reset()
            router.refresh()
            handleClose()
        } catch (error) {
            console.log(error)
        }
    }

    const handleClose = () => {
        form.reset()
        onClose()
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Joindre un fichier
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Envoyer un fichier dans votre message
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                    control={form.control}
                                    name='fileUrl'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload
                                                    endpoint="messageFile"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    rounded="md"
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant='primary' type='submit' disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? <Spinner size="xs"/> : "Envoyer"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
