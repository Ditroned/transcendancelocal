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
import { Server, Socket} from 'socket.io';
//const { Adapter } = require("..");




@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class MyGateway implements OnModuleInit {
  public listUser : string[] = [];
  public listRoom : string[] = [];

  @WebSocketServer()
  server: Server;
  
  //adapter = new Adapter({ server: { encoder: null } });


  onModuleInit() {
    this.server.on('connection', (socket) => {
      
      socket.join('1');
      //this.server.ro
      //this.server.adapter.rooms
      console.log(socket.id);
      console.log('Connected');
      
      this.listUser.push(socket.id);
      this.server.emit('connected',{
        listUser : this.listUser
      });
      //console.log(socket.rooms);
      
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
    this.server.to(body[3]).emit('onMessage', {
      msg: 'New Message',
      content: body[0],
      socketid: body[1]
    });
    //console.log(this.server.allSockets);
  }

  @SubscribeMessage('joinRoom')
  onJoinRoom(@ConnectedSocket() client: Socket,
  @MessageBody() body: any,
  ) {
    
    client.leave(body[2]);
    client.join(body[3]);
    //console.log(this.server.sockets.adapter.rooms.size);
  }

  
  @SubscribeMessage('disconnect')
  onNewDisconnection(@ConnectedSocket() client: Socket,
  @MessageBody() body: any,
  ) {
    console.log('jesuisjmsdeconnect par cette bouclie');
  }
}

/*
update list array
bouton mute pm 
current room et list room
*/

/*
let rooms = {}
io.of('/test').on('connection', (socket) => {
    console.log('Connected', socket.id);

    socket.on("joinRoom", ({ username, room, password }) => {
        let isEntryAvailable = userJoin(socket.id, username, room, password);
        if (isEntryAvailable) {
            socket.emit('passwordFeedback', 'correct')
        } else {
            socket.emit('passwordFeedback', 'wrong')
        }
    })
    
    socket.on('disconnect', () => {
        io.of('/test').emit('message', 'user disconnected '+ socket.id);
        if (rooms[rooms[socket.id]] && Object.keys(rooms[rooms[socket.id]]).length == 2) {
            delete rooms[rooms[socket.id]];
        } else {
            if (rooms[rooms[socket.id]] && rooms[rooms[socket.id]][socket.id]) {
                delete rooms[rooms[socket.id]][socket.id];
            }
        }
        delete rooms[socket.id];
        console.log('Disonnected', socket.id);
        console.log(rooms);
    })

    function userJoin (socketId, username, room, password) {
        if (!rooms[room] || (rooms[room] && !rooms[room].password)) {
            if (!rooms[room]) {
                rooms[room] = {};
            }
            rooms[room].password = password;
            rooms[room][socketId] = username;
            rooms[socketId] = room;
            return true;
        } else {
            if (rooms[room].password == password) {
                rooms[socketId] = room;
                rooms[room][socketId] = username;
                socket.join(room);
                return true;
            } else {
                return false;
            }
        }
    }
})
*/