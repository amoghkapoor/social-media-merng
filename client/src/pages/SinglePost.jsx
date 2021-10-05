import React, {useContext} from 'react'
import {useQuery} from "@apollo/client"
import gql from 'graphql-tag'
import { Navbar, PostCard } from '../components'
import {Link, useParams} from "react-router-dom"
import { AuthContext } from "../context/auth";
import moment from "moment"

const SinglePost = () => {
    const {id} = useParams()

    const {loading, data} = useQuery(GET_POST, {
        variables: {postId: id}
    })

    let post, userData

    if(!loading) {
        post = data?.getPost
    }

    const {loading: userLoading, data: rawUserData} = useQuery(USER_QUERY, {
        skip: loading || false,
        variables: {username: post?.username}
    })

    if(!userLoading) {
        userData = rawUserData?.getUser
    }

    console.log(userData)

    return (
        <>
            <Navbar/>
            {id}
        </>
    )
}

export default SinglePost

const USER_QUERY = gql`
    query getUser(
        $username: String!
    ){
        getUser(username: $username){
            id
            name
            avatarUrl
            username
            email
            createdAt
        }
    }
`

const GET_POST = gql`
    query getPost(
        $postId: ID!
    ){
        getPost(postId: $postId){
        id
        body
        username
        createdAt
        likes{
            id
            username
            createdAt
        }
        comments{
            id
            username
            body
            createdAt
        }
        }
    }
`