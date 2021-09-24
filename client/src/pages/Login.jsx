import React, { useContext, useState } from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import { useForm } from '../utils/hooks';

function Register() {
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: '',
    password: '',
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_,{data: {login}}){
        console.log(login);
        window.location.assign('/')
    },
    onError(err) {
        setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values
  });

  function loginUserCallback() {
    loginUser();
  }
  
  return (
      <>
      {loading && ("Loading")}
        <form onSubmit={onSubmit} noValidate>
            <h1>Login</h1>
            <input
            placeholder="Username"
            name="username"
            type="text"
            value={values.username}
            onChange={onChange}
            />
            <input
            placeholder="Password"
            name="password"
            type="password"
            value={values.password}
            onChange={onChange}
            />
            <button type="submit">
            Login
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

const LOGIN_USER = gql`
  mutation login(
    $username: String!
    $password: String!
  ) {
    login(
        username: $username
        password: $password
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