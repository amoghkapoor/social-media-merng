import React, { useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import FileBase from "react-file-base64";
import Dropzone from "react-dropzone";

import NoImageSvg from "../assets/NoImageSvg";
import { Navbar } from "../components";
import { AuthContext } from "../context/auth";
import EditPostSvg from "../assets/EditPostSvg";
import AccessDeniedSvg from "../assets/AccessDeniedSvg";
import "../styles/pages/editPost.scss";

const EditPost = () => {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const history = useHistory();
    const [errors, setErrors] = useState({});
    const [fieldValue, setFieldValue] = useState();

    const [values, setValues] = useState({
        body: "",
    });

    const onChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const onSubmit = (event) => {
        event.preventDefault();
        editPost();
    };

    const [image, setImage] = useState("");

    let postData;

    useQuery(FETCH_POSTS_QUERY);

    const { loading, data } = useQuery(GET_POST, {
        variables: { postId: id },
        onCompleted({ getPost: { imagePath, body } }) {
            setImage(imagePath);
            setValues({ body });
        },
    });

    if (!loading) {
        postData = data.getPost;
    }

    const [editPost] = useMutation(EDIT_POST_MUTATION, {
        variables: {
            postId: id,
            body: values.body,
            imagePath: fieldValue,
            prevImagePath: image,
        },
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

            history.push(`/post/${id}`);
        },
        onError(err) {
            console.log(err);
            setErrors(err.graphQLErrors[0].extensions.errors);
            let input = document.querySelector(".edit-post-caption-input");
            input.focus();
        },
    });

    // function editPostCallback() {
    // editPost();
    // }

    return (
        <>
            <Navbar />
            {postData && (
                <>
                    {user.username === postData?.username ? (
                        <div className="edit-post-container">
                            <div className="left">
                                <div className="heading">Edit post</div>
                                <form
                                    onSubmit={onSubmit}
                                    className="edit-post-form"
                                >
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            className={
                                                errors.body
                                                    ? "edit-post-caption-input error"
                                                    : "edit-post-caption-input"
                                            }
                                            name="body"
                                            onChange={onChange}
                                            autoComplete="off"
                                            placeholder={postData?.body}
                                        />
                                        <label
                                            htmlFor="body"
                                            className="body-label"
                                        >
                                            Body
                                        </label>
                                    </div>
                                    {/*  <div className="image-input-wrapper">
                                        <div className="post-image-container">
                                            {image ? (
                                                <img src={image} alt="" />
                                            ) : (
                                                <NoImageSvg />
                                            )}
                                        </div>
                                        <FileBase
                                            type="file"
                                            multiple={false}
                                            onDone={({ base64 }) =>
                                                setImage(base64)
                                            }
                                        />
                                    </div> */}
                                    <Dropzone
                                        multiple={false}
                                        onDrop={([file]) => {
                                            Object.assign(file, {
                                                preview:
                                                    URL.createObjectURL(file),
                                            });
                                            setFieldValue(file);
                                        }}
                                        accept="image/*"
                                    >
                                        {({ getRootProps, getInputProps }) => (
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <p>
                                                    Drag 'n' drop some files
                                                    here, or click to select
                                                    files
                                                </p>
                                            </div>
                                        )}
                                    </Dropzone>
                                    <button
                                        type="submit"
                                        className="edit-post-submit-btn"
                                    >
                                        Submit
                                    </button>
                                    {Object.keys(errors).length > 0 && (
                                        <div className="error-container">
                                            {Object.keys(errors).length > 0 &&
                                                Object.values(errors).map(
                                                    (value) => (
                                                        <li key={value}>
                                                            {value}
                                                        </li>
                                                    )
                                                )}
                                        </div>
                                    )}
                                </form>
                            </div>
                            <div className="svg-container">
                                <EditPostSvg />
                            </div>
                        </div>
                    ) : (
                        <div className="access-denied">
                            <div className="svg-container">
                                <AccessDeniedSvg />
                            </div>
                            <div className="error-message">
                                You are not allowed to do this
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default EditPost;

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

const EDIT_POST_MUTATION = gql`
    mutation (
        $postId: ID!
        $body: String!
        $imagePath: Upload
        $prevImagePath: String
    ) {
        editPost(
            postId: $postId
            body: $body
            imagePath: $imagePath
            prevImagePath: $prevImagePath
        ) {
            id
            body
            username
            imagePath
        }
    }
`;

const GET_POST = gql`
    query getPost($postId: ID!) {
        getPost(postId: $postId) {
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
