import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import * as HiIcon from "react-icons/hi";

import "../styles/pages/forgotPassword.scss";
import ForgotPasswordSvg from "../assets/ForgotPasswordSvg";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
    const [values, setValues] = useState("");
    const [query, setQuery] = useState(true);
    const [errors, setErrors] = useState();

    const onChange = (e) => {
        setValues(e.target.value);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setQuery(false);
    };

    const { data, error } = useQuery(USER_QUERY, {
        skip: query,
        variables: { email: values },
        onCompleted: () => {
            let input = document.querySelector(".forgot-password-input");
            input.blur();
        },
    });

    useEffect(() => {
        if (error) {
            setQuery(true);
            setErrors(error.graphQLErrors[0].message);
            let input = document.querySelector(".forgot-password-input");
            input.focus();
        }
    }, [error, data]);

    return (
        <>
            <div className="forgot-password-container">
                <div className="left">
                    <ForgotPasswordSvg />
                </div>
                <div className="right">
                    <div className="forgot-password-heading">
                        Forgot Password
                    </div>
                    <p className="forgot-password-caption">
                        Enter your email and we'll send you a link to reset your
                        password
                    </p>

                    <form onSubmit={onSubmit} className="forgot-password-form">
                        <div className="forgot-password-input-container">
                            <label
                                htmlFor="email"
                                className="forgot-password-label"
                            >
                                Email
                            </label>
                            <input
                                type="text"
                                name="email"
                                onChange={onChange}
                                className={
                                    errors
                                        ? "forgot-password-input error"
                                        : "forgot-password-input"
                                }
                            />
                        </div>

                        <button type="submit" className="forgot-password-btn">
                            Submit
                        </button>

                        <div className="forgot-password-error">
                            {errors && <>{errors}</>}
                        </div>
                    </form>

                    <Link to="/" className="signin-link">
                        <HiIcon.HiArrowLeft /> Back to sign in
                    </Link>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;

const USER_QUERY = gql`
    query requestPasswordReset($email: String!) {
        requestPasswordReset(email: $email)
    }
`;
