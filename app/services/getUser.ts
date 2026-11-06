import axios from "axios";
import { User } from "../types/user";
import { baseURL } from "../config";
export const getUser = async (id:number) => {
  try {
    const response = await axios.get<User>(`${baseURL}user/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuario:", error);
  } finally {
  }
};
