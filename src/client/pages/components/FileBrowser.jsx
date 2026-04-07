import { useNavigate } from "react-router-dom";

export default function FileBrowser({files = []}) {
    const navigate = useNavigate();

    // produce list of file elements
    const fileList = files.map(file => (
        <li key={file._id}>
            {file.title}
            <button className='file-select-button' onClick={() => navigate(`/edit/${file._id}`)}>Edit</button>
            <button className='file-select-button' onClick={() => navigate(`/view/${file._id}`)}>View</button>
       </li>
    ));

    // return list of files within container
    return (
        <div id='file-browser' className='file-browser'>
            {fileList.length > 0 ? <ul>{fileList}</ul> : <p>No files.</p>}
        </div>
    );
}