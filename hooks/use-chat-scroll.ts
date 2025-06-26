import { useEffect, useState } from "react"

interface ChatScrollProps {
    chatRef: React.RefObject<HTMLDivElement | null>,
    bottomRef: React.RefObject<HTMLDivElement | null>,
    shouldLoadMore: boolean,
    loadMore: () => void,
    count : number
}

export function useChatScroll({
    chatRef,
    bottomRef,
    shouldLoadMore,
    loadMore,
    count
}: ChatScrollProps) {
    const [hasInitialized, setHasInitialized] = useState(false)
    
    useEffect(() => {
        const topElement = chatRef?.current
        const handleScroll = () => {
            const scrollTop = topElement?.scrollTop
            if (scrollTop === 0 && shouldLoadMore) {
                loadMore()
            }
        }
        topElement?.addEventListener('scroll', handleScroll)
        return () => {
            topElement?.removeEventListener('scroll', handleScroll)
        }
    }, [shouldLoadMore, loadMore, chatRef])

    useEffect(() => {
        const bottomElement = bottomRef?.current
        const topElement = chatRef?.current

        const shouldAutoScroll = () => {
            if (!hasInitialized && bottomElement) {
                setHasInitialized(true)
                return true
            }
            if (!topElement) {
                return false
            }

            const distanceToBottom = topElement.scrollHeight - topElement.scrollTop - topElement.clientHeight
            return distanceToBottom <= 100
        }

        if (shouldAutoScroll()) {
            setTimeout(() => {
                bottomElement?.scrollIntoView({ behavior: 'smooth' })
            }, 100)
        }
    }, [count, bottomRef, chatRef, hasInitialized])

}