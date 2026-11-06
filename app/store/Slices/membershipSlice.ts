import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "@/app/config";
import { MembershipType } from "@/app/types/memberships";

// 2. Define el estado inicial con el array vacío y estados de carga
interface MembershipState {
  data: MembershipType[]; // <--- ¡Aquí se guardará el array de la petición!
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: MembershipState = {
  data: [],
  status: "idle",
  error: null,
};

// 3. Crea el Thunk para hacer la petición con Axios
export const fetchMembership = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get<MembershipType[]>(`${baseURL}memberships`);
  return response.data; // Esto se convierte automáticamente en el `action.payload`
});

// 4. Crea el slice y maneja los estados fulfilled (exitoso)
export const membershipSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembership.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMembership.fulfilled, (state, action) => {
        state.status = "succeeded";
        // ¡Aquí guardamos los datos de axios dentro del array!
        state.data = action.payload;
      })
      .addCase(fetchMembership.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Error al cargar";
      });
  },
});

export default membershipSlice.reducer;
