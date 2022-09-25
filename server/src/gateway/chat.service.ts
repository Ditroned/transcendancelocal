import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
//import { AuthService } from 'src/auth/auth.service';
//import { UserDto } from 'src/models/users/dto/user.dto';

type roomType = {
  roomName : string;
  owner : string;
  admin : Set<string>;
  password : string;
  userSet : Set<string>;
  mutedMap : Map<string,number>;
  banMap : Map<string,number>;
};

let listRoom : Array<roomType> = [];

@Injectable()
export class ChatService {

    constructor(
        /*
        private authService: AuthService,
        @InjectRepository(Games) private gamesRepository: Repository<Games>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(GamePlayer) private gamePlayerRepository: Repository<GamePlayer>,
        private dataSource: DataSource,
        */
        
      ) {}

      // UTILS    
    addRoomToList(roomObject : roomType, listRoom : Array<roomType>)
    {
      listRoom.push(roomObject);
    }

    getLaRoom(name :string, mylist : Array<roomType>)
    {
      return (mylist.find(room => (room.roomName === name)));
    }

    async leaveRoomEraseSocket(room,roomowner,roomadmin,roompassword,maproom,socketid,socket,server,listRoom,listUserr){
            
      roomowner.get(room) === socketid ? roomowner.delete(room) : null
      maproom.has(room) ? (maproom.get(room).forEach(elem => { if (elem === socketid) {maproom.get(room).delete(socketid);}})) : null;
      maproom.has(room) ? (maproom.get(room).size > 0 ? null : (maproom.delete(room),roompassword.delete(room),roomadmin.delete(room))) : null;
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



}