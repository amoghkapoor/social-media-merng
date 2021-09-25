import React, {useContext, useState, useEffect} from 'react'
import {NavLink, useLocation, Link} from 'react-router-dom'
import * as AiIcon from 'react-icons/ai'
import * as CgIcon from 'react-icons/cg'
import * as FaIcon from 'react-icons/fa'
import * as BiIcon from 'react-icons/bi'
import * as MdIcon from 'react-icons/md'
import ReactTooltip from 'react-tooltip';

import { AuthContext } from '../context/auth'
import "../styles/components/navbar.scss"

const Navbar = () => {
    const location = useLocation()
    let pathname = location.pathname

    const [fill, setFill] = useState({
        home: true,
        user: false,
        add: false
    })

    useEffect(() => {
        switch(pathname){
            case "/home": 
                setFill({
                    home: true,
                    user: false,
                    add: false,
                })
                break;
            case "/profile":
                setFill({
                    home: false,
                    user: true,
                    add: false,
                })
                break;
            case "/add-post":
                setFill({
                    home: false,
                    user: false,
                    add: true,
                })
                break;
            default:
                setFill({
                    home: false,
                    user: false,
                    add: false,
                })
        }
    }, [pathname])
    
    const {logout} = useContext(AuthContext)

    return (
        <nav className="navbar-container">
            <div className="navbar-left">
                <NavLink to="/" exact className="nav-link" activeClassName="nav-link-selected">
                    Socialize
                </NavLink>
            </div>
            <div className="navbar-right">
                <Link to="/home">
                <button data-tip="Home" className="nav-btn">
                    {fill.home ? <AiIcon.AiFillHome/> :
                    <AiIcon.AiOutlineHome/>}
                </button>
                </Link>
                <ReactTooltip effect="solid" place="bottom"/>

                <Link to="/add-post">
                <button data-tip="Add Post" className="nav-btn">
                    {fill.add ? <MdIcon.MdLibraryAdd/> : <BiIcon.BiAddToQueue/>}
                </button>
                </Link>
                <ReactTooltip effect="solid" place="bottom"/>

                <Link to="/profile">
                <button data-tip="Profile" className="nav-btn">
                    {fill.user ? <FaIcon.FaUser/> : <FaIcon.FaRegUser/>}
                </button>
                </Link>
                <ReactTooltip effect="solid" place="bottom"/>

                <button data-tip="Logout" onClick={logout} className="nav-btn">
                    <CgIcon.CgLogOut/>
                </button>
                <ReactTooltip effect="solid" place="bottom"/>

            </div>
        </nav>
    )
}

export default Navbar
