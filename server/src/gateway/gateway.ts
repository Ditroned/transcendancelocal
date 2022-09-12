import { ConsoleLogger, OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { SocketAddress } from 'net';
import { identity, map } from 'rxjs';
import { Server, Socket} from 'socket.io';


type UserPayload = {
  delvalue: string;
  socketid: string;
  oldroom : string;
  room : any;
  Ulistroom : string[];
  inputpassword : string;
  roomadmin : Map<string,string>;
  dict : Map<string,string>;
};


@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})


export class MyGateway implements OnModuleInit {
  public listUserr : string[] = [];
  public listRoom : string[] = [];
  public roomadmin : Map<string,string> = new Map<string,string>;
  public dict : Map<string,string> = new Map<string,string>;
  

  abc = this.listRoom;

  @WebSocketServer()
  server: Server;
  

  onModuleInit() {

                       /* INITALIZATION  */


    let maproom = new Map();
    maproom.set('joinroomname', new Set<string>);
    
    this.server.on('connection', (socket) => {
 
      
    socket.join('joinroomname');

    maproom.has('joinroomname') ? 
      ((maproom.get('joinroomname').has(socket.id)) ?  null : maproom.get('joinroomname').add(socket.id))
      :
      ((maproom.set('joinroomname', new Set<string>)),(maproom.get('joinroomname').add(socket.id)))

      console.log(socket.id + ' Connected');
      
      this.listUserr.push(socket.id);
      for (var i = 0; i < this.listRoom.length;i++) {
        this.listRoom.pop
      }
      for (let key of maproom.keys()) {
        this.listRoom.lastIndexOf(key) === -1 ? this.listRoom.push(key) : null;
    }

      this.server.emit('connected',{
        listUser : this.listUserr,
        roomlist : this.listRoom,
        dict : this.dict,
        roomadmin : this.roomadmin
      });





                           /*********************** JOIN ROOM  ************************/
      

      socket.on("joinRoom", (userinfo: UserPayload) => {

        maproom.has(userinfo.room) ? 
          (this.dict.get(userinfo.room) === userinfo.inputpassword) ?


            maproom.has(userinfo.room) ? 
          ((maproom.get(userinfo.room).has(socket.id)) ?  null : maproom.get(userinfo.room).add(socket.id))
          :
          (maproom.set(userinfo.room,new Set<string>),maproom.get(userinfo.room).add(socket.id))

          :

          console.log('mauvais password')

          :

          maproom.has(userinfo.room) ? 
          ((maproom.get(userinfo.room).has(socket.id)) ?  null : maproom.get(userinfo.room).add(socket.id))
          :
          (maproom.set(userinfo.room,new Set<string>),maproom.get(userinfo.room).add(socket.id),this.dict.set(userinfo.room,userinfo.inputpassword),this.roomadmin.set(userinfo.room,socket.id))
        

        for (let key of maproom.keys()) {
          this.listRoom.lastIndexOf(key) === -1 ? this.listRoom.push(key) : null;
      }
      socket.join(userinfo.room);
      socket.leave(userinfo.oldroom);
       let babar = new Map();
       babar = this.dict;
       this.server.emit('roomMove',{
        listUser : this.listUserr,
        roomlist : this.listRoom,
        dicta : this.dict,
        roomadmin : this.roomadmin
    });
      });


                        /*********************** KICK EVENT  ************************/




      socket.on("kickevent" ,(body:any) =>{
        console.log(body.socketid);
        console.log(this.roomadmin);
        console.log(this.dict);

        this.roomadmin.get(body.room) === body.socketid ? body.socketid === body.kicklist ? null :
                                                        (maproom.get(body.room).delete(body.kicklist))
                                                                : console.log('pas de droit administrateur')
                                                                console.log(maproom);

      });

      

                 /*********************** DISCONNECT  ************************/


      socket.on("disconnect", () => {
        let result : string[] = this.listUserr.filter(user => user !== socket.id);
        this.listUserr = result;



        function leaveChannel(value, key, map) {
          maproom.has(key) ?
          (maproom.get(key).has(socket.id)) ?
              (maproom.get(key).size == 1) ?  
                  maproom.delete(key) : maproom.get(key).delete(socket.id)
                :
            console.log('bug leave mais pas de socket id present')
  :
  console.log('bug na pas le leaveroom')
        }
        maproom.forEach(leaveChannel);


        /* + 5 car sinon pop bug ... */
        for (var i = 0; i < this.listRoom.length + 5;i++) {
          this.listRoom.pop()
        }
        for (let key of maproom.keys()) {
          this.listRoom.lastIndexOf(key) === -1 ? this.listRoom.push(key) : null;
      }

      function eraseadmin(value,key,map){
        value === socket.id ? 
        map.delete(key) 
        : null
      }
      this.roomadmin.forEach(eraseadmin);

      function eraseroompassword(value,key,map){
        maproom.has(key) ? null : map.delete(key)
      }
      this.dict.forEach(eraseroompassword);

      console.log(maproom);
      console.log(this.roomadmin);
      console.log(this.dict);


        this.server.emit('connected',{
          listUser : this.listUserr,
          roomlist : this.listRoom,
          dict : this.dict,
          roomadmin : this.roomadmin
        });
     
      });
    });
  }

                              /* newMESSAGE  */

  @SubscribeMessage('newMessage')
  onNewMessage(@ConnectedSocket() client: Socket,
  @MessageBody() body: any,
  ) {
    this.server.to(body[body.length - 2]).emit('onMessage', {
      msg: 'New Message',
      content: body[0],
      socketid: body[1],
    });
  }


  @SubscribeMessage('private message')
  onPrivateMessage(@ConnectedSocket() client: Socket,
  @MessageBody() body: any,
  ) {
    this.server.to(body.dmreceiver).emit('onMessage', {
      msg: 'New Message',
      content: body.value,
      socketid: body.socketid,
    });
    console.log(body.dmreceiver);
  }

                            /* joinRoom  */
                            

  @SubscribeMessage('joinRoom')
  onJoinRoom(@ConnectedSocket() client: Socket,
  @MessageBody() body: any,
  ) {
    
    client.leave(body[body.length - 2]);
    client.join(body[body.length - 1]);
    for (var i = 0; i < this.listRoom.length;i++) {
      this.listRoom.pop
    }
    
    let mamap = new Map();

    function logMapElements(value, key, map) {

      (key === value.values().next().value) ?
      key : (mamap.set(key,value))
    }
  }
  
}
