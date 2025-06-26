import { Member, Message, Profile, Server } from "@prisma/client"
import { Server as NetServer, Socket } from "net"
import { Socket as SocketIOServer } from "socket.io"
import { NextApiResponse } from "next"

export type ServerWithMembersWithProfiles = Server & {
    members: (Member & {
        profile: Profile
    })[]
}

export type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
}

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server : NetServer & {
            io : SocketIOServer
        }
    }
}