import React, { Fragment } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Edit from "./pages/edit";
import New from "./pages/new";


export default function App() {
    return (
        <Router>
            <main>
                <Routes>
                    <Route
                        path='/'
                        element={
                            <Navigate to='/edit' />
                        }
                    />
                    <Route
                        path='/new'
                        element={
                            <New />
                        } 
                    />
                    <Route path='/edit/:id' element={<Edit />}/>
                </Routes>
            </main>
        </Router>
    );
}