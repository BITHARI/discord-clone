'use client'

import { useSocket } from './providers/socket-provider'
import { Badge } from './ui/badge'
import Spinner from './ui/spinner'

export default function SocketIndicator() {

    const { isConnected } = useSocket()

    if (!isConnected) {
        return (
            <Badge variant="outline" className='bg-yellow-600 text-white border-none'><Spinner size='2xs' className='m-1'/></Badge>
        )
    }
    return (
        <Badge variant="outline" className='bg-emerald-600 text-white border-none'>Live</Badge>
    )
}
