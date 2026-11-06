import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "@/app/config";
import { LoginType } from "@/app/types/user";

interface AdmindState {
  data: []; // <--- ¡Aquí se guardará el array de la petición!
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AdmindState = {
  data: [],
  status: "idle",
  error: null,
};
export const login = createAsyncThunk(
  "user/login",
  async (login: LoginType, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseURL}login`, login);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Ocurrió un error desconocido");
    }
  },
);
export const fetchDeleteUser = createAsyncThunk(
  "user/delete",
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${baseURL}user/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Ocurrió un error desconocido");
    }
  },
);
export const fetchUpdateUser = createAsyncThunk(
  "user/update",
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${baseURL}user/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Ocurrió un error desconocido");
    }
  },
);
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        // ¡Aquí guardamos los datos de axios dentro del array!
        state.data = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Error al cargar";
      });
    builder
      .addCase(fetchDeleteUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDeleteUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        // ¡Aquí guardamos los datos de axios dentro del array!
        state.data = action.payload;
      })
      .addCase(fetchDeleteUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Error al cargar";
      });
  },
});
export default userSlice.reducer;
