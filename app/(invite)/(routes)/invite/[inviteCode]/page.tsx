import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { RedirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function InviteCodePage({
    params
}: {
    params: Promise<{ inviteCode: string }>
}) {

    const profile = await currentProfile()
    if (!profile) {
        return RedirectToSignIn
    }
    const { inviteCode } = await params
    if (!inviteCode) {
        return redirect('/')
    }

    const serverContainingUser = await db.server.findFirst({
        where: {
            inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })
    if (serverContainingUser) {
        return redirect(`/servers/${serverContainingUser.id}`)
    }

    const server = await db.server.update({
        where: {
            inviteCode
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id
                    }
                ]
            }
        }
    })

    if (server) {
        return redirect(`/servers/${server.id}`)
    }

    return null
}
