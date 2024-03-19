import React from 'react';
import { Routes, Route, BrowserRouter, useParams } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Room from './pages/Room';
import Lobby from './pages/Lobby';
import { SocketProvider } from "./context/SocketContext";

export default function App() {
  return (
    <BrowserRouter>
      {/* <SocketProvider> */}
      <div>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/room/:roomID" element={<Room />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/lobby/:roomID/:userID/:role"
            element={<LobbyWithSocket />}
          />
          <Route path="*" element={<div>Error 404</div>} />
        </Routes>
      </div>
      {/* </SocketProvider> */}
    </BrowserRouter>
  );
}

function LobbyWithSocket() {
  const params = useParams();
  return (
    <SocketProvider roomID={params.roomID} userID={params.userID}>
      <Lobby />
    </SocketProvider>
  );
}
