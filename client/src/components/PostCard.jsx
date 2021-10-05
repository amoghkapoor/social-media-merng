import React, { useContext }from 'react'
import moment from 'moment'
import _ from 'lodash'
import * as FaIcon from "react-icons/fa"
import * as BsIcon from "react-icons/bs"
import * as VscIcon from "react-icons/vsc"
import {
    Menu,
    MenuItem,
    MenuButton,
    SubMenu
  } from '@szhsin/react-menu';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import gql from 'graphql-tag'
import {useMutation} from "@apollo/client"

import {LikeButton} from "./"
import {AuthContext} from "../context/auth"
import "../styles/components/postCard.scss"
import { Link } from 'react-router-dom'

const PostCard = ({post: {body, username, createdAt, id, likes, comments}}) => {
    let postLink = `/post/${id}`
    let userLink = `/profile/${username}`

    const {user} = useContext(AuthContext)
    let commentCount = comments.length

    const [deletePost] = useMutation(DELETE_POST_MUTATION, {
        variables: {postId: id}
    })

    const onDelete = () => {
        confirmAlert({
            title: 'Delete post?',
            message: 'Are you sure you want to delete this post?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => deletePost()
              },
              {
                label: 'No',
                onClick: () => null
              }
            ]
          });
    }

    return (
        <div className="post-card">
            <div className="post-user-container">
                <Link to={userLink}>
                    <div className="post-user-image"><FaIcon.FaRegUserCircle/></div>
                </Link>
                <Link to={userLink}>
                    <div className="post-username">{username}</div>
                </Link>
                <Menu menuButton={<MenuButton className="menu-btn"><BsIcon.BsThreeDots/></MenuButton>} transition>
                    {user.username === username && (<MenuItem onClick={onDelete} className="delete-menu-button">Delete</MenuItem>)}
                    
                    <MenuItem>
                        <Link to = {postLink}>Go to post
                        </Link>
                    </MenuItem>
                </Menu>
            </div>
            <div className="post-card-content">
                <div className="post-body">{body}</div>
                <div className="post-createdAt">{_.capitalize(moment(createdAt).fromNow(true))}</div>
            </div>
            <div className="post-actions">
                    <LikeButton id={id} likes={likes}/>
                <Link to = {postLink}>
                    <div className="post-comment-action">
                        <button className="comment-btn">
                            <VscIcon.VscComment/>
                        </button>

                        <div className="post-comments"> 
                            {commentCount}
                        </div>
                    </div>
                </Link>

                </div>
        </div>
    )
}

export default PostCard

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`