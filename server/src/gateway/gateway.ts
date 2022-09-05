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

//public listderoom = new Map<string,Set<string>>;
//const mapaaa = new Map([['1', {'john' : 2}]]);


@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})

/*
type RoomType = {
  [id : string] : string;
};
*/

//const moupa: RoomType = {};
/*
const mapoli = new Map<string, string>();

function mapsetter(a,b){
  mapoli.set(a,b);
}
*/
//mapoli.set('a','b');

export class MyGateway implements OnModuleInit {
  public listUser : string[] = [];
  public listRoom : string[] = [];
  public listderoom = new Map<string,string>();
  
 

  //const moupa: RoomType = {};
  //const moupa: Record<string, string> = {};
  //moupa['b'] = 'x';
  //mapoli = new Map<string, string>();
  //this.mapoli.set('a', 'c') : Map<string,string>;


  //public listderoom = new Map<any,any>;
  //public listderoom = new Map([ [ '0', {}]]);
  //const [bilu, setBilu] = useState(0);
  //const map = new Map<string, string>();
  //map.set('a', 'b');
  //map.set('c', 'd');

  //mapaaa.set('a', {'john' : 2});
  //public mapaaa;
  //mapaaa = new Map([['1', {'john' : 2}]]); 
  //listderoom.set('a', 'b') : Map<string,string>();
  //this.mapaaa.set('a', {'john' : 2}) = mapaaa;
  //boulaa = this.mapaaa.set('a', {'john' : 2});

  
  //public john = {name: 'John Doe'};
  //listderoom.set('a', {'b'});
  
  
  //join
  /*
  listderoom


  listderoom.has('joinroomname') ? 
    ((listderoom.get('joinroomname').has(socket.id)) ?  null : listderoom.get('joinroomname').add(socket.id))
    :
    (listderoom.set('joinroomname').add(socket.id))

    /*
  //leave
  listderoom.has('leaveroomname') ?
    (listderoom.get('leaveroomname').has(socket.id)) ?
      (listderoom.get('leaveroomname').size() == 1) ?  listderoom.delete('leveroomname') : listderoom.get('leaveroomname').delete(socket.id)
      :
      console.log('bug leave mais pas de socket id present')
  :
  console.log('bug na pas le leaveroom')
  */

  








  @WebSocketServer()
  server: Server;
  
  //adapter = new Adapter({ server: { encoder: null } });
/*
  logMapElements(value, key, map) {
    (key === value) ? mamap.set(key,value) : (console.log('non'));
    
    console.log(`m[${key}] = ${value}`);
  }
  */


  onModuleInit() {
    let listderoom = new Map();
    listderoom.set('joinroomname', new Set<string>);
    

    

    //this.listderoom.set("1", 0);
    this.server.on('connection', (socket) => {
      
    socket.join('joinroomname');
    listderoom.has('joinroomname') ? 
      ((listderoom.get('joinroomname').has(socket.id)) ?  null : listderoom.get('joinroomname').add(socket.id))
      :
      (listderoom.set('joinroomname', socket.id))

      console.log(listderoom);
      //console.log(typeof(this.server.sockets.adapter.rooms));
      /*
      let mamap = new Map();

      function logSetElements(value1, value2, set) {
        console.log(`s[${value1}] = ${value2}`);
      }

      function logMapElements(value, key, map) {

        (key === value.values().next().value) ?
        key : (mamap.set(key,value))
        //(console.log(value.values().next().value)) : (mamap.set(key,value))
        //(value.forEach(logSetElements)) : (console.log('cunuser'))
      }

      
      this.server.sockets.adapter.rooms.forEach(logMapElements);
      console.log(mamap);
      */
     
      /*


      for (const item of this.server.sockets.adapter.rooms)
      {item[0] === item[1] ? ()};
      mamap.set(key,value)
      */
      /*
      this.server.sockets.adapter.rooms.forEach(
      {(key === value) ?
        (console.log('ptet')) : (console.log('non'))});
      console.log(this.server.sockets.adapter.rooms);
      */
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
        listderoom.has('joinroomname') ?
          (listderoom.get('joinroomname').has(socket.id)) ?
              (listderoom.get('joinroomname').size == 1) ?  
                  listderoom.delete('joinroomname') : listderoom.get('joinroomname').delete(socket.id)
                :
            console.log('bug leave mais pas de socket id present')
  :
  console.log('bug na pas le leaveroom')
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
    this.listderoom[body[2]] -= 1;
    client.join(body[3]);
    this.listderoom[body[3]] += 1;
    let mamap = new Map();
    function logMapElements(value, key, map) {

      (key === value.values().next().value) ?
      key : (mamap.set(key,value))
      //(console.log(value.values().next().value)) : (mamap.set(key,value))
      //(value.forEach(logSetElements)) : (console.log('cunuser'))
    }
    this.server.sockets.adapter.rooms.forEach(logMapElements);
    //console.log(mamap);
    let binbon = new Array<string>;

    function fillerRoom(value, key, map) {

      binbon.push(key);
      //(console.log(value.values().next().value)) : (mamap.set(key,value))
      //(value.forEach(logSetElements)) : (console.log('cunuser'))
    }

    mamap.forEach(fillerRoom);
    binbon.push()
    this.server.emit('roomMove',{
      listroom : binbon
    });
    //console.log(mamap);

    console.log(this.server.sockets.adapter.rooms.size);
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