import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewFileDialog() {
    const navigate = useNavigate();
    const [newTitle, setNewTitle] = useState("");

    const handleNewFile = async () => {
        try {
            if (!newTitle.trim()) {
                alert("Please enter a title.");
                setNewTitle("");
                return;
            }
            // create new file through REST API
            const sendTitle = { title: newTitle }
            const response = await fetch('/api/file/new', {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(sendTitle)
            });

            if (response.status == 200) {
                const data = await response.json();
                alert(data);
                //navigate(`/edit`)
            } else {
                alert(response.status);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className='new-file-dialog-container'>
            <div className='new-file-dialog'>
                <input
                    id='new-title'
                    name='new-title'
                    type='text'
                    value={newTitle}
                    placeholder="Enter title for new file..."
                    onChange={(e) => setNewTitle(e.target.value)}
                />
                <button
                    type='button'
                    id='new-file-dialog-button'
                    onClick={handleNewFile}
                >Create File</button>
            </div>
        </div>
    )
}