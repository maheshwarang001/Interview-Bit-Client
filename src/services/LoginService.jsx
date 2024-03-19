import axios from "axios"
import Cookies from 'js-cookie';

const BASE_URL = "http://localhost:6000/auth/";

const customAxios = axios.create({
  baseURL: BASE_URL+"/token",
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
    // Add any additional headers you need
  },
});



class LoginService {
    save(user) {
      return customAxios.post('', user)
        .then(response => {
          const { data } = response; // Access the 'data' property of the response
          const token = data; // Assign the token from the 'data' property
          // localStorage.setItem('token', token); // Store the token in local storage
          Cookies.set('token',token, { secure: true, sameSite: 'strict' })
          console.log(Cookies.get('token'));
          return response;
        });
    }


  }

    
export default new LoginService