import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "@/app/config";
import { admindCreateType, admindListType } from "@/app/types/admind";

interface AdmindState {
  data: []; // <--- ¡Aquí se guardará el array de la petición!
  adminds: admindListType[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AdmindState = {
  data: [],
  adminds: [],
  status: "idle",
  error: null,
};

export const updateAdmind = createAsyncThunk(
  "admind/update",
  async (admindData: admindCreateType, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${baseURL}admind`, admindData);
      return response.data;
    } catch (error: unknown) {
      // 1. Verificamos si es un error de Axios (ej: conflicto 409)
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      // 2. Verificamos si es un error estándar de JavaScript
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      // 3. Fallback por si es cualquier otra cosa inesperada
      return rejectWithValue("Ocurrió un error desconocido");
    }
  },
);
export const createAdmind = createAsyncThunk(
  "admind/createAdmind",
  async (admindData: admindCreateType, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseURL}admind`, admindData);
      return response.data;
    } catch (error: unknown) {
      // 1. Verificamos si es un error de Axios (ej: conflicto 409)
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      // 2. Verificamos si es un error estándar de JavaScript
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      // 3. Fallback por si es cualquier otra cosa inesperada
      return rejectWithValue("Ocurrió un error desconocido");
    }
  },
);
export const fetchAdminds = createAsyncThunk("users/fetchAdminds", async () => {
  const response = await axios.get<admindListType[]>(`${baseURL}adminds`);
  return response.data;
});
export const fetchAdmind = createAsyncThunk(
  "user/fetchAdmind",
  async (admindId: number) => {
    const response = await axios.get<admindListType[]>(
      `${baseURL}admind/${admindId}`,
    );
    return response.data;
  },
);

export const validateEmail = createAsyncThunk(
  "admind/validateEmail",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseURL}validate/email/${email}`);
      return response.data;
    } catch (error: unknown) {
      // 1. Verificamos si es un error de Axios (ej: conflicto 409)
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      // 2. Verificamos si es un error estándar de JavaScript
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      // 3. Fallback por si es cualquier otra cosa inesperada
      return rejectWithValue("Ocurrió un error desconocido");
    }
  },
);
export const validateUpdateEmail = createAsyncThunk(
  "admind/validateUpdateEmail",
  async (
    { email, id }: { email: string; id: string | number },
    { rejectWithValue },
  ) => {
    console.log(email, id);

    try {
      const response = await axios.get(
        `${baseURL}validate/update/email/${email}/${id}`,
      );
      return response.data;
    } catch (error: unknown) {
      // 1. Verificamos si es un error de Axios (ej: conflicto 409)
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      // 2. Verificamos si es un error estándar de JavaScript
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      // 3. Fallback por si es cualquier otra cosa inesperada
      return rejectWithValue("Ocurrió un error desconocido");
    }
  },
);
export const validateUpdatePhone = createAsyncThunk(
  "admind/validateUpdatephone",
  async (
    { email, id }: { email: string; id: string | number },
    { rejectWithValue },
  ) => {
    console.log(email, id);

    try {
      const response = await axios.get(
        `${baseURL}validate/update/phone/${email}/${id}`,
      );
      return response.data;
    } catch (error: unknown) {
      // 1. Verificamos si es un error de Axios (ej: conflicto 409)
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      // 2. Verificamos si es un error estándar de JavaScript
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      // 3. Fallback por si es cualquier otra cosa inesperada
      return rejectWithValue("Ocurrió un error desconocido");
    }
  },
);
export const validatePhone = createAsyncThunk(
  "admind/validatePhone",
  async (phone: string | number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseURL}validate/phone/${phone}`);
      return response.data;
    } catch (error: unknown) {
      // 1. Verificamos si es un error de Axios (ej: conflicto 409)
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      // 2. Verificamos si es un error estándar de JavaScript
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      // 3. Fallback por si es cualquier otra cosa inesperada
      return rejectWithValue("Ocurrió un error desconocido");
    }
  },
);
export const admindSlice = createSlice({
  name: "admind",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAdmind.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createAdmind.fulfilled, (state, action) => {
        state.status = "succeeded";
        // ¡Aquí guardamos los datos de axios dentro del array!
        state.data = action.payload;
      })
      .addCase(createAdmind.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Error al cargar";
      });
    builder
      .addCase(fetchAdminds.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAdminds.fulfilled, (state, action) => {
        state.status = "succeeded";
        // ¡Aquí guardamos los datos de axios dentro del array!
        state.adminds = action.payload;
      })
      .addCase(fetchAdminds.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Error al cargar";
      });
    builder
      .addCase(fetchAdmind.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAdmind.fulfilled, (state, action) => {
        state.status = "succeeded";
        // ¡Aquí guardamos los datos de axios dentro del array!
        state.adminds = action.payload;
      })
      .addCase(fetchAdmind.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Error al cargar";
      });
    builder
      .addCase(updateAdmind.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateAdmind.fulfilled, (state, action) => {
        state.status = "succeeded";
        // ¡Aquí guardamos los datos de axios dentro del array!
        state.adminds = action.payload;
      })
      .addCase(updateAdmind.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Error al cargar";
      });
    builder
      .addCase(validateEmail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(validateEmail.fulfilled, (state, action) => {
        state.status = "succeeded";
        // ¡Aquí guardamos los datos de axios dentro del array!
        state.adminds = action.payload;
      })
      .addCase(validateEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Error al cargar";
      });
    builder
      .addCase(validateUpdateEmail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(validateUpdateEmail.fulfilled, (state, action) => {
        state.status = "succeeded";
        // ¡Aquí guardamos los datos de axios dentro del array!
        state.adminds = action.payload;
      })
      .addCase(validateUpdateEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Error al cargar";
      });
    builder
      .addCase(validatePhone.pending, (state) => {
        state.status = "loading";
      })
      .addCase(validatePhone.fulfilled, (state, action) => {
        state.status = "succeeded";
        // ¡Aquí guardamos los datos de axios dentro del array!
        state.adminds = action.payload;
      })
      .addCase(validatePhone.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Error al cargar";
      });
    builder
      .addCase(validateUpdatePhone.pending, (state) => {
        state.status = "loading";
      })
      .addCase(validateUpdatePhone.fulfilled, (state, action) => {
        state.status = "succeeded";
        // ¡Aquí guardamos los datos de axios dentro del array!
        state.adminds = action.payload;
      })
      .addCase(validateUpdatePhone.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Error al cargar";
      });
  },
});
export default admindSlice.reducer;
