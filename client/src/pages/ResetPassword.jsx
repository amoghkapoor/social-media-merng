import React from "react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

import { useForm } from "../utils/hooks";

const ResetPassword = () => {
    const token = new URLSearchParams(window.location.search).get("token");
    const id = new URLSearchParams(window.location.search).get("id");

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
        onError(error) {
            console.error(error.graphQLErrors[0].extensions.errors);
            console.error(error.graphQLErrors[0]);
        },
        update(_, { data }) {
            console.log(data);
        },
    });

    function callback() {
        resetPassword();
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    placeholder="password"
                    name="password"
                    onChange={onChange}
                />
                <input
                    type="text"
                    placeholder="confirm password"
                    name="confirmPassword"
                    onChange={onChange}
                />
                <button type="submit">Submit</button>
            </form>
        </div>
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
