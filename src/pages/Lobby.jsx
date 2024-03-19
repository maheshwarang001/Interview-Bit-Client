import React, { useState, useEffect, useCallback } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import Peer from "../services/Peer";
import { useSocket } from "../context/SocketContext";

const Lobby = () => {
    const navigate = useNavigate();
    const { roomID } = useParams();
    const socket = useSocket();
    const [localStream, setLocalStream] = useState(null);
    const [hasVideoAccess, setHasVideoAccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showText, setShowText] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const handleJoinRoom = useCallback(() => {
        navigate(`/room/${roomID}`);
    }, [navigate, roomID]);

    const handleIncomingCall = useCallback(async (offer) => {
        try {


            console.log("stream" , localStream);

            const st = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true
            });
            const answer = await Peer.getAnswer(offer,st);

            socket.send(JSON.stringify(answer));
            await Peer.setRemoteDescription(offer);



            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error("ICE candidates not available after timeout"));
                }, 8000);
                const checkIceCandidates = setInterval(() => {
                    const ice = Peer.getIceCandidates();
                    console.log("PEER ICEEEE", ice);
                    const iceData = {
                        type: "candidate",
                        ice: ice
                    };
                    socket.send(JSON.stringify(iceData));
                    if (ice.length > 0) {
                        clearInterval(checkIceCandidates);
                        clearTimeout(timeout);
                        resolve();
                    }
                }, 100);
            });
        } catch (error) {
            console.error("Error handling incoming call:", error);
        }
    }, [socket]);

    const handleVideoUser = useCallback(async () => {
        try {
            if (hasVideoAccess) {
                setHasVideoAccess(false);
                setLocalStream(null);
            } else {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true
                });
                setLocalStream(stream);
                setHasVideoAccess(true);
            }
        } catch (error) {
            console.error("Error accessing video:", error);
        }
    }, [hasVideoAccess]);

    const handleOnChange = useCallback(async () => {
        setLoading(true);
        setButtonDisabled(true);

        if (socket) {
            setShowText(true);

            if (localStream) {
                const offerSDP = await Peer.createOffer(localStream);
                socket.send(JSON.stringify(offerSDP));
            } else {
                console.error("Failed to obtain media stream.");
            }

            setTimeout(() => {
                setButtonDisabled(false);
            }, 30000);
        } else {
            console.log("Socket missing. Cannot send message.");
        }
    }, [socket, localStream]);

    const handleMessage = useCallback(async (data) => {
        if (localStream === null) console.log(false);
        console.log(data);
        switch (data.type) {
            case "offer":
                handleIncomingCall(data);
                break;
            case "answer":
                console.log("answer", data);

                await Peer.setRemoteDescription(data);
                const ice = Peer.getIceCandidates();
                console.log("PEER ICEEEE", ice);
                const iceData = {
                    type: "candidate",
                    ice: ice
                };
                socket.send(JSON.stringify(iceData));
                break;

            case "track":
                console.log("track got", data.stream);
                    
            case "candidate":
                console.log("Received ICE candidate:", data.ice);
                if (data.ice) {
                    data.ice.forEach(candidate => {
                        Peer.addIceCandidate(candidate);
                    });
                    navigate(`/room/${roomID}`)
                } else {
                    console.log("No ICE candidates found in the message.");
                }
                break;
            default:
                console.log("Unhandled message type:", data.type);
        }
    }, [socket, handleIncomingCall, localStream]);

    useEffect(() => {
        handleVideoUser();
        const handleSocketMessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data);
            handleMessage(data);
        };
        if (socket) {
            socket.onmessage = handleSocketMessage;
            socket.onerror = function (error) {
                console.error("WebSocket error:", error);
            };
        } else {
            console.log("Socket missing.");
        }
        return () => {
            if (socket) {
                socket.onmessage = null;
                socket.onerror = null;
            }
        };
    }, [socket]); 

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-900 to-purple-900">
            <div className={`w-[500px] h-[500px] border border-gray-300 rounded-md overflow-hidden ${!hasVideoAccess ? 'bg-black' : ''}`}>
                {hasVideoAccess && <ReactPlayer playing muted height={500} width={500} style={{ objectFit: 'cover' }} url={localStream} />}
            </div>
            <div className="flex">
                <button className="w-[200px] h-20 text-lg bg-black text-white text-lg px-6 py-3 rounded-lg shadow-lg hover:bg-gray-900 m-10" onClick={handleVideoUser}>Camera & Audio</button>
                <button className="w-[200px] h-20 text-lg bg-black text-white text-lg px-6 py-3 rounded-lg shadow-lg hover:bg-gray-900 m-10" onClick={handleOnChange} disabled={buttonDisabled}>Join Room</button>
            </div>
            {loading && (
                <div className="border-8 border-gray-900 rounded-full w-20 h-20 animate-spin mb-4">
                    <div className="w-4 h-4 bg-[#00df9a] rounded-full"></div>
                </div>
            )}
            {showText && (
                <div className="text-white text-4xl mt-5">
                    Connecting to {roomID}
                </div>
            )}
        </div>
    );
}

export default Lobby;
