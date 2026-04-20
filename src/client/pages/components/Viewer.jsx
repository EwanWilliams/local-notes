import { useCallback, useEffect, useState, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';

const IO_URL = process.env.IO_URL;

const ViewerToolbar = () => { return (
    <div id='viewerToolbar' className='viewerToolbar'>
        <div className='toolbar-left'>
            <button className='ql-fileBrowserButton'>Browse Files</button>
        </div>
        <div className='toolbar-centre'></div>
        <div className='toolbar-right'>
            <button className='ql-switchEditButton'>Edit Mode</button>
        </div>
    </div>
)};

export function Viewer({onBrowseFiles}) {
    const navigate = useNavigate();
    const { id: fileId } = useParams();
    // storing socket connection and quill instance in state
    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();


    // RUN ONCE ON LOAD EFFECT
    useEffect(() => {
        // make connection on load
        const socketIo = io(IO_URL);
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

        // create viewer div and append to container
        const viewer = document.createElement('div');
        wrapper.append(viewer);

        // initialise quill instance with no toolbar
        const quillInst = new Quill(viewer, {
            theme: 'snow',
            modules: { 
                toolbar: {
                    container: '#viewerToolbar',
                    handlers: {
                        switchEditButton: () => {
                            navigate(`/edit/${fileId}`);
                        },
                        fileBrowserButton: () => {
                            onBrowseFiles();
                        }
                    }
                }
            } 
        });
        quillInst.disable(); // don't enable editing
        setQuill(quillInst);
    }, []);


    // LOAD DOCUMENT FROM ID AND JOIN SOCKET ROOM
    useEffect(() => {
        // don't run if socket or quill don't exist yet
        if (socket == null || quill == null) return;

        socket.emit('get-file', fileId);

        socket.once('load-file', loadFile => {
            quill.setContents(loadFile);
        });

        socket.on('failed-load', () => {
            alert("Failed to find file.");
            socket.disconnect();
            navigate('/');
        });
    }, [socket, quill, fileId]);


    // RECEIVE CHANGES MADE FROM THE SERVER
    useEffect(() => {
        // don't run if socket or quill don't exist yet
        if (socket == null || quill == null) return;

        // function emits changes made by the user
        const receiveTextChange = (delta) => {
            quill.updateContents(delta);
        }

        // on receiving new changes from the server
        socket.on('new-changes', receiveTextChange);

        return () => { // remove handler when done
            socket.off('new-changes', receiveTextChange);
        }
    }, [socket, quill]);

    return (
        <Fragment>
            <ViewerToolbar />
            <div className='viewerContainer' ref={containerRef}></div>
        </Fragment>
    );
}