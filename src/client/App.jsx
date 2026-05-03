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
import Browse from "./pages/browse";
import Nickname from "./pages/nickname";

const ProtectedRoute = ({ children }) => {
    const nickname = localStorage.getItem("nickname");
    return nickname ? children : <Navigate to={'/nickname'} replace />;
};

export default function App() {
    return (
        <Router>
            <main>
                <Routes>
                    <Route path='/' element={<ProtectedRoute><Browse /></ProtectedRoute>} />
                    <Route path='/new' element={<ProtectedRoute><New /></ProtectedRoute>} />
                    <Route path='/nickname' element={<Nickname />}/>
                    <Route path='/edit/:id' element={<ProtectedRoute><Edit /></ProtectedRoute>}/>
                    <Route path='/view/:id' element={<ProtectedRoute><View /></ProtectedRoute>}/>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </Router>
    );
}