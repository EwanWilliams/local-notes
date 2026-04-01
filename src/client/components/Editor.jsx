import { useCallback } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';


export function Editor() {

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

    const containerRef = useCallback(wrapper => {
        // make sure wrapper exists and is reset on reinitialise
        if (wrapper == null) return;
        wrapper.innerHTML = "";
        // create editor div and append to container
        const editor = document.createElement('div');
        wrapper.append(editor);
        // initialise quill instance
        new Quill(editor, { theme: 'snow', modules: { toolbar: toolbarConfig }});
    }, []);

    return (
        <div className='editorContainer' ref={containerRef}></div>
    );
}