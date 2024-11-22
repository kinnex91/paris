const BASE_URL  =  import.meta.env.VITE_BACKEND_URL+"/tournaments";
import axios from 'axios';

export const getTournaments = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const createTournament = async (tournament) => {
  const response = await axios.post(BASE_URL, tournament);
  return response.data;
};

export const updateTournament = async (id, tournament) => {
  const response = await axios.put(`${BASE_URL}/${id}`, tournament);
  return response.data;
};

export const deleteTournament = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};
