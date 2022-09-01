import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { SocketAddress } from 'net';
import { identity } from 'rxjs';
import { Server, Socket } from 'socket.io';

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
      socket.join('1');
      console.log(socket.id);
      console.log('Connected');
      
      this.listUser.push(socket.id);
      this.server.emit('connected',{
        listUser : this.listUser
      });
      
      socket.on("disconnect", () => {
        let result : string[] = this.listUser.filter(user => user !== socket.id);
        this.listUser = result;
        this.server.emit('connected',{
          listUser : this.listUser
        });
     
      });
    });
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@ConnectedSocket() client: Socket,
  @MessageBody() body: any,
  ) {
    client.leave(body[2]);
    client.join(body[3]);
    //console.log(body);
    //console.log(this.socket.GetUidFromSocketID);
    this.server.to(body[3]).emit('onMessage', {
      msg: 'New Message',
      content: body[0],
      socketid: body[1]
    });
  }

  
  @SubscribeMessage('disconnect')
  onNewDisconnection(@ConnectedSocket() client: Socket,
  @MessageBody() body: any,
  ) {
    console.log('jesuisjmsdeconnect par cette bouclie');
    /*
    let result : string[] = [];
    result = this.listUser;
    result = this.listUser.filter(user => user !== body[0]);
    this.listUser = result;
    //this.listUser.length > 1 ? (result = this.listUser.filter(user => user !== body[0]) ) : (result = []);
    this.server.emit('connected',{
      listUser : this.listUser
    });
    console.log(this.listUser);
    //console.log(this.listUser);
    */
  }
    /*
    const result = listUser.filer(user => user !== client.socketid);
    listUser = result;
    this.server.emit('connected',{
        listUser : this.listUser
      });
    });
  }
  */
}

/*
update list array
bouton mute pm 
current room et list room
*/
