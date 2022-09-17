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
  const [bantime, setbantime] = useState(0);
  const testlist : any = [];
  const [listroomimban, setlistroomimban] = useState<string[]>([]);

  const listderoom = useState(new Map<string,Set<string>>);
  const [storebantemp, setstorebantemp] = useState<Map<any,any>>(new Map());
  const [storemutetemp, setstoremutetemp] = useState<Map<any,any>>(new Map());



  useEffect(() => {
    socket.on('connection', (room: string) => {
      console.log('Connected!');
      
    });
    socket.on('connected', (newUser: UserPayload) => {
      setUsers((prev) => [...prev, newUser]);        
    });
    socket.on('onMessage', (newMessage: MessagePayload) => {
      listMute.indexOf(newMessage.socketid) === -1 ? (setMessages((prev) => [...prev, newMessage])) : console.log('user mute')
    });
    socket.on('forceleaveroom', (body:any) => {
      let socketid = socket.id;
      setOldroom(room);
      setRoom('joinroomname');
      socket.emit('leavecurrentroom',{value, socketid, oldroom, room, listMute,kicklist});
  });
  socket.on('banfromserver', (body:any) => {
    console.log(body.banroom);
    let currentban = listroomimban;
    currentban.push(body.banroom);
    setlistroomimban(currentban);
    console.log(listroomimban);
    console.log(body.datefromban);
    console.log(body.secondfromban);
    console.log(currentban);
    const datebanned = Date.now();
    let tempmap = new Map();
    tempmap.set(body.banroom, new Map());
    tempmap.get(body.banroom).set('dateban',datebanned);
    tempmap.get(body.banroom).set('dureeban',body.secondfromban);
    let cpy = storebantemp;
    cpy.set(body.banroom,tempmap.get(body.banroom));
    console.log(cpy.get(body.banroom));
    setstorebantemp(cpy);

    //tempmap.set(body.banrom,body.secondfromban);
    console.log(tempmap);
    console.log('baalors');

    console.log(storebantemp);

});
    socket.on('mutedfromroom', (body:any) => {
      if (body.tempdemute !== -1){
          console.log('on essai de me mute');
          setmylistroom(body.room);
          const datemuted = Date.now();
          let cpy = new Map();
          cpy.set('datemute',datemuted);
          cpy.set('dureemute', body.tempdemute);
          let temp = storemutetemp;
          temp.set(body.room,cpy);
          setstoremutetemp(temp);
      }else{
        let temp = storemutetemp;
        temp.delete(body.room);
        let listtemp = listroomimmuted.filter(elem => elem !== body.room);
        setlistroomimmuted(listtemp);
      }
    });

    socket.on('roomMove', (newUser: UserPayload)  => {
      console.log(newUser);
      
      setUsers((prev) => [...prev, newUser]);
      setOldroom(oldroom);
      setRoom(newUser.mynewroom);
      setValue(newUser.mynewroom);
      //setRoom(newUser.mynewroom);
      //joinRoom();
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
    console.log(room);
    console.log(listroomimmuted);

  if (listroomimmuted.indexOf(room) !== -1)
  {
    let nowdate = Date.now();
    console.log((nowdate - storemutetemp.get(room).get('datemute'))/300);
    if (nowdate - storemutetemp.get(room).get('datemute') >= (storemutetemp.get(room).get('dureemute')*300))
    {
      let tempunmute = storemutetemp;
      tempunmute.delete(room);
      setstoremutetemp(tempunmute);

      const templistunmute = listroomimmuted.filter(elem => elem !== room);
      setlistroomimmuted(templistunmute);
    }
  }
  

    if (value.length > 0 && listroomimmuted.indexOf(room) === -1)
      socket.emit('newMessage', {value, socketid, oldroom, room, listMute});

    setCount(count + 1);
    setValue('');
  }

  const onLeaveCurrentRoom = () => {
    let socketid = socket.id;
    if (kicklist == socketid)
      setRoom('');
    socket.emit('leavecurrentroom',{value, socketid, oldroom, room, listMute,kicklist});
  }



  const onKick = () => {
    let socketid = socket.id;
    if (kicklist == socketid)
      setRoom('');
    socket.emit('kickevent',{value, socketid, oldroom, room, listMute,kicklist});
  }

  const onPrivatemessage = () => {
    let socketid = socket.id;;
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
  if (value !== socketid){
  socket.emit('setadmin',{
    socketid,
    room,
    selecteduser
    })
  }
};
  

  const joinRoom = () => {
    console.log(listroomimban);

    if (listroomimban.indexOf(room) !== -1) {
      let nowdate = Date.now();
      console.log((nowdate - (storebantemp.get(room).get('dateban')))/300);
      console.log((storebantemp.get(room).get('dureeban') ));
      if (nowdate - storebantemp.get(room).get('dateban') >= (storebantemp.get(room).get('dureeban') * 300)){
        console.log('jesuisdeban');
        let tempunban = storebantemp;
        tempunban.delete(room);
        setstorebantemp(tempunban);
        
       const templistunban = listroomimban.filter(elem => elem !== room);
       setlistroomimban(templistunban);

    }
  }
    
    if (listroomimban.indexOf(room) === -1) {
    
      console.log('je join la room : ' + room);
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
  }
  
    
    if (listroomimban.indexOf(room) !== -1) 
      console.log('je ne peux pas rentrer car je suis ban');
      setRoom(oldroom);  
  }
  
  ;

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
    socket.emit('kickevent',{value, socketid, oldroom, room, listMute,kicklist});
  }

  function fonBan(body:any){
    let socketid = socket.id;
    let kicklist = body;
    socket.emit('banevent',{value, socketid, oldroom, room, listMute,kicklist,bantime});
  }

  function setmylistroom(body:string){
    const newlistroomimmuted = listroomimmuted;
    if (newlistroomimmuted.indexOf(body) === -1){
      newlistroomimmuted.push(body);
      setlistroomimmuted(newlistroomimmuted);
      console.log(newlistroomimmuted);
      console.log(listroomimmuted);
      console.log(body);
      console.log('list de room im mute' + listroomimmuted);
    }
    /*
    else{
      newlistroomimmuted.length === 1 ? setlistroomimmuted([]) :newlistroomimmuted.filter(elem=>elem !== body);
    }
    */
    
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
      <button value={user} onClick={(e) => {fonBan(e.currentTarget.value)}}> Ban as admin</button>
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
