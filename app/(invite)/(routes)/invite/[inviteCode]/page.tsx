import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

export default async function InviteCodePage({
    params
}: {
    params: Promise<{ inviteCode: string }>
}) {
    
    const { inviteCode } = await params
    if (!inviteCode) {
        return redirect('/')
    }
    const profile = await currentProfile()
    if (!profile) {
        return redirect(`/sign-in?fallbackRedirectUrl=${encodeURIComponent(`/invite/${inviteCode}`)}`)
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
