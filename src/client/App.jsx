import React, { Fragment } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Edit from "./pages/edit";
import View from "./pages/view";
import New from "./pages/new";
import TestBrowse from "./pages/testbrowse";


export default function App() {
    return (
        <Router>
            <main>
                <Routes>
                    <Route
                        path='/'
                        element={
                            <Navigate to='/testbrowse' />
                        }
                    />
                    <Route
                        path='/new'
                        element={
                            <New />
                        } 
                    />
                    <Route path='/edit/:id' element={<Edit />}/>
                    <Route path='/view/:id' element={<View />}/>
                    <Route path='/testbrowse' element={<TestBrowse />} />
                </Routes>
            </main>
        </Router>
    );
}