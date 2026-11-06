import axios from "axios";
import { baseURL } from "../config";
export const getPayment = async (id:number) => {
  try {
    const response = await axios.get(`${baseURL}payment/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener pago:", error);
  } finally {
  }
};