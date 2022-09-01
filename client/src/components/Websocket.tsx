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
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const [users, setUsers] = useState<UserPayload[]>([]);
  const [room, setRoom] = useState('1');
  const socket = useContext(WebsocketContext);

  useEffect(() => {
    socket.on('connection', (room: string) => {
      console.log('Connected!');
    });
    socket.on('connected', (newUser: UserPayload) => {
      setUsers((prev) => [...prev, newUser]);
    });
    socket.on('onMessage', (newMessage: MessagePayload) => {
      console.log('onMessage event received!');
      setMessages((prev) => [...prev, newMessage]);
    });

    
    return () => {
      //const words = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present'];

//const words = users.[users.length - 1].listUser;
//const result = words.filter(word => word.length > 6);
//const resu = results.filter(result.length > 6)

    //console.log(users[users.length - 1]);
    //users[users.length - 1].listUser.map((user) => (console.log(user)));
      //users.forEach(element => console.log(element));
      //let result = users[users.length - 1].listUser;
      //socket.emit('disconnected', result);

      //socket.on('disconnected', (newUser: UserPayload) => {
      //  users.find(newUser.socketid)

        //console.log('i am disconected');
    
      console.log('Unregistering Events...');
      users.length === 0 ? (console.log('oui')) : (console.log('non'));
      //console.log(users[0].listUser);
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
      socket.emit('disconection', socket.id);
      socket.off('connect');
      socket.off('onMessage');
      socket.off('connection');
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
      socket.emit("join_room", socket.id, room, setRoom(room));
      console.log(room);
    }
  };

  return (
    <div>
      <div>
        <h6>This is my beautiful chat , your id is {socket.id} </h6>
        <div>
          {messages.length === 0 ? (
            <div>No Messages</div>
          ) : (
            <div>
              {messages.map((msg) => (
                <div>
                  {msg.socketid} : {msg.content}
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
        <h5 style={{textAlign: "center"}}>list utilisateur</h5>
        <p style={{textAlign: "center"}}>
        
                {users[0] == null ? (
                  <div></div>
                ) : (
            
                <div>
                  {users[users.length - 1].listUser.map((user) => (
                    <div>
                  {user}
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
          setRoom(event.target.value);
        }}
      />
      <button onClick={joinRoom}> Join Room</button>
        </div>
    </div>
    
  );
};