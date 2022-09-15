//import { Socket } from 'net';
import { IOType } from 'child_process';
import { useContext, useEffect, useState, ReactComponentElement } from 'react';
import * as React from 'react';

import { REPL_MODE_SLOPPY } from 'repl';
import { io } from 'socket.io-client';
import { Tracing } from 'trace_events';
import { StringMappingType, TypePredicateKind } from 'typescript';
import { WebsocketContext } from '../contexts/WebsocketContext';
import { setEngine } from 'crypto';
import { Server } from 'http';

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
  roomowner: Map<string,string>;
  roompassworda: Map<string,string>;
  socket : any;
  mynewroom : string;
};

export const Websocket = () => {
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const [users, setUsers] = useState<UserPayload[]>([]);
  const [listMute, setListMute] = useState<string[]>([]);
  const [listroomimmuted, setlistroomimmuted] = useState<string[]>([]);
  //const listMute : string[] = [];
  //const [RoomList, setRoomList] = useState<RoomPayload[]>([]);
  const [room, setRoom] = useState('joinroomname');
  const [oldroom, setOldroom] = useState('joinroomname');
  const socket = useContext(WebsocketContext);
  const [count, setCount] = useState(0);
  const [inputpassword, setInputpassword] = useState('');
  const [kicklist, setKickList] = useState('');
  const [dmreceiver, setDmreceiver] = useState('');
  const testlist : any = [];

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
    socket.on('forceleaveroom', (body:any) => {
      let socketid = socket.id;
      console.log('jesuisforcedeleave');
      setOldroom(room);
      setRoom('joinroomname');
      socket.emit('leavecurrentroom',{value, socketid, oldroom, room, listMute,kicklist});
  });
  
    const onLeaveCurrentRoom = () => {
      console.log(room);
      let socketid = socket.id;
      if (kicklist == socketid)
        setRoom('');
      socket.emit('leavecurrentroom',{value, socketid, oldroom, room, listMute,kicklist});
    }
    socket.on('mutedfromroom', (body:any) => {
      console.log('on essai de me mute');
      setmylistroom(body);
    });
    
    
    socket.on('roomMove', (newUser: UserPayload)  => {
      console.log(newUser);
      
      setUsers((prev) => [...prev, newUser]);
      console.log(oldroom);
      setOldroom(oldroom);
      setRoom(newUser.mynewroom);
      console.log(room);
      setValue(newUser.mynewroom);
      setRoom(newUser.mynewroom);
      joinRoom();
      //setOldroom(room);
      //setRoom(newUser.mynewroom);
      /*
      if (newUser.mynewroom === undefined)
        setRoom('');
        */
      });
      
    return () => {
      console.log('Unregistering Events...');
      socket.off('connect');
      socket.off('onMessage');
      socket.off('connection');
    };
  }, [socket,listMute]);

  const onSubmit = () => {
    let socketid = socket.id;
    console.log(listroomimmuted);
    if (value.length > 0 && listroomimmuted.indexOf(room) === -1)
      socket.emit('newMessage', {value, socketid, oldroom, room, listMute});

    setCount(count + 1);
    setValue('');
  }

  const onLeaveCurrentRoom = () => {
    console.log(room);
    let socketid = socket.id;
    if (kicklist == socketid)
      setRoom('');
    socket.emit('leavecurrentroom',{value, socketid, oldroom, room, listMute,kicklist});
  }



  const onKick = () => {
    console.log(dmreceiver);
    let socketid = socket.id;
    if (kicklist == socketid)
      setRoom('');
    socket.emit('kickevent',{value, socketid, oldroom, room, listMute,kicklist});
  }

  const onPrivatemessage = () => {
    let socketid = socket.id;
    console.log('id du destinataire ' + dmreceiver);
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

const onSetAdmin = () => {
  let socketid = socket.id;
  let selecteduser = dmreceiver;
  console.log(dmreceiver);
  console.log('jessai de setupadmin');
  if (value !== socketid){
  socket.emit('setadmin',{
    socketid,
    room,
    selecteduser
    })
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
function fonKick(body:any){
    let socketid = socket.id;
    let kicklist = body;
    if (body == socketid){
      setRoom('');
    socket.emit('kickevent',{value, socketid, oldroom, room, listMute,kicklist});}
  }

  function setmylistroom(body:string){
    const newlistroomimmuted = listroomimmuted;
    if (newlistroomimmuted.indexOf(body) === -1){
      newlistroomimmuted.push(body);
      setlistroomimmuted(newlistroomimmuted);
    }else{
      newlistroomimmuted.length === 1 ? setlistroomimmuted([]) :newlistroomimmuted.filter(elem=>elem !== body);
    }
    
    let c = listMute.length;
    //setlistroomimmuted(listroomimmuted.filter(elem => elem !== body));
    let d = listMute.length;
    //if (c === d) 
    //setlistroomimmuted(prev => listroomimmuted.push(body));
    /*
    console.log(body);
    console.log(listroomimmuted.indexOf(body));
    let b : string = body;
    if (listroomimmuted.indexOf(b) == -1)
      {
        console.log('a');
      setlistroomimmuted((prev) => [...prev, body]);}
      else{
        console.log('b');
        setlistroomimmuted(listroomimmuted.filter(elem => elem !== body));
      }
      */

  }
  function muteAsAdmin(body:any){
    console.log('try tomute as admin');
    let socketid = socket.id;
    let adminmutelist = body;
    socket.emit('muteadminevent',{value, socketid, oldroom, room, listMute,adminmutelist});}
  




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
                  {user}<input type='button' value='Mute' onClick={(e) => [(listMute.indexOf(user) === -1 ? (setListMute((prev) => [...prev,user]),clickMute()) : setListMute(listMute.filter(muted => muted != user))),console.log(listMute)]} />
                  <button onClick={(event) => [setKickList(''),setKickList(user),onLeaveCurrentRoom()]}> Leave current room</button>
                  <button value={user} onClick={(e) => {fonKick(e.currentTarget.value)}}> kick</button>
        
        
        <button onClick={joinRoom}> Play Pong</button>
        <button onClick={joinRoom}> Profile</button>
        <input
            placeholder="Private Message"
            type="text"
            value={value}
            onChange={(e) => [setValue(e.target.value),setDmreceiver(user)]}
          />
      <button onClick={() => [[setDmreceiver(user)],[onPrivatemessage()]]}> Send</button>
      <button value={user} onClick={(e) => {muteAsAdmin(e.currentTarget.value)}}> Mute as admin</button>
      <button onClick={joinRoom}> Ban as admin</button>
      <button onClick={(event) => [setDmreceiver(user),onSetAdmin()]}> Set admin</button>
      <button onClick={joinRoom}> PW change</button>
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
        <p style={{textAlign: "center"}}>
        <input
            placeholder="Room to leave"
            type="text"
            value={inputpassword}
            onChange={(e) => setInputpassword(e.target.value)}
          />
      <button onClick={joinRoom}> Leave Room</button>
      </p>
        
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
