import { Fragment, useState } from "react";
import { Editor } from "./components/Editor";
import FileBrowser from "./components/FileBrowser";

export default function Edit() {
    // file list for browser
    const [fileList, setFileList] = useState([]);
    const [browserOpen, setBrowserOpen] = useState();

    // function to update file list in browser
    async function getFileList() {
        try {
            const response = await fetch('/api/file/list');
            setFileList(await response.json());
        } catch (err) {
            console.log(err);
        }
    }

    // browse file button handler
    function browseFilesClicked() {
        if (!browserOpen) {
            getFileList();
            setBrowserOpen(true);
            console.log(browserOpen);
        } else {
            setBrowserOpen(false);
            console.log(browserOpen);
        }
    }

    return (
        <Fragment>
            <div className={`filePage${browserOpen ? '-browserOpen' : ''}`}>
                <Editor onBrowseFiles={browseFilesClicked}/>
            </div>
        </Fragment>
    )
}