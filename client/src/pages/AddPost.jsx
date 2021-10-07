import React, { useState} from 'react'
import gql from 'graphql-tag'
import {useMutation, useQuery} from "@apollo/client"
import {useHistory} from 'react-router-dom'

import AddPostSvg from "../assets/AddPostSvg"
import {useForm} from "../utils/hooks"
import { Navbar } from '../components'
import "../styles/pages/addPost.scss"

const AddPost = () => {
    const [errors, setErrors] = useState(null)
    const history = useHistory();

    const { onChange, onSubmit, values } = useForm(createPostCallback, {
        body: ""
    });

    const { data} = useQuery(FETCH_POSTS_QUERY)

      const [createPost, ] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
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
          values.body = '';
          history.push("/")
        },
        onError(err) {
          setErrors(err.graphQLErrors[0].message);
          let input = document.querySelector(".add-post-caption-input")  
          input.focus()        
        },
      });
    
      function createPostCallback() {
        createPost();
      }

    return (
        <>
            <Navbar/>
            <div className="add-post-container">
              
              <div className="left">
              <div className="heading">Add post</div>
                <form onSubmit={onSubmit} className="add-post-form">
                  <div className="input-wrapper">
                  <input 
                        type="text" 
                        className={errors ? "add-post-caption-input error" : "add-post-caption-input" }
                        name="body"
                        onChange={onChange}
                        autoComplete="off"
                        placeholder="Caption"
                    />
                    <label htmlFor="body" className="caption-label">Caption</label>
                  </div>
                    <button type="submit" className="post-submit-btn">Submit</button>
                </form>
                {errors && (
                  <div className="error-container">
                    1.  {errors}
                  </div>
                )}
              </div>

                <div className="svg-container">
                <AddPostSvg/>
                </div>
            </div>
        </>
    )
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      comments {
        id
        body
        username
        createdAt
      }
    }
  }
`;

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

export default AddPost
