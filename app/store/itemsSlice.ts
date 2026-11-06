import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// 1. Define la interfaz del estado indicando que tu variable es un array
interface ItemsState {
  list: string[]; // <--- Aquí tienes tu variable tipo array de strings (puedes cambiar string por la interfaz de tu objeto)
}

const initialState: ItemsState = {
  list: ['Elemento 1', 'Elemento 2'], // Array inicial
}

export const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    // Acción para agregar un elemento al array
    addItem: (state, action: PayloadAction<string>) => {
      state.list.push(action.payload)
    },
    // Acción para eliminar un elemento por su índice
    removeItem: (state, action: PayloadAction<number>) => {
      state.list.splice(action.payload, 1)
    },
    // Acción para vaciar el array completo
    clearItems: (state) => {
      state.list = []
    }
  },
})

export const { addItem, removeItem, clearItems } = itemsSlice.actions
export default itemsSlice.reducer