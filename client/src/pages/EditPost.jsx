import React, {useState, useContext} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import {useMutation, useQuery} from "@apollo/client"
import gql from 'graphql-tag'

import { Navbar } from '../components'
import {useForm} from "../utils/hooks"
import {AuthContext} from "../context/auth";
import EditPostSvg from "../assets/EditPostSvg"
import AccessDeniedSvg from "../assets/AccessDeniedSvg"
import "../styles/pages/editPost.scss"

const EditPost = () => {
    const {user} = useContext(AuthContext)
    const {id} = useParams()
    const history = useHistory();
    const [errors, setErrors] = useState(null)

    let postData

    const {data: cachedData} = useQuery(FETCH_POSTS_QUERY)

    const {loading, data} = useQuery(GET_POST, {
        variables: {postId: id}
    })

    if(!loading){
        postData = data.getPost
    }

    console.log(postData)

    const { onChange, onSubmit, values } = useForm(editPostCallback, {
        body: postData?.body
    });

    const [editPost] = useMutation(EDIT_POST_MUTATION, {
        variables: {postId: id, body: values.body},
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
            
            history.push(`/post/${id}`)
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].message);
            let input = document.querySelector(".edit-post-caption-input")  
            input.focus()  
        },
    })

    function editPostCallback() {
        editPost();
      }

    return (
        <>
        <Navbar/>
        {user.username === postData?.username ? (
        <div className="edit-post-container">
            <div className="left">
            <div className="heading">Edit post</div>
                <form onSubmit={onSubmit} className="edit-post-form">
                  <div className="input-wrapper">
                  <input 
                        type="text" 
                        className={errors ? "edit-post-caption-input error" : "edit-post-caption-input" }
                        name="body"
                        onChange={onChange}
                        autoComplete="off"
                        placeholder={postData?.body}
                    />
                    <label htmlFor="body" className="body-label">Body</label>
                  </div>
                    <button type="submit" className="edit-post-submit-btn">Submit</button>
                </form>
                {errors && (
                  <div className="error-container">
                    1.  {errors}
                  </div>
                )}
            </div>
            <div className="svg-container">
                <EditPostSvg/>
            </div>
        </div>
        ) : (
            <div className="access-denied">
                <div className="svg-container">
                    <AccessDeniedSvg/>
                </div>
                <div className="error-message">
                    You are not allowed to do this
                </div>
            </div>
        )}
        </>
    )
}

export default EditPost

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

const EDIT_POST_MUTATION = gql`
    mutation (
        $postId: ID!
        $body: String!
    ){
        editPost(postId: $postId, body: $body){
            id
            body
            username
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