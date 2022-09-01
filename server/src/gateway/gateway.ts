import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import { SocketAddress } from 'net';
import { identity } from 'rxjs';
import { Server } from 'socket.io';



@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class MyGateway implements OnModuleInit {
  public listUser : string[] = [];

  @WebSocketServer()
  server: Server;


  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Connected');
      this.listUser.push(socket.id);
      this.server.emit('connected',{
        listUser : this.listUser
      });
      //console.log(this.users);
      //const uid = this.server.GetUidFromSocketID(socket.id);
      //private users = socket.id;
      //console.log(users);
    });
  }


  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any,
  @ConnectedSocket() client: Socket,
  ) {
    console.log(body);
    //client: WebSocket;
    //console.log(WebSocket.OPEN);
    //console.log(this.socket.GetUidFromSocketID);
    this.server.emit('onMessage', {
      msg: 'New Message',
      content: body[0],
      socketid: body[1]
      //balon: 'this.users'
      //yourid: this.server.sockets,
    });
  }
}
