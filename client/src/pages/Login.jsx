import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { useHistory, Link } from "react-router-dom";

import { AuthContext } from "../context/auth";
import { useForm } from "../utils/hooks";
import LoginSvg from "../assets/LoginSvg";
import "../styles/pages/login.scss";
function Login() {
    const history = useHistory();
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState({});

    const { onChange, onSubmit, values } = useForm(loginUserCallback, {
        username: "",
        password: "",
    });

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(_, { data: { login: userData } }) {
            context.login(userData);
            history.push("/");
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.errors);
        },
        variables: values,
    });

    function loginUserCallback() {
        loginUser();
    }

    return (
        <>
            {loading && "Loading"}
            <div className="login-form-container">
                <form
                    onSubmit={onSubmit}
                    noValidate
                    autoComplete="off"
                    className="login-form"
                >
                    <h1 className="login-form-title">Login</h1>

                    <div className="login-input-container">
                        <label className="login-form-label" htmlFor="username">
                            Username
                        </label>
                        <input
                            name="username"
                            type="text"
                            value={values.username}
                            onChange={onChange}
                            className="login-input"
                        />
                    </div>

                    <div className="login-input-container">
                        <label className="login-form-label" htmlFor="password">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            value={values.password}
                            onChange={onChange}
                            className="login-input"
                        />
                        <p className="forget-password">Forgot Password?</p>
                    </div>

                    <div className="login-input-container">
                    <button type="submit" className="login-form-btn">
                        Login
                    </button>
                    <Link to="/register">
                      register
                    </Link>
                    </div>
                    {Object.keys(errors).length > 0 && (
                    <div className="login-error-container">
                        {Object.keys(errors).length > 0 &&
                            Object.values(errors).map((value) => (
                                <li key={value}>{value}</li>
                            ))}
                    </div>)}
                </form>
                <div className="login-svg">
                    <LoginSvg />
                </div>
            </div>
        </>
    );
}

const LOGIN_USER = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            id
            email
            username
            createdAt
            token
        }
    }
`;

export default Login;