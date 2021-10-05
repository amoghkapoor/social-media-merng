import React from 'react'
import {useQuery} from "@apollo/client"
import gql from 'graphql-tag'
import HashLoader from "react-spinners/HashLoader";

import {Navbar, PostCard} from '../components'
import "../styles/pages/home.scss"

const Home = () => {
    const {loading, data} = useQuery(FETCH_POSTS_QUERY)
    let posts

    if(!loading) {
      posts = data.getPosts
    }

    return (
        <>
        <Navbar/>
        {loading && (
            <div className="loader-container">
            <HashLoader loading={loading} size={150} color={"#4482ff"} />
            </div>
        )}
        <div className="home-container">
            <div className="home-heading">
                Recent posts
            </div>
            {loading 
            ? ("Loading data...")
            : (
                <div className="posts-grid">
                    {posts.map((post => (
                        <PostCard post={post} key={post.id}/>
                    )))}
                </div>
            )
            }
        </div>
        </>
    )
}

const FETCH_POSTS_QUERY = gql`
    query {
        getPosts{
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

export default Home
