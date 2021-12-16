import React, { useContext, useState } from "react";
import { AuthContext } from "../context/auth";
import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import PasswordMask from "react-password-mask";
import * as BsIcon from "react-icons/bs";
import Dropzone from "react-dropzone";

import { Navbar } from "../components";
import { useForm } from "../utils/hooks";
import "../styles/pages/editAccount.scss";

const UpdateUser = () => {
    const { user } = useContext(AuthContext);
    const context = useContext(AuthContext);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [errors, setErrors] = useState({});
    const [fieldValue, setFieldValue] = useState();

    const { onChange, onSubmit, values } = useForm(updateUserCallback, {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
    });

    useQuery(USER_QUERY, {
        variables: { username: user.username },
        onCompleted(data) {
            setAvatarUrl(data?.getUser?.avatarUrl);
        },
    });

    const [updateUser] = useMutation(UPDATE_USER_MUTATION, {
        update(_, { data: { updateUser: userData } }) {
            context.login(userData);
            window.location.pathname = `/profile/${userData.username}`;
        },
        onError(err) {
            console.error(err.graphQLErrors[0].extensions.errors);
            setErrors(err.graphQLErrors[0].extensions.errors);
        },
        variables: {
            id: values.id,
            username: values.username,
            name: values.name,
            email: values.email,
            avatarUrl: fieldValue,
        },
    });

    console.log(fieldValue);

    function updateUserCallback() {
        updateUser();
    }

    return (
        <>
            <form className="update-user-form" onSubmit={onSubmit}>
                <div className="update-user-image-container">
                    <img
                        src={
                            `${process.env.REACT_APP_SERVER_URL}/images/${avatarUrl}.jpeg` ||
                            fieldValue.preview
                        }
                        alt=""
                    />
                </div>
                <Dropzone
                    multiple={false}
                    onDrop={([file]) => {
                        Object.assign(file, {
                            preview: URL.createObjectURL(file),
                        });
                        setFieldValue(file);
                    }}
                    accept="image/*"
                >
                    {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <p>
                                Drag 'n' drop some files here, or click to
                                select files
                            </p>
                        </div>
                    )}
                </Dropzone>
                <div className="update-user-input-wrapper">
                    <label
                        htmlFor="username"
                        className="update-user-input-label"
                    >
                        Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        placeholder="username"
                        value={values.username}
                        onChange={onChange}
                        className={
                            errors.username
                                ? "update-user-input error"
                                : "update-user-input"
                        }
                    />
                    <label htmlFor="name" className="update-user-input-label">
                        Name
                    </label>

                    <input
                        type="text"
                        name="name"
                        placeholder="name"
                        value={values.name}
                        onChange={onChange}
                        className={
                            errors.name
                                ? "update-user-input error"
                                : "update-user-input"
                        }
                    />
                    <label htmlFor="email" className="update-user-input-label">
                        Email
                    </label>
                    <input
                        type="text"
                        name="email"
                        placeholder="email"
                        value={values.email}
                        onChange={onChange}
                        className={
                            errors.email
                                ? "update-user-input error"
                                : "update-user-input"
                        }
                    />
                </div>
                {Object.keys(errors).length > 0 ? (
                    <div className="update-user-error-container">
                        {Object.keys(errors).length > 0 &&
                            Object.values(errors).map((value) => (
                                <li key={value}>{value}</li>
                            ))}
                    </div>
                ) : (
                    <div style={{ height: "4rem", marginTop: "2rem" }} />
                )}
                <button className="update-user-btn" type="submit">
                    Update User
                </button>
            </form>
        </>
    );
};

const ChangePassword = () => {
    const { user } = useContext(AuthContext);
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState({});

    const { onChange, onSubmit, values } = useForm(updatePasswordCallback, {
        password: "",
        confirmPassword: "",
    });

    const [updatePassword] = useMutation(UPDATE_PASSWORD_MUTATION, {
        update(_, { data: { updatePassword } }) {
            console.log(updatePassword);
            context.login(updatePassword);
            window.location.pathname = `/profile/${user.username}`;
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.errors);
        },
        variables: {
            id: user.id,
            password: values.password,
            confirmPassword: values.confirmPassword,
        },
    });

    function updatePasswordCallback() {
        updatePassword();
    }

    return (
        <>
            <form onSubmit={onSubmit} className="update-password-form">
                <div className="update-password-input-container">
                    <label
                        className="update-password-input-label"
                        htmlFor="password"
                    >
                        New Password
                    </label>

                    <div className="update-password-input-wrapper">
                        <PasswordMask
                            name="password"
                            type="password"
                            value={values.password}
                            inputClassName={
                                errors.password || errors.general
                                    ? "update-password-input error"
                                    : "update-password-input"
                            }
                            onChange={onChange}
                            showButtonContent={<BsIcon.BsFillEyeFill />}
                            hideButtonContent={<BsIcon.BsFillEyeSlashFill />}
                            buttonClassName="password-show-button"
                            useVendorStyles={false}
                            autoComplete="off"
                        />
                    </div>

                    <label
                        className="update-password-input-label"
                        htmlFor="confirmPassword"
                    >
                        Confirm New Password
                    </label>
                    <div className="update-password-input-wrapper">
                        <PasswordMask
                            name="confirmPassword"
                            type="password"
                            value={values.confirmPassword}
                            inputClassName={
                                errors.password || errors.general
                                    ? "update-password-input error"
                                    : "update-password-input"
                            }
                            onChange={onChange}
                            showButtonContent={<BsIcon.BsFillEyeFill />}
                            hideButtonContent={<BsIcon.BsFillEyeSlashFill />}
                            buttonClassName="password-show-button"
                            useVendorStyles={false}
                            autoComplete="off"
                        />
                    </div>
                </div>

                {Object.keys(errors).length > 0 ? (
                    <div className="update-password-error-container">
                        {Object.keys(errors).length > 0 &&
                            Object.values(errors).map((value) => (
                                <li key={value}>{value}</li>
                            ))}
                    </div>
                ) : (
                    <div style={{ height: "4rem", marginTop: "2rem" }} />
                )}
                <button className="update-password-btn" type="submit">
                    Update Password
                </button>
            </form>
        </>
    );
};

const EditAccount = () => {
    const [display, setDisplay] = useState(1);

    return (
        <>
            <Navbar />
            <div className="edit-account-container">
                <div className="left">
                    <button
                        className={
                            display === 1
                                ? "selected-option"
                                : "edit-account-options-btn"
                        }
                        onClick={() => setDisplay(1)}
                    >
                        Edit Account
                    </button>
                    <button
                        className={
                            display === 2
                                ? "selected-option"
                                : "edit-account-options-btn"
                        }
                        onClick={() => setDisplay(2)}
                    >
                        Change Password
                    </button>
                </div>

                <div className="right">
                    <div>
                        {display === 1 ? <UpdateUser /> : <ChangePassword />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditAccount;

const UPDATE_USER_MUTATION = gql`
    mutation updateUser(
        $email: String!
        $id: ID!
        $username: String!
        $name: String!
        $avatarUrl: Upload
    ) {
        updateUser(
            updateInput: {
                email: $email
                id: $id
                username: $username
                name: $name
                avatarUrl: $avatarUrl
            }
        ) {
            username
            token
        }
    }
`;

const UPDATE_PASSWORD_MUTATION = gql`
    mutation updatePassword(
        $id: ID!
        $password: String!
        $confirmPassword: String!
    ) {
        updatePassword(
            updatePasswordInput: {
                id: $id
                password: $password
                confirmPassword: $confirmPassword
            }
        ) {
            token
        }
    }
`;

const USER_QUERY = gql`
    query getUser($username: String!) {
        getUser(username: $username) {
            avatarUrl
        }
    }
`;
