import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";
import Dropzone from "react-dropzone";

import AddPostSvg from "../assets/AddPostSvg";
import NoImageSvg from "../assets/NoImageSvg";
import { useForm } from "../utils/hooks";
import { Navbar } from "../components";
import "../styles/pages/addPost.scss";

const AddPost = () => {
    const [errors, setErrors] = useState({});
    const [fieldValue, setFieldValue] = useState();
    const history = useHistory();

    const { onChange, onSubmit, values } = useForm(createPostCallback, {
        body: "",
    });

    useQuery(FETCH_POSTS_QUERY);

    const [createPost] = useMutation(CREATE_POST_MUTATION, {
        variables: { body: values.body, imagePath: fieldValue },
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
            values.body = "";
            history.push("/");
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.errors);
            let input = document.querySelector(".add-post-caption-input");
            input.focus();
        },
    });

    function createPostCallback() {
        createPost();
    }
    return (
        <>
            <Navbar />
            <div className="add-post-container">
                <div className="left">
                    <div className="heading">Add post</div>
                    <form onSubmit={onSubmit} className="add-post-form">
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className={
                                    errors.body
                                        ? "add-post-caption-input error"
                                        : "add-post-caption-input"
                                }
                                name="body"
                                onChange={onChange}
                                autoComplete="off"
                                placeholder="Caption"
                            />
                            <label htmlFor="body" className="caption-label">
                                Caption
                            </label>
                        </div>
                        {/* <div className="image-input-wrapper">
                            <div className="post-image-container">
                                {postData?.selectedFile ? (
                                    <img src={postData?.selectedFile} alt="" />
                                ) : (
                                    <NoImageSvg />
                                )}
                            </div>
                            <FileBase
                                type="file"
                                multiple={false}
                                onDone={({ base64 }) =>
                                    setPostData({ selectedFile: base64 })
                                }
                            />
                        </div> */}
                        <Dropzone
                            multiple={false}
                            onDrop={([file]) => {
                                Object.assign(file, {
                                    preview: URL.createObjectURL(file),
                                });
                                setFieldValue(file);
                            }}
                            accept="image/*"
                        >
                            {({ getRootProps, getInputProps }) => (
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <p>
                                        Drag 'n' drop some files here, or click
                                        to select files
                                    </p>
                                </div>
                            )}
                        </Dropzone>
                        <button type="submit" className="post-submit-btn">
                            Submit
                        </button>
                        {Object.keys(errors).length > 0 && (
                            <div className="error-container">
                                {Object.keys(errors).length > 0 &&
                                    Object.values(errors).map((value) => (
                                        <li key={value}>{value}</li>
                                    ))}
                            </div>
                        )}
                    </form>
                </div>
                <div className="svg-container">
                    <AddPostSvg />
                </div>
            </div>
        </>
    );
};

const CREATE_POST_MUTATION = gql`
    mutation createPost($body: String!, $imagePath: Upload) {
        createPost(body: $body, imagePath: $imagePath) {
            id
            body
            imagePath
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
        getPosts {
            id
            body
            imagePath
            username
            createdAt
            likes {
                id
                username
                createdAt
            }
            comments {
                id
                username
                body
                createdAt
            }
        }
    }
`;

export default AddPost;
