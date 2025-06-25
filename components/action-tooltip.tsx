import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

interface ActionTooltipProps {
    label: string
    children: React.ReactNode,
    delayDuration?: number
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
}

export default function ActionTooltip({
    children,
    label,
    delayDuration = 50,
    side,
    align
}: ActionTooltipProps) {
    return <TooltipProvider>
        <Tooltip delayDuration={delayDuration}>
            <TooltipTrigger>
                {children}
            </TooltipTrigger>
            <TooltipContent side={side} align={align}>
                <p className="font-semibold text-sm capitalize">{label}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
}
