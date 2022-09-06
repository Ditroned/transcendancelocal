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


type UserPayload = {
  delvalue: string;
  socketid: string;
  oldroom : string;
  room : any;
  Ulistroom : string[];
};


@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})


export class MyGateway implements OnModuleInit {
  public listUserr : string[] = [];
  public listRoom : string[] = [];
  abc = this.listRoom;

  @WebSocketServer()
  server: Server;
  

  onModuleInit() {
    let maproom = new Map();
    maproom.set('joinroomname', new Set<string>);
    
    this.server.on('connection', (socket) => {
 
      
    socket.join('joinroomname');

    maproom.has('joinroomname') ? 
      ((maproom.get('joinroomname').has(socket.id)) ?  null : maproom.get('joinroomname').add(socket.id))
      :
      (maproom.set('joinroomname', [socket.id]))


      //console.log(maproom);
      console.log(socket.id);
      console.log('Connected');
      
      this.listUserr.push(socket.id);
      for (var i = 0; i < this.listRoom.length;i++) {
        this.listRoom.pop
      }
      for (let key of maproom.keys()) {
        this.listRoom.lastIndexOf(key) === -1 ? this.listRoom.push(key) : null;
    }

    console.log(this.listRoom);

      this.server.emit('connected',{
        listUser : this.listUserr,
        roomlist : this.listRoom
      });
      
      //console.log(maproom);
      socket.on("joinRoom", (userinfo: UserPayload) => {
        //console.log(userinfo.room);
        
        maproom.has(userinfo.room) ? 
          ((maproom.get(userinfo.room).has(socket.id)) ?  null : maproom.get(userinfo.room).add(socket.id))
          :
          (maproom.set(userinfo.room,new Set<string>),maproom.get(userinfo.room).add(socket.id))
        
        //console.log('essaidejoinroom');
        //console.log(userinfo.room);
        for (let key of maproom.keys()) {
          this.listRoom.lastIndexOf(key) === -1 ? this.listRoom.push(key) : null;
      }
      this.server.sockets.socketsJoin('abc');
      console.log(userinfo.oldroom);
      socket.join(userinfo.room);
      socket.leave(userinfo.oldroom);
        
       //console.log(maproom);
       this.server.emit('roomMove',{
        listUser : this.listUserr,
        roomlist : this.listRoom
    });

      });
      




      socket.on("disconnect", () => {
        let result : string[] = this.listUserr.filter(user => user !== socket.id);
        this.listUserr = result;
        /*
        maproom.has('joinroomname') ?
          (maproom.get('joinroomname').has(socket.id)) ?
              (maproom.get('joinroomname').size == 1) ?  
                  maproom.delete('joinroomname') : maproom.get('joinroomname').delete(socket.id)
                :
            console.log('bug leave mais pas de socket id present')
  :
  console.log('bug na pas le leaveroom')
  */
  //console.log(maproom);
  //console.log(this.listRoom);
        this.server.emit('connected',{
          listUser : this.listUserr,
          roomlist : this.listRoom
        });
     
      });
    });
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@ConnectedSocket() client: Socket,
  @MessageBody() body: any,
  ) {
    //console.log(body[body.length - 1]);
    this.server.to(body[body.length - 1]).emit('onMessage', {
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
    
    client.leave(body[body.length - 2]);
    //this.maproom[body[2]] -= 1;
    client.join(body[body.length - 1]);
    //this.maproom[body[3]] += 1;
    for (var i = 0; i < this.listRoom.length;i++) {
      this.listRoom.pop
    }
    /*
    for (let key of maproom.keys()) {
      this.listRoom.lastIndexOf(key) === -1 ? this.listRoom.push(key) : null;
  }
  */
    //console.log(this.listRoom);
    
    /*
    this.maproom.has(body[3]) ? 
      ((this.maproom.get(body[3]).has(body[1])) ?  null :  this.maproom.get(body[3]).add(body[1]))
      :
      ( this.maproom.set(body[3], body[1]))

      console.log( this.maproom);
      */
    
    
    
    let mamap = new Map();





    function logMapElements(value, key, map) {

      (key === value.values().next().value) ?
      key : (mamap.set(key,value))
      //(console.log(value.values().next().value)) : (mamap.set(key,value))
      //(value.forEach(logSetElements)) : (console.log('cunuser'))
    }
    console.log(this.listRoom);

    /*
    this.server.emit('roomMove',{
      listroom : this.listRoom
    });
    */
  }

  @SubscribeMessage("disconnect")
  onNewDisconnection(@ConnectedSocket() client: Socket,
  @MessageBody() body: any,
  ) {
    console.log('jesuisjmsdeconnect par cette bouclie');
  }
}