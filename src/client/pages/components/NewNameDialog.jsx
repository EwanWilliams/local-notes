import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewNameDialog() {
    const navigate = useNavigate();
    const [newName, setNewName] = useState("");

    const handleNewName = () => {
        // validate username
        if (!newName.trim().length > 0 || newName.length > 10) {
            alert("Please enter a nickname up to 10 characters long.")
            setNewName("");
            return;
        }
        localStorage.setItem('nickname', newName);
        navigate('/');
    }

    return (
        <div className='new-file-dialog-container'>
            <div className='new-file-dialog'>
                <p>
                    You must set a nickname:
                </p>
                <input
                    id='new-name'
                    name='new-name'
                    type='text'
                    value={newName}
                    placeholder="Your nickname..."
                    onChange={(e) => setNewName(e.target.value)}
                />
                <button
                    type='button'
                    id='new-file-dialog-button'
                    onClick={handleNewName}
                >Set Nickname</button>
            </div>
        </div>
    )
}