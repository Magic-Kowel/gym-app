import axios from "axios";
import { UserByphoneType } from "../types/user";
import { baseURL } from "../config";
export const getUserbyphone = async (phone:number) => {
  try {
    const response = await axios.get<UserByphoneType>(`${baseURL}userbyphone/${phone}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener user:", error);
  } finally {
  }
};
