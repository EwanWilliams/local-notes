export default function FileBrowser({files = []}) {

    function editFile(fileId) {
        alert(`Edit file ${fileId}`);
    }

    function viewFile(fileId) {
        alert(`View file ${fileId}`);
    }

    const fileList = files.map(file => (
        <li key={file._id}>
            {file.title}
            <button className='file-select-button' onClick={() => editFile(file._id)}>Edit</button>
            <button className='file-select-button' onClick={() => viewFile(file._id)}>View</button>
       </li>
    ));

    return (
        <div id='file-browser' className='file-browser'>
            {fileList.length > 0 ? <ul>{fileList}</ul> : <p>No files.</p>}
        </div>
    );
}