'use client'

import { UploadDropzone } from "@/lib/uploadthing"
import { FileIcon, X } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface FileUploadProps {
    endpoint: "messageFile" | "serverImage",
    value: string,
    onChange: (url?: string) => void,
    rounded?: 'sm' | 'md'
}

export default function FileUpload({
    endpoint,
    value,
    onChange,
    rounded
}: FileUploadProps) {

    const [defaultFileDisplay, setDefaultFileDisplay] = useState(false)
    
    if (value && !defaultFileDisplay) {
        return (
            <div className="relative h-32 w-32">
                <Image
                    fill
                    src={value}
                    alt="Upload"
                    className={`rounded-${rounded ? rounded : 'full'} object-cover`}
                    onError={() => setDefaultFileDisplay(true)}
                />
                <button
                    onClick={() => onChange('')}
                    type='button'
                    className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm">
                    <X className="h-3 w-3" />
                </button>
            </div>
        )
    }
    if (value && defaultFileDisplay) {
        return (
            <div className="flex w-full items-center p-2 gap-x-2 mt-2 rounded-md bg-background/10">
                <FileIcon className="h-8 w-8 fill-indigo-200 stroke-indigo-400" />
                <a href={value} target="_blank" rel="noopener noreferrer" className="text-xs text-start text-indigo-500 w-full line-clamp-1 dark:text-indigo-400  hover:underline">
                    {value.split('/').pop()}
                </a>
                <button
                    onClick={() => onChange('')}
                    type='button'
                    className="bg-rose-500 text-white p-0.5 rounded-full ml-auto shadow-sm">
                    <X className="h-3 w-3" />
                </button>
            </div>
        )
    }
    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url)
            }}
            onUploadError={(error: Error) => {
                console.log('Upload failed:', error.message)
            }}
        />
    )
}
