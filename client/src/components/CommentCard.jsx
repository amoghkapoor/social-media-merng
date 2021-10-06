import React, {useContext} from 'react'
import moment from 'moment'
import {
    Menu,
    MenuItem,
    MenuButton,
  } from '@szhsin/react-menu';
import { Link } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import { AuthContext } from '../context/auth';
import * as BsIcon from "react-icons/bs"
import {useQuery, useMutation} from "@apollo/client"
import gql from 'graphql-tag'
import _ from 'lodash'

import "../styles/components/commentCard.scss"

const CommentCard = ({comment: {username, body, createdAt, id}, postId}) => {
    const {user} = useContext(AuthContext)

    const {loading, data} = useQuery(USER_QUERY, {
        variables: {username}
    })

    let userData

    if(!loading){
        userData = data.getUser
    }

    const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION, {
        variables: {postId: postId, commentId: id},
        onError(err) {
           console.error(err)
        },
    })

    const onDelete = () => {
        confirmAlert({
            title: 'Delete post?',
            message: 'Are you sure you want to delete this post?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => deleteComment()
              },
              {
                label: 'No',
                onClick: () => null
              }
            ]
          });
    }

    return (
        <div className="comment-card">
            <div className="comment-user-container">
                <Link to={`/profile/${username}`}>
                    <div className="comment-user-image">
                        <img src={userData?.avatarUrl} alt={userData?.name}/>
                    </div>
                </Link>
                <Link to={`/profile/${username}`}>
                    <div className="comment-username">{username}</div>
                </Link>
                <Menu menuButton={<MenuButton className="menu-btn"><BsIcon.BsThreeDots/></MenuButton>} transition>
                    {user.username === username && (<MenuItem onClick={onDelete} className="delete-menu-button">Delete</MenuItem>)}
                </Menu>
            </div>

            <div className="comment-card-content">
                <div className="comment-body">{body}</div>
                <div className="comment-createdAt">{_.capitalize(moment(createdAt).fromNow(true))}</div>
            </div>
        </div>
    )
}

export default CommentCard

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

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment(
        $postId: ID! 
        $commentId: ID! 
    ){
        deleteComment(commentId: $commentId postId: $postId){
            id
            comments{
                id
                username
                body
                createdAt
            }
        }
    }
`