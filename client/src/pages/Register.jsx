import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { useHistory, Link } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";

import RegisterSvg from "../assets/RegisterSvg"
import { AuthContext } from "../context/auth";
import { useForm } from "../utils/hooks";
import "../styles/pages/register.scss"

function Register() {
  const history = useHistory();
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  let randomString = Math.random().toString(36).replace(/[^a-z]+/g)
  let  link = `https://avatars.dicebear.com/api/bottts/${randomString}.svg`

  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    avatarUrl: link
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      context.login(userData);
      history.push("/");
      window.location.reload();
    },
    onError(err) {
      // console.log(err.clientErrors)
      // console.log(err.extraInfo)
      // console.log(err.graphQLErrors)
      // console.log(err.message)
      // console.log(err.networkError)
      // console.log(err.name)
      // console.log(err.stack)
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values,
  });

  function registerUser() {
    addUser();
  }

  console.log(errors)


  return (
    <>
    {loading && (
            <div className="loader-container">
            <HashLoader loading={loading} size={150} color={"#4482ff"} />
            </div>
        )}
      <div className="register-form-container">
        <form
          onSubmit={onSubmit}
          noValidate
          autoComplete="off"
          className="register-form"
        >
          <h1 className="register-form-title">Register</h1>

          <div className="register-input-container">
            <label htmlFor="name" className="register-form-label">
              Name
            </label>
            <input
              name="name"
              type="text"
              value={values.name}
              onChange={onChange}
              className={errors.name ? "register-input error" : "register-input"}
            />
          </div>

          <div className="register-input-container">
            <label htmlFor="username" className="register-form-label">
              Username
            </label>
            <input
              name="username"
              type="text"
              value={values.username}
              onChange={onChange}
              className={errors.username ? "register-input error" : "register-input"}
            />
          </div>

          <div className="register-input-container">
            <label htmlFor="email" className="register-form-label">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={values.email}
              onChange={onChange}
              className={errors.email ? "register-input error" : "register-input"}
            />
          </div>

          <div className="register-input-container">
            <label htmlFor="password" className="register-form-label">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={values.password}
              onChange={onChange}
              className={errors.password ? "register-input error" : "register-input"}
            />
          </div>

          <div className="register-input-container">
            <label htmlFor="confirmPassword" className="register-form-label">
            Confirm Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              value={values.confirmPassword}
              onChange={onChange}
              className={errors.password ? "register-input error" : "register-input"}
            />
          </div>

         <div className="register-input-container">
                    <button type="submit" className="register-form-btn">
                        Register
                    </button>
                    <p className="register-link-container">
                      Already have an account?
                      <Link to="/" className="register-link"> Sign in </Link>
                    </p>
                    </div>


          {Object.keys(errors).length > 0 && (
                    <div className="register-error-container">
                        {Object.keys(errors).length > 0 &&
                            Object.values(errors).map((value) => (
                                <li key={value}>{value}</li>
                            ))}
                    </div>)}
        </form>
        <div className="register-svg">
            <RegisterSvg/>
        </div>
      </div>
    </>
  );
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $avatarUrl: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
    $name: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
        name: $name
        avatarUrl: $avatarUrl
      }
    ) {
      id
      name
      avatarUrl
      email
      username
      createdAt
      token
    }
  }
`;

export default Register;