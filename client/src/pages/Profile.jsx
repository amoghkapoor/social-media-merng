import React, {useContext} from 'react'
import {useQuery} from "@apollo/client"
import gql from 'graphql-tag'
import { Navbar } from '../components'
import {useParams} from "react-router-dom"
import { AuthContext } from "../context/auth";

const Profile = () => {
    const {user: {username}} = useContext(AuthContext)
    const {id} = useParams()

    const {loading, data} = useQuery(USER_QUERY, {
        variables: {username: id}
    })
    let user

    if(!loading) {
        user = data.getUser
    }
    console.log(user)

    return (
        <>
            <Navbar/>
            {user && (
                <>
                {user.id} 
                <br />
                {user.name}
                <br />
                {user.username}
                <br />
                {user.email}
                <br />
                {user.createdAt}
                </>
            )}
        </>
    )
}

export default Profile

const USER_QUERY = gql`
    query getUser(
        $username: String!
    ){
        getUser(username: $username){
            id
            name
            username
            email
            createdAt
        }
    }
`