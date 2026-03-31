import { Fragment, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', { autoConnect: false });

export default function SocketTestUi() {

    const [connectionStatus, setConnectionStatus] = useState("Not Connected");
    const [recievedMessage, setRecievedMessage] = useState(null);

    useEffect(() => {
        socket.on('recieve-message', (data) => {
            setRecievedMessage(data.message);
        });
    }, [socket]);


    // socket.io event handlers
    socket.on('connect', () => {
        setConnectionStatus(`You connected with id: ${socket.id}`);
    });

    socket.on('disconnect', () => {
        setConnectionStatus("Not Connected");
    });

    const sendMessage = () => {
        const newMessage = document.getElementById('usrMsgIn').value;
        socket.emit('send-message', { message: newMessage });
        document.getElementById('usrMsgIn').value = "";
    };

    return (
        <Fragment>
            <h1>Socket.io test</h1>
            <p>{connectionStatus}</p>
            <button onClick={() => {socket.connect()}}>Connect</button>
            <button onClick={() => {socket.disconnect()}}>Disconnect</button><br/>
            <p>
                <input placeholder="Type message..." id='usrMsgIn'/>
                <button onClick={sendMessage}>Send Message</button>
            </p>
            <h1>{recievedMessage}</h1>
        </Fragment>
    );
}