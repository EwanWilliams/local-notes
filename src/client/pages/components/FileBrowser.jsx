import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

export default function FileBrowser({files = []}) {
    const navigate = useNavigate();

    // produce list of file elements
    const fileList = files.map(file => (
        <li key={file._id} className='file-selector'>
            <div className='file-selector-title'>
                {file.title}
            </div>
            <div className='file-selector-selectors'>
                <button className='file-edit-button' onClick={() => {
                    navigate(`/edit/${file._id}`);
                    navigate(0);
                }}>Edit</button>
                <button className='file-view-button' onClick={() => {
                    navigate(`/view/${file._id}`);
                    navigate(0);
                    }}
                >View</button>
            </div>
       </li>
    ));

    // return list of files within container
    return (
        <Fragment>
            <h2 className='app-title' onClick={() => {
                navigate('/');
                navigate(0);
            }}>local.notes</h2>
            {fileList.length > 0 ? <ul className='file-browser-list'>{fileList}</ul> : <p>Loading...</p>}
            <div className="new-button-container">
                <button className='file-new-button' onClick={() => {
                    navigate('/new');
                    navigate(0);
                }}>New File</button>
            </div>
        </Fragment>
    );
}