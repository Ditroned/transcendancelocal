//import { Socket } from 'net';
import { IOType } from 'child_process';
import { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { TypePredicateKind } from 'typescript';
import { WebsocketContext } from '../contexts/WebsocketContext';

type MessagePayload = {
  content: string;
  msg: string;
  allid: string[];
  socketid: string;
};

type UserPayload = {
  socketid: string;
  nickname: string;
  listUser : string[];
  socket : any;
};


export const Websocket = () => {

  //const [room, setRoom] = useState("");
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const [users, setUsers] = useState<UserPayload[]>([]);
  
  //const [usersss, setUsersss] = useState([]);
  const [room, setRoom] = useState('1');
  const socket = useContext(WebsocketContext);
  //let locallist;


  useEffect(() => {
    
    //check ok connected
    socket.on('connection', (room: string) => {
      console.log('Connected!');
    });

    //update list user
    socket.on('connected', (newUser: UserPayload) => {
      setUsers((prev) => [...prev, newUser]);
    });

    //update affichage message chat
    socket.on('onMessage', (newMessage: MessagePayload) => {
      console.log('onMessage event received!');
      //to do: si le socket est mute on ne fait rien
      //console.log(newMessage);
      setMessages((prev) => [...prev, newMessage]);
    });

    
    return () => {
      console.log('Unregistering Events...');
      //listUsers -= currentsocket
      /*
      function newlistuser(arr_values:string[]) {
        locallist = [];
        for(let i = 0;i<arr_values.length;i++) {
          if (arr_values[i] !== socket.id)
          {
            locallist.push(arr_values[i]);
          }

        }
      }
      newlistuser(users[users.length - 1].listUser);
      */
      //users[users.length - 1].listUser;
      //emmit new list user
      socket.off('connect');
      socket.off('onMessage');
    };
  }, [socket]);

  const onSubmit = () => {
    socket.emit('newMessage', value, socket.id, room);//le body du message envoyer au serv
    setValue('');//reset de value
  }

  const joinRoom = () => {
    if (room !== "") {
      console.log('jai bien join room');
      console.log(room);
      //setRoom(room);
      socket.emit("join_room", socket.id, room);
    }
  };

  return (
    <div>
      <div>
        <h1>This is my beautiful chat , your id is {socket.id} </h1>
        <div>
          {messages.length === 0 ? (
            <div>No Messages</div>
          ) : (
            <div>
              {messages.map((msg) => (
                <div>
                  <p>{msg.content[1]} : {msg.content[0]}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
        <h2 style={{textAlign: "center"}}>list utilisateur</h2>
        <p style={{textAlign: "center"}}>
        
                {users[0] == null ? (
                  <div></div>
                ) : (
            
                <div>
                  {users[users.length - 1].listUser.map((user) => (
                    <div>
                  <p>{user}</p>
                    </div>            
                  ))}   
                </div>
                )}
        </p>
                
        
      </div>
        <div>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button onClick={onSubmit}>Submit</button>
        </div>
      </div>
      <div className="App">
      <input
        placeholder="Room Number..."
        onChange={(event) => {
          //setRoom(event.target.value);
          //socket.io.socket.join("room");
          //setRoom(event.target.value);
          //console.log(event.target.value);
        }}
      />
      <button onClick={joinRoom}> Join Room</button>
        </div>
    </div>
    
  );
};