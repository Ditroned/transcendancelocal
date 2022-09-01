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
  const [oldroom, setOldroom] = useState('1');
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
      console.log('Unregistering Events...');
      socket.off('connect');
      socket.off('onMessage');
      socket.off('connection');
    };
  }, [socket]);

  const onSubmit = () => {
    socket.emit('newMessage', value, socket.id, oldroom, room);
    setValue('');
  }

  const joinRoom = () => {
    if (room !== "") {
      console.log('jai bien join room');
      console.log(oldroom);
      //let oldroom = room;
      socket.emit("newMessage",value, socket.id, oldroom, room);
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
        value={room}
        onChange={(event) => {
          setOldroom(room);
          setRoom(event.target.value)}
        }
          
        
      />
      <button onClick={joinRoom}> Join Room</button>
        </div>
    </div>
    
  );
};