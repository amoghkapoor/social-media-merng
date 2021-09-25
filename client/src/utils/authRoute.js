import React from 'react';
import { Route, Redirect } from 'react-router-dom'

const AuthRoute = ({ component: Component, ...rest }) => {
    let token = localStorage.getItem("jwtToken")
    console.log(token)
    return (
        <Route
            {...rest}
            render={props =>
                token !== null ? <Redirect to="/home" /> : <Component {...props} />
            }
        />
    )
}

export default AuthRoute