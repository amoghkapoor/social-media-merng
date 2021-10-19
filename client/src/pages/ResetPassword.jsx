import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import PasswordMask from "react-password-mask";
import * as BsIcon from "react-icons/bs";
import { Link } from "react-router-dom";

import { useForm } from "../utils/hooks";
import "../styles/pages/resetPassword.scss";

const ResetPassword = () => {
    const token = new URLSearchParams(window.location.search).get("token");
    const id = new URLSearchParams(window.location.search).get("id");
    const [errors, setErrors] = useState({});
    const [display, setDisplay] = useState(1);

    const { onChange, onSubmit, values } = useForm(callback, {
        password: "",
        confirmPassword: "",
    });

    const [resetPassword] = useMutation(RESET_PASSWORD_MUTATION, {
        variables: {
            password: values.password,
            confirmPassword: values.confirmPassword,
            token,
            id,
        },
        onError(err) {
            console.error(err.graphQLErrors[0].extensions.errors);
            setErrors(err.graphQLErrors[0].extensions.errors);
        },
        update(_, { data }) {
            console.log(data);
            setDisplay(2);
        },
    });

    function callback() {
        resetPassword();
    }

    return (
        <>
            {display === 1 ? (
                <div className="reset-password-outer-container">
                    <form className="reset-password-form" onSubmit={onSubmit}>
                        <div className="heading">Socialize</div>

                        <div className="reset-password-input-container">
                            <label
                                className="reset-password-input-label"
                                htmlFor="password"
                            >
                                New Password
                            </label>
                            <div className="reset-password-input-wrapper">
                                <PasswordMask
                                    name="password"
                                    type="password"
                                    value={values.password}
                                    inputClassName={
                                        errors.password ||
                                        errors.token ||
                                        errors.general
                                            ? "reset-password-input error"
                                            : "reset-password-input"
                                    }
                                    onChange={onChange}
                                    showButtonContent={<BsIcon.BsFillEyeFill />}
                                    hideButtonContent={
                                        <BsIcon.BsFillEyeSlashFill />
                                    }
                                    buttonClassName="password-show-button"
                                    useVendorStyles={false}
                                    autoComplete="off"
                                />
                            </div>

                            <label
                                className="reset-password-input-label"
                                htmlFor="confirmPassword"
                            >
                                Confirm New Password
                            </label>
                            <div className="reset-password-input-wrapper">
                                <PasswordMask
                                    name="confirmPassword"
                                    type="password"
                                    value={values.confirmPassword}
                                    inputClassName={
                                        errors.password ||
                                        errors.token ||
                                        errors.general
                                            ? "reset-password-input error"
                                            : "reset-password-input"
                                    }
                                    onChange={onChange}
                                    showButtonContent={<BsIcon.BsFillEyeFill />}
                                    hideButtonContent={
                                        <BsIcon.BsFillEyeSlashFill />
                                    }
                                    buttonClassName="password-show-button"
                                    useVendorStyles={false}
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        {Object.keys(errors).length > 0 ? (
                            <div className="reset-password-error-container">
                                {Object.keys(errors).length > 0 &&
                                    Object.values(errors).map((value) => (
                                        <li key={value}>{value}</li>
                                    ))}
                            </div>
                        ) : (
                            <div
                                style={{ height: "4rem", marginTop: "2rem" }}
                            />
                        )}
                        <button className="reset-password-btn" type="submit">
                            Update Password
                        </button>
                    </form>
                </div>
            ) : (
                <div className="reset-password-confirm-container">
                    <div className="reset-password-confirm-content">
                        <div className="confirmation-heading">
                            Password updated successfully! 🎉
                        </div>
                        <div className="confirmation-body">
                            Head back to the home page to login
                            <div className="confirmation-link">
                                <Link to="/">Home</Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ResetPassword;

const RESET_PASSWORD_MUTATION = gql`
    mutation resetPassword(
        $password: String!
        $confirmPassword: String!
        $token: String!
        $id: ID!
    ) {
        resetPassword(
            password: $password
            confirmPassword: $confirmPassword
            token: $token
            id: $id
        )
    }
`;
