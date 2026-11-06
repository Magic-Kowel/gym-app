import axios from "axios";
import { User } from "../types/user";
import { baseURL } from "../config";
export const getUsers = async () => {
  try {
    const response = await axios.get<User[]>(`${baseURL}users`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
  } finally {
  }
};
