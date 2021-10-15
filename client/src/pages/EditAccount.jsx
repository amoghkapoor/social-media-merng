import React, { useContext, useState }from 'react'
import { AuthContext } from '../context/auth'
import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag"
import FileBase from 'react-file-base64';

import { useForm } from "../utils/hooks";

const UpdateUser = () => {
    const {user} = useContext(AuthContext)
    const context = useContext(AuthContext);
    const [avatarUrl, setAvatarUrl] = useState(null)
    const [errors, setErrors] = useState({});

    const { onChange, onSubmit, values } = useForm(updateUserCallback, {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
    });

    useQuery(USER_QUERY, {
        variables: {username: user.username},
        onCompleted(data) {
            setAvatarUrl(data?.getUser?.avatarUrl)
        }
    })

    const [updateUser] = useMutation(UPDATE_USER_MUTATION, {
        update(_, { data: {updateUser: userData} }) {
            context.login(userData);
            window.location.pathname = `/profile/${userData.username}`
        },
        onError(err) {
            console.log(err)
            setErrors(err.graphQLErrors[0].extensions.errors);
        },
        variables: {
            id: values.id,
            username: values.username,
            name: values.name,
            email: values.email,
            avatarUrl
        },
    });

    function updateUserCallback() {
        updateUser();
    }

    return (
        <>
        <div>
            <form onSubmit={onSubmit}>
                <input 
                    type="text" 
                    name='username' 
                    placeholder='username'
                    value={values.username}
                    onChange={onChange}
                />
                <input 
                    type="text" 
                    name='name' 
                    placeholder='name'
                    value={values.name}
                    onChange={onChange}
                />
                <input 
                    type="text" 
                    name='email' 
                    placeholder='email'
                    value={values.email}
                    onChange={onChange}
                />
                <img src={avatarUrl} alt="" />
                <FileBase type="file" multiple={false} onDone={({ base64 }) => setAvatarUrl(base64)} />
                <button type="submit">Submit</button>
            </form>
        </div>
        </>
    )
}

const ChangePassword = () => {
    const {user} = useContext(AuthContext)
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState({});

    const { onChange, onSubmit, values } = useForm(updatePasswordCallback, {
        password: "",
        confirmPassword: ""
    });

    const [updatePassword] = useMutation(UPDATE_PASSWORD_MUTATION, {
        update(_, { data: {updatePassword} }) {
            console.log(updatePassword)
            context.login(updatePassword);
            window.location.pathname = `/profile/${user.username}`
        },
        onError(err) {
            console.error(err)
            console.error(err.graphQLErrors[0].extensions.errors)
            setErrors(err.graphQLErrors[0].extensions.errors);
        },
        variables: {
            id: user.id,
            password: values.password,
            confirmPassword: values.confirmPassword
        },
    });

    function updatePasswordCallback() {
        updatePassword();
    }

    return (
        <>
        <div>
            <form onSubmit={onSubmit}>
                <input 
                    type="text" 
                    name='password' 
                    placeholder='password'
                    value={values.password}
                    onChange={onChange}
                />
                <input 
                    type="text" 
                    name='confirmPassword' 
                    placeholder='confirm password'
                    value={values.confirmPassword}
                    onChange={onChange}
                />
                <button type="submit">Submit</button>
            </form>
        </div>
        </>
    )
} 

const EditAccount = () => {
    const [display, setDisplay] = useState(1)

    return(
        <>
            <button onClick={() => setDisplay(1)}>Edit Account</button>
            <button onClick={() => setDisplay(2)}>Change Password</button>

            <div>
                {display === 1 ? (
                    <UpdateUser/>
                ) : (
                    <ChangePassword/>
                )}
            </div>
        </>
    )
}

export default EditAccount

const UPDATE_USER_MUTATION = gql`
    mutation updateUser(
        $email: String!, 
        $id: ID!, 
        $username: String!, 
        $name: String!
        $avatarUrl: String!
    ){
        updateUser(
            updateInput: {
            email: $email
            id: $id
            username: $username
            name: $name
            avatarUrl: $avatarUrl
        }){
            username
            token
        }
    }
`

const UPDATE_PASSWORD_MUTATION = gql`
    mutation updatePassword(
        $id: ID!, 
        $password: String!, 
        $confirmPassword: String!
        ){
            updatePassword(
                updatePasswordInput: {
                    id: $id
                    password: $password
                    confirmPassword: $confirmPassword
        }){
            token
        }
    }
`

const USER_QUERY = gql`
    query getUser(
        $username: String!
    ){
        getUser(username: $username){
            avatarUrl
        }
    }
`