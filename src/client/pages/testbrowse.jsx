import React, { Fragment, useState, useEffect } from "react";
import FileBrowser from "./components/FileBrowser";

export default function TestBrowse() {
    const [fileList, setFileList] = useState([]);

    async function getFileList() {
        try {
            const response = await fetch('/api/file/list');
            setFileList(await response.json());
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Fragment>
            <button type='button' onClick={getFileList}>Find files</button>
            <FileBrowser files={fileList} />
        </Fragment>
    );
}