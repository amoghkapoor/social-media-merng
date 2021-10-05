import React, {useContext} from 'react'
import {useQuery} from "@apollo/client"
import gql from 'graphql-tag'
import { Navbar, PostCard } from '../components'
import {Link, useParams} from "react-router-dom"
import { AuthContext } from "../context/auth";
import moment from "moment"
import * as BsIcon from "react-icons/bs"

import "../styles/pages/profile.scss"

const Profile = () => {
    const {user: {username}} = useContext(AuthContext)
    const {id} = useParams()

    const {loading, data} = useQuery(USER_QUERY, {
        variables: {username: id}
    })

    const { loading: postsLoading, data: postsData} = useQuery(GET_POSTS, {
        variables: {username: id}
    })

    let userData, userPostsData

    if(!loading) {
        userData = data.getUser
    }
    if(!postsLoading) {
        userPostsData = postsData.getPostsByUsername
    }
    
    return (
        <>
            <Navbar/>
            {userData && (
                <div className="profile-outer-container">
                    <div className="user-container">
                        <div className="user-image-container">
                            <img src={userData.avatarUrl} alt={userData.name} className="user-image" />
                        </div>
                        <div className="user-info">
                            <div className="user-info-left">
                                <h3 className="username">{userData.username}</h3>
                                <h4 className="user-name">{userData.name}</h4>
                            </div>
                            <div className="user-info-right">
                                {userData.username === username && (
                                    <Link className="edit-profile" to = {`/account/edit`}>
                                        <button >Edit Profile</button>
                                    </Link>
                                )}
                                <h5 className="user-createdAt">Joined {moment(userData.createdAt).format('MMMM DD, YYYY')}</h5>
                            </div>
                        </div>
                    </div>
                    <div className="user-posts">
                        <div className="user-posts-heading">
                        <BsIcon.BsGrid3X3/>
                        <span>Posts</span>
                        </div>
                        {!postsLoading && (
                            <div className="user-posts-grid">
                            {userPostsData.map((post => (
                                <PostCard post={post} key={post.id}/>
                            )))}
                            </div>
                        )}
                    </div>
                </div>
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
            avatarUrl
            username
            email
            createdAt
        }
    }
`

const GET_POSTS = gql`
    query getPostsByUsername(
        $username: String!
    ){
        getPostsByUsername(username: $username){
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