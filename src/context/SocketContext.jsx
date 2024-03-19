import React, { createContext, useContext, useMemo, useCallback } from "react";
import Peer from "../services/Peer";

const SocketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export const SocketProvider = ({ roomID, userID, children }) => {
  const url = `ws://localhost:8084/meeting/room/${roomID}/${userID}`;

  const socket = useMemo(() => new WebSocket(url), [url]);

  socket.onclose = function (event) {
    console.log("WebSocket connection closed.");
  };

  socket.onopen = function (event) {
    console.log("WebSocket connection established.");
  };

  socket.onerror = function (error) {
    console.error("WebSocket error:", error);
  };


  // const handleIncomingCall = useCallback(async (offer) => {
  //   // Assuming Peer.getAnswer is defined and imported properly
  //   const answer = await Peer.getAnswer(offer);
  //   console.log(answer);
  //   socket.send(JSON.stringify(answer));
  //   // Send the answer via socket if needed
  // }, []);


  // socket.onmessage = function (event) {
  //   console.log("Received message:", event.data);
  //   const data = JSON.parse(event.data);
   
  //     console.log( "received:", data);
  //     socket.onmessage = null;
  //     handleMessage(data);
    
  // };

  



  // const handleMessage = useCallback(async(data) => {

  //   console.log("message handle")


  //   switch (data.type) {
  //     case "offer":
  //       console.log("offer: ", data)
  //       handleIncomingCall(data);
  //       break;
  //     case "answer":
  //       await Peer.setRemoteDescription(data);
  //       socket.send("ICEEEE");
  //     case "candidate":
  //       console.log("ICE candidate received:", data);
  //       Peer.addIceCandidate(data.candidate);
  //       break;

      
  //     default:
  //       console.log("Unhandled message type:", data.type);
  //   }
  // }, []);




  const handleOtherMessageType = useCallback((data) => {
    // Handle other message types here
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
