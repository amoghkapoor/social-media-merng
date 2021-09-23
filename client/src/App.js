import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Home, Login, Register } from "./pages"
import { Navbar } from "./components"

import "./styles/defaults/app.scss"

const App = () => {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
      </Switch >
    </Router>
  )
}

export default App
