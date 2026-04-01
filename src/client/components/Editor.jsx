import { useCallback } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';


export function Editor() {
    const containerRef = useCallback(wrapper => {
        // make sure wrapper exists and is reset on reinitialise
        if (wrapper == null) return;
        wrapper.innerHTML = "";
        // create editor div and append to container
        const editor = document.createElement('div');
        wrapper.append(editor);
        // initialise quill instance
        new Quill(editor, { theme: 'snow'});
    }, []);

    return (
        <div id='editorContainer' ref={containerRef}></div>
    );
}