import React from 'react'
import {useQuery} from "@apollo/client"
import gql from 'graphql-tag'
import HashLoader from "react-spinners/HashLoader";
import ScrollTop from "react-scrolltop-button";
import {BsFillArrowUpCircleFill} from "react-icons/bs"
import {Navbar, PostCard} from '../components'
import "../styles/pages/home.scss"

const Home = () => {
    const {loading, data} = useQuery(FETCH_POSTS_QUERY)
    let posts

    if(!loading) {
      posts = data?.getPosts
    }

    return (
        <>
        <Navbar/>

        <ScrollTop 
        text={<BsFillArrowUpCircleFill/>}
        icon={<BsFillArrowUpCircleFill/>}
        distance={200}
        />

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
                        <PostCard post={post} key={post.id} profile/>
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
        imagePath
        username
        createdAt
        edited
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
