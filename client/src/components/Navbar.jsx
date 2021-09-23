import React from 'react'
import {NavLink} from 'react-router-dom'

import "../styles/components/navbar.scss"

const Navbar = () => {
    return (
        <nav className="navbar-container">
            <div className="navbar-left">
                <NavLink to="/" exact className="nav-link" activeClassName="nav-link-selected">
                    Home
                </NavLink>
            </div>
            <div className="navbar-right">
            <NavLink to="/login" className="nav-link" activeClassName="nav-link-selected">
                Login
            </NavLink>                
            <NavLink to="/register" className="nav-link-register" >
                Register
            </NavLink>
            </div>
        </nav>
    )
}

export default Navbar
