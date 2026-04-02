import React, { Fragment } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Edit from "./pages/edit";


export default function App() {
    return (
        <Router>
            <main>
                <Routes>
                    <Route
                        path='/new'
                        element={
                            <Navigate to={`/edit`}/>
                        } 
                    />
                    <Route path='/edit' element={<Edit />}/>
                </Routes>
            </main>
        </Router>
    );
}