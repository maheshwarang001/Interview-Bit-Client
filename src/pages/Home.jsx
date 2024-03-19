import {React, useEffect} from "react";
import Navbar from "../componenets/Navbar";
import Schedule from "../componenets/Schedule";


const Home = () =>{

    useEffect(() => {
        // Disable scrolling on mount
        document.documentElement.style.overflow = 'hidden';
    
        // Re-enable scrolling when component unmounts
        return () => {
          document.documentElement.style.overflow = 'unset';
        };
      }, []);

    return(  

        <div className="h-screen w-screen overflow-hidden">
            <Navbar/>
            <div className="w-full h-screen bg-gradient-to-br from-blue-900 to-purple-900">
                <Schedule/>
            </div>
        </div>
        
           
        
        
    );

};
export default Home;