import axios from "axios";
import { baseURL } from "../config";
export const getPayments = async () => {
  try {
    const response = await axios.get(`${baseURL}payments`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener pagos:", error);
  } finally {
  }
};