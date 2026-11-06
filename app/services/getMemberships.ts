import axios from "axios";
import { baseURL } from "../config";
export const getMemberships = async () => {
  try {
    const response = await axios.get(`${baseURL}memberships`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener memberships:", error);
  } finally {
  }
};
