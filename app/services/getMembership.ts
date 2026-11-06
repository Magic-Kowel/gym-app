import axios from "axios";
import { MembershipType } from "../types/memberships";
import { baseURL } from "../config";
export const getMembership = async (id:number) => {
  try {
    const response = await axios.get<MembershipType>(`${baseURL}membership/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener membership:", error);
  } finally {
  }
};
