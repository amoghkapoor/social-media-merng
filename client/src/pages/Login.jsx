import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { useHistory, Link } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import PasswordMask from "react-password-mask";
import * as BsIcon from "react-icons/bs";

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
            console.error(err);
            // setErrors(err.graphQLErrors[0].extensions.errors);
        },
        variables: values,
    });

    function loginUserCallback() {
        loginUser();
    }

    return (
        <>
            {loading && (
                <div className="loader-container">
                    <HashLoader
                        loading={loading}
                        size={150}
                        color={"#4482ff"}
                    />
                </div>
            )}
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
                            className={
                                errors.username || errors.general
                                    ? "login-input error"
                                    : "login-input"
                            }
                        />
                    </div>

                    <div className="login-input-container">
                        <label className="login-form-label" htmlFor="password">
                            Password
                        </label>
                        <PasswordMask
                            name="password"
                            type="password"
                            value={values.password}
                            inputClassName={
                                errors.password || errors.general
                                    ? "login-input error"
                                    : "login-input"
                            }
                            onChange={onChange}
                            showButtonContent={<BsIcon.BsFillEyeFill />}
                            hideButtonContent={<BsIcon.BsFillEyeSlashFill />}
                            buttonClassName="password-show-button"
                            useVendorStyles={false}
                        />
                        <Link to="/forgot-password" className="forget-password">
                            Forgot Password?
                        </Link>
                    </div>

                    <div className="login-input-container">
                        <button type="submit" className="login-form-btn">
                            Login
                        </button>
                        <p className="register-link-container">
                            Don't have an account?
                            <Link to="/register" className="register-link">
                                {" "}
                                Register now{" "}
                            </Link>
                        </p>
                    </div>
                    {Object.keys(errors).length > 0 && (
                        <div className="login-error-container">
                            {Object.keys(errors).length > 0 &&
                                Object.values(errors).map((value) => (
                                    <li key={value}>{value}</li>
                                ))}
                        </div>
                    )}
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
            name
            avatarUrl
            username
            createdAt
            token
        }
    }
`;

export default Login;
