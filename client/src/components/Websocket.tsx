//import { Socket } from 'net';
import { useContext, useEffect, useState } from 'react';
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
};


export const Websocket = () => {
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const [users, setUsers] = useState<UserPayload[]>([]);
  //const [allid, setallid] = useState<MessagePayload[]>([]);
  const [usersss, setUsersss] = useState([]);
  const socket = useContext(WebsocketContext);


  useEffect(() => {
    socket.on('connection', () => {
      console.log('Connected!');
      //console.log(users[0].listUser)
      //setUsers((prev) => [...prev, newUser]);
    });

    socket.on('connected', (newUser: UserPayload) => {    
      //console.log('bonjour');
      //console.log(newUser); 
      //setUsers(newUser);
      setUsers((prev) => [...prev, newUser]);
      //setUsers(prev => ({
      //  ...prev,
      //  ...newUser
      //}));
      //console.log(users[users.length - 1].listUser);
    });

    socket.on('onMessage', (newMessage: MessagePayload) => {
      console.log('onMessage event received!');
      console.log(newMessage);
      setMessages((prev) => [...prev, newMessage]);
    });
    return () => {
      console.log('Unregistering Events...');
      socket.off('connect');
      socket.off('onMessage');
    };
  }, [socket]);

  const onSubmit = () => {
    socket.emit('newMessage', value, socket.id);//le body du message envoyer au serv
    setValue('');//reset de value
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
    </div>
  );
};