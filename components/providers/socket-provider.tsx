'use client'

import { createContext, useContext, useEffect, useState } from "react"
import { io as ClientIO } from "socket.io-client"

type SocketContextType = {
    socket: any | null
    isConnected: boolean
}

export const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false
})

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = useState(null)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        const socketInstance = new (ClientIO as any)(process.env.NEXT_PUBLIC_SITE_URL, {
            path: '/api/socket/io',
            addTrailingSlash: false
        })
        socketInstance.on('connect', () => {
            setIsConnected(true)
        })
        socketInstance.on('disconnect', () => {
            setIsConnected(false)
        })
        setSocket(socketInstance)
        return () => socketInstance.disconnect()
    }, [])
    return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
}

export function useSocket() {
    return useContext(SocketContext)
}