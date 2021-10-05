import React, {useContext, useState, useEffect} from 'react'
import * as BsIcon from "react-icons/bs"
import gql from "graphql-tag"
import {useMutation} from "@apollo/client"
import { IconContext } from "react-icons";

import {AuthContext} from "../context/auth"

const LikeButton = ({id, likes}) => {
    const {user} = useContext(AuthContext)
    const [liked, setLiked] = useState(false)
    let likeCount = likes.length

    useEffect(() => {
        if(likes.find(like => like.username === user.username)){
            setLiked(true)
        }
        else{
            setLiked(false)
        }
    }, [user, likes])

    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: {postId: id}
    })

    const likedButton = 
        liked ? (
            <IconContext.Provider value={{color: "red"}}>
                <button className="like-btn">
                    <BsIcon.BsHeartFill/>
                </button>
            </IconContext.Provider>
        ) : (
            <button className="like-btn">
                <BsIcon.BsHeart/>
            </button>
        )

    return (
        <div className="post-like-action" onClick={likePost}>
            {likedButton}
            {likeCount}
        </div>
    )
}

export default LikeButton

const LIKE_POST_MUTATION = gql`
    mutation likePost($postId: ID!){
        likePost(postId: $postId){
            id
            likes{
                username
                id
                createdAt
            }
        }
    }
`