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

      async addRoomToList(roomObject : roomType, listRoom : Array<roomType>) : Promise<void> {
        listRoom.push(roomObject);
      }


}