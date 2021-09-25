import React, {useContext} from 'react'
import {NavLink} from 'react-router-dom'

import { AuthContext } from '../context/auth'

import "../styles/components/navbar.scss"

const Navbar = () => {
    const {logout} = useContext(AuthContext)

    return (
        <nav className="navbar-container">
            <div className="navbar-left">
                <NavLink to="/" exact className="nav-link" activeClassName="nav-link-selected">
                    Home
                </NavLink>
            </div>
            <div className="navbar-right">
                <button onClick={logout}>
                    Logout
                </button>
            </div>
        </nav>
    )
}

export default Navbar
