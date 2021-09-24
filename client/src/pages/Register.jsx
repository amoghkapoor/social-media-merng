import React, { useContext, useState } from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import { useForm } from '../utils/hooks';

function Register() {
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_,{data: { register: userData }}){
        window.location.assign('/')
    },
    onError(err) {
        setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values
  });

  function registerUser() {
    addUser();
  }
  
  return (
      <>
      {loading && ("Loading")}
        <form onSubmit={onSubmit} noValidate>
            <h1>Register</h1>
            <input
            placeholder="Username"
            name="username"
            type="text"
            value={values.username}
            onChange={onChange}
            />
            <input
            placeholder="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={onChange}
            />
            <input
            placeholder="Password"
            name="password"
            type="password"
            value={values.password}
            onChange={onChange}
            />
            <input
            placeholder="Confirm Password"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            onChange={onChange}
            />
            <button type="submit">
            Register
            </button>
        </form>
        {Object.keys(errors).length > 0 && (
            Object.values(errors).map(value => (
                <li key={value}>{value}</li>
            ))
        )}
    </>
  );
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Register;