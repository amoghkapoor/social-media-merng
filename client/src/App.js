import React from 'react'
import Router from "./Router"
import { AuthProvider } from './context/auth'
import "./styles/defaults/app.scss"

const App = () => {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  )
}

export default App
