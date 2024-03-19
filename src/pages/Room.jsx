import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import Editor from '@monaco-editor/react';
import Peer from '../services/Peer';

const Room = () => {

    const [code,setCode] = useState("// some comment");
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const editorRef = useRef(null);

    function handleEditorDidMount(editor) {
        editorRef.current = editor;
    }

    function showValue() {
        if (editorRef.current) {
            alert(editorRef.current.getValue());
        }
    }

    useEffect(() => {
        // Disable scrolling on mount
        document.documentElement.style.overflow = 'hidden';

        const getLocalStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true
                });
                setLocalStream(stream);
            } catch (error) {
                console.error('Error accessing local media devices:', error);
            }
        };

        getLocalStream();

        // Re-enable scrolling when component unmounts
        return () => {
            document.documentElement.style.overflow = 'unset';
        };
    }, []);


    

    useEffect(() => {
        // Subscribe to remote stream when available
        const subscribeToRemoteStream = async () => {
            try {
                // Call method to subscribe to remote stream
                // You'll need to implement this based on your peer-to-peer communication logic
                const remoteStream = await Peer.getRemoteStream();
                console.log(remoteStream);
                setRemoteStream(remoteStream);
            } catch (error) {
                console.error('Error subscribing to remote stream:', error);
            }
        };

        subscribeToRemoteStream();

        // Clean up function
        return () => {
            // Unsubscribe from remote stream if needed
        };
    }, []);


    //check if the codechanges

    useEffect(() => {
      console.log(code);

      Peer.sendData(code);
    }, [code]); // Run this effect whenever 'code' changes
    
    const handleCodeChange = (newValue) => {
        setCode(newValue);
    };

    useEffect(() => {
        
        const handleDataChannelMessage = (event) => {
            
            setCode(event.data);
        };

        // Subscribe to data channel messages
        Peer.dataChannel.onmessage = handleDataChannelMessage;


    }, []);




    return (
        <div className='h-screen w-screen flex bg-gradient-to-br from-blue-900 to-purple-900'>

            <div className='m-20' style={{ flexBasis: '70%' }}>

                <button className="w-100 h-50 bg-white" onClick={showValue}>Show value</button>
                {/* Content for the left side (70% of the screen) */}
                <Editor
                    className="h-full w-full bg-black"
                    onMount={handleEditorDidMount}
                    theme='vs-dark'
                    defaultLanguage="javascript"
                    defaultValue={code}
                    value={code} // Pass the 'code' state as the value prop
                    onChange={handleCodeChange} // Pass the event handler for code changes
                />
            </div>

            <div className='' style={{ flexBasis: '30%' }}>
                {/* Content for the right side (30% of the screen) */}
                <div className="flex flex-col justify-center items-center h-screen">
                    <div className="w-[500px] h-[500px] border border-gray-300 rounded-md overflow-hidden bg-black m-5">
                        <ReactPlayer playing muted height={500} width={500} style={{ objectFit: 'cover' }} url={localStream} />
                    </div>
                    <div className="w-[500px] h-[500px] border border-gray-300 rounded-md overflow-hidden bg-black m-5">
                        <ReactPlayer playing  height={500} width={500} style={{ objectFit: 'cover' }} url={remoteStream} />
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Room;
