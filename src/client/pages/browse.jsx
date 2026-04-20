import React, { Fragment, useState, useEffect } from "react";
import FileBrowser from "./components/FileBrowser";

export default function Browse() {
    const [fileList, setFileList] = useState([]);

    async function getFileList() {
        try {
            const response = await fetch('/api/file/list');
            setFileList(await response.json());
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getFileList()
    }, []);

    return (
        <Fragment>
            <FileBrowser files={fileList} />
        </Fragment>
    );
}