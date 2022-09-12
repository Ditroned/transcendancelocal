//import { Socket } from 'net';
import { IOType } from 'child_process';
import { useContext, useEffect, useState, ReactComponentElement } from 'react';
import * as React from 'react';

import { REPL_MODE_SLOPPY } from 'repl';
import { io } from 'socket.io-client';
import { Tracing } from 'trace_events';
import { StringMappingType, TypePredicateKind } from 'typescript';
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
  roomadmin: Map<string,string>;
  dicta: Map<string,string>;
  socket : any;
};

export const Websocket = () => {
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const [users, setUsers] = useState<UserPayload[]>([]);
  const [listMute, setListMute] = useState<string[]>([]);
  //const listMute : string[] = [];
  //const [RoomList, setRoomList] = useState<RoomPayload[]>([]);
  const [room, setRoom] = useState('joinroomname');
  const [oldroom, setOldroom] = useState('joinroomname');
  const socket = useContext(WebsocketContext);
  const [count, setCount] = useState(0);
  const [inputpassword, setInputpassword] = useState('');
  const [kicklist, setKickList] = useState('');
  const [dmreceiver, setDmreceiver] = useState('');

  const listderoom = useState(new Map<string,Set<string>>);



  useEffect(() => {
    socket.on('connection', (room: string) => {
      console.log('Connected!');
      
    });
    socket.on('connected', (newUser: UserPayload) => {
      console.log(newUser);
      setUsers((prev) => [...prev, newUser]);        
    });
    socket.on('onMessage', (newMessage: MessagePayload) => {
      console.log('onMessage event received!');
      listMute.indexOf(newMessage.socketid) === -1 ? (setMessages((prev) => [...prev, newMessage])) : console.log('user mute')
    });
    
    
    socket.on('roomMove', (newUser: UserPayload)  => {
      console.log(newUser);
      setUsers((prev) => [...prev, newUser]);
      });
      
    return () => {
      console.log('Unregistering Events...');
      socket.off('connect');
      socket.off('onMessage');
      socket.off('connection');
    };
  }, [socket,listMute]);

  const onSubmit = () => {
    if (value.length > 0)
      socket.emit('newMessage', value, socket.id, oldroom, room, listMute);

    setCount(count + 1);
    setValue('');
  }

  const onKick = () => {
    console.log(room);
    let socketid = socket.id;
    socket.emit('kickevent',{value, socketid, oldroom, room, listMute,kicklist});
  }

  const onPrivatemessage = () => {
    let socketid = socket.id;
    if (value.length > 0 )
    {
    socket.emit("private message", {
      value,
      socketid,
      dmreceiver,
      oldroom,
      room,
      listMute
    })
    setValue('');
  }
};
  

  const joinRoom = () => {
    if (room !== "") {
      let mamamia = socket.id;
      let delvalue = value;
      
      socket.emit("joinRoom", {
        delvalue,
        mamamia,
        oldroom,
        room,
        inputpassword
      })

    }
  };

  const clickMute = () => {
    console.log(listMute);
    console.log(count);
  };

  function f1(){  
    alert(value);
}





  return (
   
    <div>
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
                  {user}<input type='button' value='Mute' onClick={(e) => (setListMute((prev) => [...prev,user]),clickMute())} /><button onClick={(event) => [setKickList(''),setKickList(user),onKick()]}> Kick</button>
        
        
        <button onClick={joinRoom}> Play Pong</button>
        <button onClick={joinRoom}> Profile</button>
        <input
            placeholder="Private Message"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
      <button onClick={(event) => [setDmreceiver(''),setDmreceiver(user),onPrivatemessage()]}> Send</button>
                  <div>

        
        
        
        </div>
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
    <>
    
  </>
  </div>
    
  );


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

          */}
