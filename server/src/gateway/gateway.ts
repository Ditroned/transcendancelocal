import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket} from 'socket.io';

type UserPayload = {
  delvalue: string;
  socketid: string;
  oldroom : string;
  room : any;
  Ulistroom : string[];
  inputpassword : string;
  roomowner : Map<string,string>;
  roomadmin : Map<string,Set<string>>;
  roompassword : Map<string,string>;
};

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})

export class MyGateway implements OnModuleInit {
  public listUserr : string[] = [];
  public listRoom : string[] = [];
  public roomowner : Map<string,string> = new Map<string,string>;
  public roomadmin : Map<string,Set<string>> = new Map<string,Set<string>>;
  public roompassword : Map<string,string> = new Map<string,string>;
  
  

  abc = this.listRoom;

  @WebSocketServer()
  server: Server;
  

  onModuleInit() {

    this.roompassword.set('joinroomname','');
    
    function leaveRoomEraseSocket(room,roomowner,roomadmin,roompassword,maproom,socketid,socket,server,listRoom,listUserr){
            
            roomowner.get(room) === socketid ? roomowner.delete(room) : null
            maproom.get(room).forEach(elem => { if (elem === socketid) {maproom.get(room).delete(socketid);}});
            maproom.get(room).size > 0 ? null : (maproom.delete(room),roompassword.delete(room),roomadmin.delete(room))
            for (var i = 0; i < listRoom.length + 5;i++) 
            {
              listRoom.pop()
            }

            for (let key of maproom.keys()) 
            {
              listRoom.lastIndexOf(key) === -1 ? listRoom.push(key) : null;
            }

            server.to(socketid).emit('roomMove',{
              listUser : listUserr,
              roomlist : listRoom,
              roompassworda : roompassword,
              roomowner : roomowner,
              oldroom : room,
              mynewroom : 'joinroomname',
            });

            server.emit('connected',{
              listUser : listUserr,
              roomlist : listRoom,
              roompassword : roompassword,
              roomowner : roomowner
            });

    }


                       /* INITALIZATION  */


    let maproom = new Map();
    maproom.set('joinroomname', new Set<string>);
    this.roomadmin.set('joinroomname', new Set<string>);
    
    this.server.on('connection', (socket) => {
 
      
    socket.join('joinroomname');

    // version simplifier pour eviter le ternaire
    if (maproom.has('joinroomname'))
    {
      if (maproom.get('joinroomname').has(socket.id) === false)
      {
        maproom.get('joinroomname').add(socket.id);
      }
    }
    else
    {
      maproom.set('joinroomname', new Set<string>);
      maproom.get('joinroomname').add(socket.id);
      this.roomadmin.set('joinroomname',new Set<string>);
    }
    

    /* ancien ternaire fonctionnel
    maproom.has('joinroomname') ? 
      ((maproom.get('joinroomname').has(socket.id)) ?  null : maproom.get('joinroomname').add(socket.id))
      :
      ((maproom.set('joinroomname', new Set<string>)),(maproom.get('joinroomname').add(socket.id)),this.roomadmin.set('joinroomname',new Set<string>))
    */

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
        roompassword : this.roompassword,
        roomowner : this.roomowner
      });
      console.log(maproom);
      console.log(this.roomowner);
      console.log(this.roompassword);





                           /*********************** JOIN ROOM  ************************/
      

      socket.on("joinRoom", (userinfo: UserPayload) => {
        console.log('jetapeunefoisici');
        let success = 0;

        // version propre sans le ternaire
        if (maproom.has(userinfo.room))
        {
          if (this.roompassword.get(userinfo.room) === userinfo.inputpassword)
          {          
              if ((maproom.get(userinfo.room).has(socket.id)) === false)
              {
                console.log(socket.id + ' rentre dans la room ' + userinfo.room);
                maproom.get(userinfo.room).add(socket.id);
                socket.join(userinfo.room);
                socket.leave(userinfo.oldroom);
                success = 1;
              }
          }
          else
              console.log('mauvais password');
        }
        else
        {
            console.log(socket.id + 'rentre et devient proprietaire de la room ' + userinfo.room);
            maproom.set(userinfo.room,new Set<string>);
            maproom.get(userinfo.room).add(socket.id);
            this.roompassword.set(userinfo.room,userinfo.inputpassword);
            this.roomowner.set(userinfo.room,socket.id);
            this.roomadmin.set(userinfo.room, new Set<string>);
            socket.join(userinfo.room);
            socket.leave(userinfo.oldroom);
            success=1;
        }
        
        /* ternaire remplace par if else
        maproom.has(userinfo.room) ? 
          (this.roompassword.get(userinfo.room) === userinfo.inputpassword) ?
            maproom.has(userinfo.room) ? 
          ((maproom.get(userinfo.room).has(socket.id)) ?  null : (maproom.get(userinfo.room).add(socket.id),socket.join(userinfo.room),socket.leave(userinfo.oldroom),success=1))
          :
          (maproom.set(userinfo.room,new Set<string>),maproom.get(userinfo.room).add(socket.id),socket.join(userinfo.room),socket.leave(userinfo.oldroom),success=1)
          :
          console.log('mauvais password')
          :        
          (maproom.set(userinfo.room,new Set<string>),maproom.get(userinfo.room).add(socket.id),this.roompassword.set(userinfo.room,userinfo.inputpassword),this.roomowner.set(userinfo.room,socket.id),this.roomadmin.set(userinfo.room, new Set<string>),socket.join(userinfo.room),socket.leave(userinfo.oldroom),success=1)     
*/
        for (let key of maproom.keys()) {
          this.listRoom.lastIndexOf(key) === -1 ? this.listRoom.push(key) : null;
      }

      if (success === 1){
       socket.leave("joinroomname");
       this.server.to(socket.id).emit('roomMove',{
        listUser : this.listUserr,
        roomlist : this.listRoom,
        roompassworda : this.roompassword,
        roomowner : this.roomowner,
        mynewroom : userinfo.room,
    });
    this.server.emit('connected',{
      listUser : this.listUserr,
      roomlist : this.listRoom,
      roompassword : this.roompassword,
      roomowner : this.roomowner
    });
    console.log(maproom);
      console.log(this.roomowner);
      console.log(this.roompassword);
  }
      });


                        /*********************** KICK EVENT && LEAVE EVENT ************************/

      socket.on("leavecurrentroom" ,(body:any) =>{

            leaveRoomEraseSocket(body.room,this.roomowner,this.roomadmin,this.roompassword,maproom,body.socketid,socket,this.server,this.listRoom,this.listUserr);
            console.log(maproom);console.log(this.roomowner);console.log(this.roompassword);
            console.log('je leave la room ');
            socket.leave(body.room);
            socket.join('joinroomname');

      });

      socket.on("kickevent" ,(body:any) =>{

        let socketid = body.kicklist;

        if ( (body.kicklist !== this.roomowner.get(body.room)) 
                && ((this.roomowner.get(body.room) === body.socketid) || (this.roomadmin.get(body.room).has(body.socketid)) ))
        {      
          console.log('je kick ' + body.kicklist + 'de la room suivante ' + body.room);
          leaveRoomEraseSocket(body.room,this.roomowner,this.roomadmin,this.roompassword,maproom,socketid,socket,this.server,this.listRoom,this.listUserr);
          console.log(maproom);console.log(this.roomowner);console.log(this.roompassword);
          this.server.to(body.kicklist).emit('forceleaveroom',body.room);
          //this.server.in(body.kicklist).emit('leavecurrentroom')
          this.server.in(body.kicklist).socketsLeave(body.room);
        }
      
      });

        /*********************** BAN EVENT  ************************/

        socket.on("banevent" ,(body:any) =>{

            let socketid = body.kicklist;
            
            if (   (body.kicklist !== this.roomowner.get(body.room)) &&
                      ( (this.roomowner.get(body.room) === body.socketid) || (this.roomadmin.get(body.room).has(body.socketid)) ))
            {      

            leaveRoomEraseSocket(body.room,this.roomowner,this.roomadmin,this.roompassword,maproom,socketid,socket,this.server,this.listRoom,this.listUserr);
            console.log(maproom);console.log(this.roomowner);console.log(this.roompassword);
            this.server.to(body.kicklist).emit('forceleaveroom',body.room);
            this.server.in(body.kicklist).emit('leavecurrentroom')
            this.server.in(body.kicklist).socketsLeave(body.room);
            console.log('je ban ' + body.kicklist + 'de la room suivante ' + body.room);
            let banroom = body.room;
            const datefromban = Date.now();
            const secondfromban = 50;
            this.server.to(body.kicklist).emit('banfromserver',{banroom,datefromban,secondfromban});
        
          }
      });



        /*********************** SET ADMIN EVENT  ************************/


        socket.on("setadmin" ,(body:any) =>{   
              if ((this.roomowner.get(body.room) === body.socketid) && (body.socketid !== body.selecteduser))
              {
                        if (this.roomadmin.has(body.room))
                        {
                                      if (this.roomadmin.get(body.room).has(body.selecteduser))
                                      {
                                          this.roomadmin.get(body.room).delete(body.selecteduser);
                                          console.log('delete admin');                                       
                                      }
                                      else
                                      {
                                        this.roomadmin.get(body.room).add(body.selecteduser);
                                        console.log('add admin');
                                      }
                        }
                        else
                        {
                          let adminname = new Set<string>;
                          adminname.add(body.selecteduser);
                          this.roomadmin.set(body.room,adminname);
                        }
              }
              console.log(this.roomadmin);
        });


                  /*********************** SET ADMIN MUTE EVENT  ************************/


                  socket.on("muteadminevent" ,(body:any) =>{   
                    
                    if ( (body.adminmutelist !== this.roomowner.get(body.room)) 
                            && ( (this.roomowner.get(body.room) === body.socketid) || (this.roomadmin.get(body.room).has(body.socketid)) ))
                    {   
                      let tempdemute = 30;
                      console.log('je veux mute' + body.adminmutelist);
                      let room =body.room;
                      this.server.to(body.adminmutelist).emit('mutedfromroom',{room,tempdemute});
                    }
                    });

                    /*********************** CHANGE PASSWORD  ************************/

                    socket.on('changepw', (body:any) =>{
                      if (this.roomowner.get(body.room) == body.socketid)
                      {
                        this.roompassword.set(body.room,body.newpw);
                      }
                      else
                      {
                        console.log('No Admin rights to change Password');
                      }
                    });



                 /*********************** DISCONNECT  ************************/


      socket.on("disconnect", () => {
        /*             

                    tout le clean dans cette fonction est inutile car chaque leave de channel est manuel selon l'ennonce
        */

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
      this.roomowner.forEach(eraseadmin);

      function eraseroompassword(value,key,map){
        maproom.has(key) ? null : map.delete(key)
      }
      this.roompassword.forEach(eraseroompassword);




        this.server.emit('connected',{
          listUser : this.listUserr,
          roomlist : this.listRoom,
          roompassword : this.roompassword,
          roomowner : this.roomowner
        });
     
      });
    });
  }

                              /* newMESSAGE  */

  @SubscribeMessage('newMessage')
  onNewMessage(@ConnectedSocket() client: Socket,
  @MessageBody() body: any,
  ) {
    console.log(body.room);
    client.join(body.room);
    this.server.to(body.room).emit('onMessage', {
      msg: 'New Message',
      content: body.value,
      socketid: body.socketid,
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
    /*
    client.leave(body.oldroom);
    client.join(body.room);
    for (var i = 0; i < this.listRoom.length;i++) {
      this.listRoom.pop
    }
    
    let mamap = new Map();

    function logMapElements(value, key, map) {

      (key === value.values().next().value) ?
      key : (mamap.set(key,value))
    }
    */
  }
  
  
}
