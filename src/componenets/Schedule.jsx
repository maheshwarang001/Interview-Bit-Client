import React, { useState, useEffect } from 'react';
import LoginService from '../services/LoginService';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { validateToken } from '../services/AuthService';


const Schedule = () => {
    const loginstate = {
        interviewerEmail: '',
        interviewerFirstName: '',
        interviewerLastName: '',
        candidateEmail: '',
        candidateFirstName: '',
        candidateLastName: '',
        jobID:'',
        cv: '',
        schedule: ''
    };

    const [isError, setIsError] = useState(false);
    const [formData, setFormData] = useState(loginstate);
    const handleChange = (e) => {
        const { name, value } = e.target;

        let parsedValue = value;

        // Convert schedule to LocalDateTime object
        if (name === 'schedule') {
            // Parse the input string into a LocalDateTime object
            parsedValue = value ? new Date(value).toISOString() : '';
        }
    
        setFormData({ ...formData, [name]: parsedValue });
    };

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        LoginService.save(formData)
        .then((response) => {
            console.log(response);
            navigate('/home');
        })
        .catch((e) => {
            console.log(e);
        });

        console.log('Form Data:', formData);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await validateToken(Cookies.get('token')); 
                if(result === true) {
                    navigate("/home");
                } else {
                    throw new Error("Invalid token");
                }
            } catch (error) {
                setIsError(true);
            }
        }
        fetchData();
    }, [navigate]);

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-900 to-purple-900">
            <div className="w-1/2 relative">
                <div className="bg-gray-900 p-10 rounded-xl shadow-lg">
                    <h2 className="text-3xl font-bold mb-3 text-white">Schedule</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-white mb-4">Interviewer</h3>
                            <label htmlFor="interviewerEmail" className="block text-white">Email {formData.interviewerEmail ? '' : <span className="text-red-600">*</span>}</label>
                            <input
                                type="email"
                                id="interviewerEmail"
                                name="interviewerEmail"
                                value={formData.interviewerEmail}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md"
                                required={true}
                            />
                            <label htmlFor="interviewerFirstName" className="block text-white mt-2">First Name {formData.interviewerFirstName ? '' : <span className="text-red-600">*</span>}</label>
                            <input
                                type="text"
                                id="interviewerFirstName"
                                name="interviewerFirstName"
                                value={formData.interviewerFirstName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md"
                                required={true}
                            />
                            <label htmlFor="interviewerLastName" className="block text-white mt-2">Last Name {formData.interviewerLastName ? '' : <span className="text-red-600">*</span>}</label>
                            <input
                                type="text"
                                id="interviewerLastName"
                                name="interviewerLastName"
                                value={formData.interviewerLastName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md"
                                required={true}
                            />
                        </div>
                        <div>
                            <h3 className="text-white mb-4">Candidate</h3>
                            <label htmlFor="candidateEmail" className="block text-white">Email {formData.candidateEmail ? '' : <span className="text-red-600">*</span>}</label>
                            <input
                                type="email"
                                id="candidateEmail"
                                name="candidateEmail"
                                value={formData.candidateEmail}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md"
                                required={true}
                            />
                            <label htmlFor="candidateFirstName" className="block text-white mt-2">First Name {formData.candidateFirstName ? '' : <span className="text-red-600">*</span>}</label>
                            <input
                                type="text"
                                id="candidateFirstName"
                                name="candidateFirstName"
                                value={formData.candidateFirstName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md"
                                required={true}
                            />
                            <label htmlFor="candidateLastName" className="block text-white mt-2">Last Name {formData.candidateLastName ? '' : <span className="text-red-600">*</span>}</label>
                            <input
                                type="text"
                                id="candidateLastName"
                                name="candidateLastName"
                                value={formData.candidateLastName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md"
                                required={true}
                            />
                        </div>
                        <div className="col-span-2">
                            <label htmlFor="cv" className="block text-white">CV (PDF only) {formData.cv ? '' : <span className="text-red-600">*</span>}</label>
                            <input
                                type="file"
                                id="cv"
                                name="cv"
                                accept=".pdf"
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md text-white"
                                required={true}
                            />
                            
                            <label htmlFor="jobID" className="block text-white ">Job ID {formData.jobID ? '' : <span className="text-red-600">*</span>}</label>
                            <input
                                type="text"
                                id="jobID"
                                name="jobID"
                                value={formData.jobID}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md"
                                required={true}
                            />
                            
                            <label htmlFor="schedule" className="block text-white">Date & Time {formData.schedule ? '' : <span className="text-red-600">*</span>}</label>
                            <input
                                type="datetime-local"
                                id="schedule"
                                name="schedule"
                                value={formData.schedule}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md"
                                required={true}
                            />
                        </div>
                        <button type="submit" className="inline-flex items-center justify-center col-span-2 bg-blue-900 text-white px-4 py-2  rounded-md hover:bg-purple-600">
                            Create Room
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Schedule;
