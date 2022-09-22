import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
//import { AuthService } from 'src/auth/auth.service';
//import { UserDto } from 'src/models/users/dto/user.dto';

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
        
      ) {
        //new object all room
        //new object 1room
      }

      class room: {
        private name : string;
        public constructor(name:string) {
            this.name = name;
        }
    }

      //public object all room;
      //public object room

    async myFunction(client: Socket, pwinput: String) {
        //const currentUser: UserDto | null = await this.authService.getUserFromSocket(client);     

        //if (1room.pw == pwinput)
        //  1room.userlist.push(client);
    }



}