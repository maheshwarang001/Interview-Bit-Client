import axios from 'axios';

export async function validateToken(token) {
  const url = `http://localhost:6000/auth/validate?token=${token}`;
  const headers = {
    'Content-Type': 'application/json',
    // Add any additional headers as needed
  };

  try {
    const response = await axios.post(url, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
}