'use client'
import { useState } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from './../store/store'

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // Usamos useState con una función para que makeStore() 
  // solo se ejecute una única vez al montar el componente.
  const [store] = useState<AppStore>(() => makeStore())

  return <Provider store={store}>{children}</Provider>
}