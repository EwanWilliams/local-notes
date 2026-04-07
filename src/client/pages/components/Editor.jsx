import { useCallback, useEffect, useState, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';

// autosave interval, potential battery life implications
const SAVE_INTERVAL = 3000


// custom toolbar layout and options NOT IN USE, added custom viewer button
const toolbarConfig = [
    // heading/normal dropdown
    [{ 'header': [1, 2, 3, 4, false] }],
    // font options
    [{ 'font': [] }],
    // button options
    ['bold', 'italic', 'underline', 'strike', 'code-block'],
    // alignment options
    [{ 'align': [] }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    // list options
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
    // hyperlink option
    ['link'],
    // colour options
    [{ 'color': [] }, { 'background': [] }],
    ['clean']
]


// html format toolbar options to enable custom buttons
const EditorToolbar = () => { return (
    <div id='editorToolbar' className='editorToolbar'>
        <div className='toolbar-left'></div>
        <div className='toolbar-centre'>
            
            <select className="ql-font"></select>
            <button className="ql-bold"></button>
            <button className="ql-italic"></button>
            <button className="ql-underline"></button>
            <button className="ql-strike"></button>
            <button className="ql-code-block"></button>
            <select className="ql-align"></select>
            <button className="ql-indent" value="-1"></button>
            <button className="ql-indent" value="+1"></button>
            <button className="ql-list" value="ordered"></button>
            <button className="ql-list" value="bullet"></button>
            <button className="ql-list" value="check"></button>
            <button className="ql-link"></button>
            <select className="ql-color"></select>
            <select className="ql-background"></select>
            <button className="ql-clean"></button>
        </div>
        <div className='toolbar-right'>
            <button className='ql-switchViewButton'>View File</button>
        </div>
    </div>
)};


export function Editor() {
    const navigate = useNavigate();
    const { id: fileId } = useParams();
    // storing socket connection and quill instance in state
    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();


    // RUN ONCE ON LOAD EFFECT
    useEffect(() => {
        // make connection on load
        const socketIo = io('http://localhost:3000');
        setSocket(socketIo);

        return () => { // disconnect when done
            socketIo.disconnect();
        }
    }, []);


    // CREATE QUILL INSTANCE WITHIN WRAPPER
    const containerRef = useCallback(wrapper => {
        // make sure wrapper exists and is reset on reinitialise
        if (wrapper == null) return;
        wrapper.innerHTML = "";

        // create editor div and append to container
        const editor = document.createElement('div');
        wrapper.append(editor);

        // initialise quill instance
        const quillInst = new Quill(editor, {
             theme: 'snow',
             modules: {
                toolbar: {
                    container: '#editorToolbar',
                    handlers: {
                        switchViewButton: () => {
                            navigate(`/view/${fileId}`);
                        }
                    }
                }
            }
        });
        quillInst.disable(); // don't enable editor until file is loaded
        setQuill(quillInst);
    }, []);


    // LOAD DOCUMENT FROM ID AND JOIN SOCKET ROOM
    useEffect(() => {
        // don't run if socket or quill don't exist yet
        if (socket == null || quill == null) return;

        socket.emit('get-file', fileId);

        socket.once('load-file', loadFile => {
            quill.setContents(loadFile);
            quill.enable();
        });

        socket.on('failed-load', () => {
            alert("Failed to find file.");
            socket.disconnect();
            navigate('/');
        });
    }, [socket, quill, fileId]);



    // SEND CHANGES MADE BY THE USER
    useEffect(() => {
        // don't run if socket or quill don't exist yet
        if (socket == null || quill == null) return;

        // function emits changes made by the user
        const sendTextChange = (delta, oldDelta, source) => {
            // ignore changes made by anything that is not the user
            if (source !== 'user') return;

            // emit event 'user-changes' passing the changes
            socket.emit('user-changes', delta);
        }

        // on quill built in API event 'text-change'
        quill.on('text-change', sendTextChange);

        return () => { // remove handler when done
            quill.off('text-change', sendTextChange);
        }
    }, [socket, quill]);


    // RECEIVE CHANGES MADE FROM THE SERVER
    useEffect(() => {
        // don't run if socket or quill don't exist yet
        if (socket == null || quill == null) return;

        const receiveTextChange = (delta) => {
            quill.updateContents(delta);
        }

        // on receiving new changes from the server
        socket.on('new-changes', receiveTextChange);

        return () => { // remove handler when done
            socket.off('new-changes', receiveTextChange);
        }
    }, [socket, quill]);


    // every interval save whole contents of the quill editor to the database
    useEffect(() => {
        // don't run if socket or quill don't exist yet
        if (socket == null || quill == null) return;

        const timer = setInterval(() => {
            socket.emit('save-file', quill.getContents());
        }, SAVE_INTERVAL);

        return () => {
            clearInterval(timer);
        }
    }, [socket, quill]);


    return (
        <Fragment>
            <EditorToolbar />
            <div className='editorContainer' ref={containerRef}></div>
        </Fragment>
    );
}