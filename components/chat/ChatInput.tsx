'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { Input } from "../ui/input"
import { Plus } from "lucide-react"
import queryString from "query-string"
import { useModal } from "@/hooks/use-modal-store"

interface ChatInputProps {
    apiUrl: string,
    query: Record<string, string>,
    name: string,
    type: "conversation" | "channel"
}

const formSchema = z.object({
    content: z.string().min(1),
})

export default function ChatInput({ apiUrl, query, name, type }: ChatInputProps) {
    const { onOpen } = useModal()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: ""
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = queryString.stringifyUrl({
                url: apiUrl,
                query
            })
            await axios.post(url, values)
            form.reset()
        } catch (error) {
            console.log(error)
        }
    }

    const isLoading = form.formState.isSubmitting
    return (
        <div className="relative p-4 pb-6">
            <button
                type='button'
                onClick={() => onOpen("messageFile", { apiUrl, query })}
                className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
            >
                <Plus className="h-4 w-4 text-white dark:text-[#313338]" />
            </button>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                            disabled={isLoading}
                                            className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-0 border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                            placeholder={`Envoyer un message ${type === "conversation" ? "à " : "dans #"}${name}`}
                                            {...field}
                                        />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <button type="submit" style={{ display: 'none' }} />
                </form>
            </Form >
            <div className="absolute top-7 right-8"></div>
        </div>
    )
}
