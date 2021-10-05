import React, {useContext, useState} from 'react'
import gql from 'graphql-tag'
import {useMutation} from "@apollo/client"
import {useHistory} from 'react-router-dom'

import {useForm} from "../utils/hooks"
import {AuthContext} from "../context/auth";
import { Navbar } from '../components'
import "../styles/pages/addPost.scss"

const AddPost = () => {
    const [errors, setErrors] = useState({})
    const history = useHistory();

    const { onChange, onSubmit, values } = useForm(createPostCallback, {
        body: ""
    });

      const [createPost, { loading }] = useMutation(CREATE_POST_MUTATION, {
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
            setErrors(err.graphQLErrors[0].extensions.errors);
        },
      });
    
      function createPostCallback() {
        createPost();
      }

    return (
        <>
            <Navbar/>
            <div className="add-post-container">
                Add post
                <form onSubmit={onSubmit} className="add-post-form">
                    <input 
                        type="text" 
                        className=""
                        name="body"
                        onChange={onChange}
                    />
                    <button type="submit">Submit</button>
                </form>
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
