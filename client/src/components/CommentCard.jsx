import React, {useContext, useState} from 'react'
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
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";

import "../styles/components/commentCard.scss"

const CommentCard = ({comment: {username, body, createdAt, edited, id}, postId}) => {
    const {user} = useContext(AuthContext)
    const [menuVisible, setMenuVisible] = useState(false)
    const [errors, setErrors] = useState()
    const [commentBody, setCommentBody] = useState("")

    useQuery(FETCH_POSTS_QUERY)

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

    const [editComment] = useMutation(EDIT_COMMENT_MUTATION, {
        variables: {postId: postId, commentId: id, body: commentBody},
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY,
              });
        
              let newData = [...data.getPosts];
              newData = [result.data.createPost, ...newData];
              proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {
                  ...data,
                  getPosts: {
                    newData,
                  },
                },
              });
              setMenuVisible(false)
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].message)
        }
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

    const onClick = () => {
        setMenuVisible(true)
    }

    const onSubmit = (e) => {
        e.preventDefault()
        editComment()
    }

    return (
        <>
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
                {user.username === username && (
                <Menu menuButton={<MenuButton className="menu-btn"><BsIcon.BsThreeDots/></MenuButton>} transition>
                    <MenuItem onClick={onDelete} className="delete-menu-button">Delete</MenuItem>
                    <MenuItem onClick={onClick} className="edit-menu-button">Edit Comment</MenuItem>
                </Menu>
                )}
            </div>

            <div className="comment-card-content">
                <div className="comment-body">{body}</div>
                <div className="comment-createdAt">{_.capitalize(moment(createdAt).fromNow(true))}</div>
            </div>
            { edited && (
                <div className="edited">
                    (edited)
                </div>
            )}
        </div>
        <SlidingPane
            isOpen={menuVisible}
            title="Edit Comment"
            onRequestClose={() => {
                setMenuVisible(false);
            }}
            from="bottom"
            width="100vw"
            className="comment-update-menu"
        >
            <form className="comment-update-form" onSubmit={onSubmit}>
                <div className="input-wrapper">
                    <input 
                        name="comment-update" 
                        type="text" 
                        className={errors ? "comment-update-input error" : "comment-update-input"}
                        placeholder={body}
                        onChange={(e) => setCommentBody(e.target.value)}
                    />
                    <label htmlFor="comment-update" className="comment-label">Body</label>
                </div>
                <button className="edit-comment-submit-btn">Update Comment</button>
                {errors && (
                <div className="error-container">
                   1. {errors}
                </div>
            )}
            </form>
        </SlidingPane>
        </>
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

const EDIT_COMMENT_MUTATION = gql`
    mutation editComment(
        $postId: ID!
        $commentId: ID!
        $body: String!
    ){
        editComment(commentId: $commentId postId: $postId body: $body){
            id
            username
            edited
        }
    }
`

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
            edited
        }
    }
    }
`