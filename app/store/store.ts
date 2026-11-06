import { configureStore } from "@reduxjs/toolkit";
import itemsReducer from "./itemsSlice"; // <--- Importa tu slice de items
import { membershipSlice } from "./Slices/membershipSlice";
import { admindSlice } from "./Slices/admindSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      items: itemsReducer, // <--- Regístralo aquí
      memberships: membershipSlice.reducer,
      admind: admindSlice.reducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
