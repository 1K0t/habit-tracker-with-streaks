import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { JwtService } from "../auth/jwt.service";
import { MilestoneNotification } from "@habit/shared";

@WebSocketGateway({
  namespace: "/notifications",
  cors: { origin: "*" },
})
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(WsGateway.name);

  @WebSocketServer()
  server!: Server;

  private userSockets: Map<string, Set<string>> = new Map();

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      const token =
        client.handshake.auth?.token || client.handshake.query?.token;

      if (!token || typeof token !== "string") {
        this.logger.warn(`Client ${client.id} rejected: missing token`);
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyToken(token);
      const userId = payload.sub;

      (client as Socket & { userId: string }).userId = userId;

      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(client.id);
      this.logger.log(`Client connected: ${client.id} (user ${userId})`);
    } catch {
      this.logger.warn(`Client ${client.id} rejected: auth failed`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket): void {
    const userId = (client as Socket & { userId?: string }).userId;
    if (userId && this.userSockets.has(userId)) {
      this.userSockets.get(userId)!.delete(client.id);
      if (this.userSockets.get(userId)!.size === 0) {
        this.userSockets.delete(userId);
      }
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("subscribe")
  handleSubscribe(@ConnectedSocket() client: Socket): {
    event: string;
    data: { status: string };
  } {
    this.logger.debug(`Client ${client.id} subscribed`);
    return { event: "subscribed", data: { status: "ok" } };
  }

  @SubscribeMessage("ack")
  handleAck(
    @MessageBody() data: { milestoneId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    // Acknowledgement received — no further action needed
  }

  sendMilestone(userId: string, notification: MilestoneNotification): void {
    const socketIds = this.userSockets.get(userId);
    if (!socketIds) return;

    for (const socketId of socketIds) {
      this.server.to(socketId).emit("milestone", notification);
    }
  }
}
