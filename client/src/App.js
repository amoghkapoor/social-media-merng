import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Home, Login, Register } from "./pages"
import { Navbar } from "./components"
import { AuthProvider } from './context/auth'
import "./styles/defaults/app.scss"

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </Switch >
      </Router>
    </AuthProvider>
  )
}

export default App
