import { useCallback, useEffect, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';


// custom toolbar layout and options
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


export function Editor() {
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
        const quillInst = new Quill(editor, { theme: 'snow', modules: { toolbar: toolbarConfig }});
        setQuill(quillInst);
    }, []);


    //
    useEffect(() => {

    });

    return (
        <div className='editorContainer' ref={containerRef}></div>
    );
}