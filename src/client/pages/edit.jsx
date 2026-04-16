import { Fragment, useState, useEffect } from "react";
import { Editor } from "./components/Editor";
import FileBrowser from "./components/FileBrowser";

export default function Edit() {
    // file list for browser
    const [fileList, setFileList] = useState([]);
    const [browserOpen, setBrowserOpen] = useState(false);

    // function to update file list in browser
    async function getFileList() {
        try {
            const response = await fetch('/api/file/list');
            setFileList(await response.json());
        } catch (err) {
            console.log(err);
        }
    }

    // toggle browser state variable
    const toggleBrowser = () => {
        setBrowserOpen(current => !current);
    }

    // when browser toggle state changesa to open, update the file list
    useEffect(() => {
        if (browserOpen) {
            getFileList();
        }
    }, [browserOpen]);


    return (
        <Fragment>
            <div className={`file-browser${browserOpen ? '' : '-closed'}`}>
                <FileBrowser files={fileList} />
            </div>
            <div className={`filePage${browserOpen ? '-browserOpen' : ''}`}>
                <Editor onBrowseFiles={toggleBrowser}/>
            </div>
        </Fragment>
    );
}