//import { Socket } from 'net';
import { IOType } from 'child_process';
import { useContext, useEffect, useState } from 'react';
import { REPL_MODE_SLOPPY } from 'repl';
import { io } from 'socket.io-client';
import { Tracing } from 'trace_events';
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
  roomlist: string[];
  socket : any;
};

export const Websocket = () => {
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const [users, setUsers] = useState<UserPayload[]>([]);
  //const [RoomList, setRoomList] = useState<RoomPayload[]>([]);
  const [room, setRoom] = useState('joinroomname');
  const [oldroom, setOldroom] = useState('joinroomname');
  const socket = useContext(WebsocketContext);
  const [count, setCount] = useState(0);
  const [inputpassword, setInputpassword] = useState('');

  //let listderoom = new Map<string,Set<string>>;
  const listderoom = useState(new Map<string,Set<string>>);



  useEffect(() => {
    socket.on('connection', (room: string) => {
      console.log('Connected!');
      
    });
    socket.on('connected', (newUser: UserPayload) => {
      //console.log(newUser.roomlist);
      setUsers((prev) => [...prev, newUser]);        
    });
    socket.on('onMessage', (newMessage: MessagePayload) => {
      console.log('onMessage event received!');
      setMessages((prev) => [...prev, newMessage]);
    });
    
    
    socket.on('roomMove', (newUser: UserPayload)  => {
      //console.log(newUser);
      setUsers((prev) => [...prev, newUser]);
      //newRoomMoove.room
      //listderoom = newRoomMoove.room;
      //listderoom.forEach(element => {console.log(element)
      //console.log('alors le body 0 ' + body[0]);
      //console.log(body);
      });
      
      

      //console.log(newRoomMoove);
      //setRoomList((prev) => [newRoomMoove]);

    

    return () => {
      console.log('Unregistering Events...');
      socket.off('connect');
      socket.off('onMessage');
      socket.off('connection');
    };
  }, [socket]);

  const onSubmit = () => {
    socket.emit('newMessage', value, socket.id, oldroom, room);

    setCount(count + 1);
    console.log(room);
    setValue('');
  }

  const joinRoom = () => {
    /*
    si room existe pas -> creer avec le pass donne (+ droit admin user)
    si room existe -> check password -> incorrect console log 
                                      -> correct join
    */
    if (room !== "") {
      let mamamia = socket.id;
      let delvalue = value;
      console.log(inputpassword);
      
      socket.emit("joinRoom", {
        delvalue,
        mamamia,
        oldroom,
        room,
        inputpassword
      })

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
        <h5 style={{textAlign: "center"}}>list room</h5>
        <p style={{textAlign: "center"}}>
        
                {users[0] == null ? (
                  <div></div>
                ) : (
            
                <div>
                  {users[users.length - 1].roomlist.map((room) => (
                    <div>
                  {room}
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
      <input
            placeholder="Password"
            type="text"
            value={inputpassword}
            onChange={(e) => setInputpassword(e.target.value)}
          />
      <button onClick={joinRoom}> Join Room</button>
        </div>
    </div>
    
  );
};
/*
const socket = io('http://localhost:3000/test');

socket.on('connect', () => {
    console.log('Connected', socket.id);
    socket.emit('joinRoom', { room: 'room0', username: 'name1', password: 'pass@1234' });
})

socket.on('passwordFeedback', (data) => {
    console.log(data);
})
*/

/**
<div>
        
<h5 style={{textAlign: "center"}}>list room</h5>
<p style={{textAlign: "center"}}>

        {RoomList.roomlist.length == null ? (
          <div>dsad</div>
        ) : (
    
        <div>
          {RoomList.roomlist.map((room) => (
            <div>
              {room}
              </div>
          ))}
          
        </div>
        )}
</p>
        

</div>

*/
