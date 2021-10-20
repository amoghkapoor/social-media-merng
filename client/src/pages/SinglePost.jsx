import React, { useContext, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { Link, useParams, useHistory } from "react-router-dom";
import { AuthContext } from "../context/auth";
import moment from "moment";
import _ from "lodash";
import * as BsIcon from "react-icons/bs";
import * as VscIcon from "react-icons/vsc";
import { IconContext } from "react-icons";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import NoCommentImage from "../assets/no-comments.png";
import { CommentCard } from "../components";
import "../styles/pages/singlePost.scss";
import { LikeButton, Navbar, Modal } from "../components";

const SinglePost = () => {
    const {
        user: { username },
    } = useContext(AuthContext);
    const { id } = useParams();
    const history = useHistory();

    const [comment, setComment] = useState("");
    const [show, setShow] = useState(false);

    const { loading, data } = useQuery(GET_POST, {
        variables: { postId: id },
    });

    let post, userData, likes;

    if (!loading) {
        post = data?.getPost;
        likes = post?.likes;
    }

    const { loading: userLoading, data: rawUserData } = useQuery(USER_QUERY, {
        skip: loading || false,
        variables: { username: post?.username },
    });

    if (!userLoading) {
        userData = rawUserData?.getUser;
    }

    const [deletePost] = useMutation(DELETE_POST_MUTATION, {
        variables: { postId: id },
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
            history.push("/");
        },
        onError(err) {
            console.error(err);
        },
    });

    const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
        variables: {
            postId: id,
            body: comment,
        },
        update(proxy, result) {
            setComment("");
        },
        onError(err) {
            console.error(err);
        },
    });

    const onDelete = () => {
        confirmAlert({
            title: "Delete post?",
            message: "Are you sure you want to delete this post?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => deletePost(),
                },
                {
                    label: "No",
                    onClick: () => null,
                },
            ],
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        createComment();
        let btn = document.querySelector(".comment-button");
        btn.disabled = true;
        btn.style.cursor = "not-allowed";
        let input = document.querySelector(".comment-input");
        input.blur();
    };

    const onChange = (e) => {
        setComment(e.target.value);
        let btn = document.querySelector(".comment-button");
        if (e.target.value.trim() === "") {
            btn.disabled = true;
            btn.style.cursor = "not-allowed";
        } else {
            btn.disabled = false;
            btn.style.cursor = "pointer";
        }
    };

    return (
        <>
            <Navbar />
            {post && userData && (
                <div className="single-post-outer-container">
                    <div className="single-post-inner-container">
                        <div className="user-info">
                            <Link to={`/profile/${userData?.username}`}>
                                <div className="user-image-container">
                                    <img
                                        className="user-image"
                                        src={
                                            userData.avatarUrl.includes(
                                                "https://avatars.dicebear.com"
                                            )
                                                ? `${userData.avatarUrl}`
                                                : `${process.env.REACT_APP_SERVER_URL}/images/${userData.avatarUrl}.jpeg`
                                        }
                                        alt={userData?.name}
                                    />
                                </div>
                            </Link>

                            <div className="user-and-post-data">
                                <Link to={`/profile/${userData?.username}`}>
                                    <div className="username">
                                        {userData?.username}
                                    </div>
                                </Link>

                                <div className="user-name">
                                    {userData?.name}
                                </div>

                                <div className="post-createdAt">
                                    Posted on{" "}
                                    {moment(post?.createdAt).format(
                                        "kk:mm, MMMM DD, YYYY"
                                    )}
                                    <div className="post-time">
                                        {_.upperCase(
                                            moment(post?.createdAt).fromNow()
                                        )}
                                    </div>
                                    {post?.edited && (
                                        <div className="edited">
                                            <span>(edited)</span>
                                        </div>
                                    )}
                                </div>

                                <div className="likes-and-comment">
                                    <div className="likes">
                                        <div
                                            className="left"
                                            onClick={() => setShow(true)}
                                        >
                                            Likes:{" "}
                                        </div>

                                        <div className="right">
                                            <span className="count">
                                                {post?.likes.length}
                                            </span>
                                            <IconContext.Provider
                                                value={{ color: "#f44336" }}
                                            >
                                                <BsIcon.BsHeartFill
                                                    onClick={() =>
                                                        setShow(true)
                                                    }
                                                    className="icon"
                                                />
                                            </IconContext.Provider>
                                        </div>
                                    </div>
                                    <Modal
                                        onClose={() => setShow(false)}
                                        show={show}
                                        content={post?.likes}
                                    />

                                    <div className="comments">
                                        <div className="left">Comments: </div>
                                        <div className="right">
                                            <span className="count">
                                                {post?.comments.length}
                                            </span>
                                            <VscIcon.VscComment />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {username === userData?.username && (
                                <div className="post-buttons">
                                    <Link to={`/edit/${id}`}>
                                        <button className="edit-button">
                                            Edit Post
                                        </button>
                                    </Link>
                                    <button
                                        className="delete-button"
                                        onClick={onDelete}
                                    >
                                        Delete Post
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="post-content-container">
                            <div className="heading-container">
                                <div className="heading">POST</div>

                                <div className="like-btn">
                                    <LikeButton id={id} likes={likes} />
                                </div>
                            </div>

                            <div className="post-content">
                                <div className="post-body">
                                    {post?.imagePath && (
                                        <img
                                            src={`${process.env.REACT_APP_SERVER_URL}/images/${post.imagePath}.jpeg`}
                                            alt="Post"
                                            className="img"
                                        />
                                    )}

                                    <div className="post-body-caption">
                                        {post?.body}
                                    </div>
                                </div>

                                <form
                                    onSubmit={onSubmit}
                                    className="comment-input-container"
                                >
                                    <input
                                        value={comment}
                                        onChange={onChange}
                                        type="text"
                                        className="comment-input"
                                        placeholder="Add comment ..."
                                    />

                                    <button
                                        type="submit"
                                        className="comment-button"
                                        disabled
                                    >
                                        <IconContext.Provider
                                            value={{
                                                color: "#4482ff",
                                                size: "25",
                                            }}
                                        >
                                            <BsIcon.BsArrowRightSquareFill />
                                        </IconContext.Provider>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="comments-container">
                        <div className="heading">Comments</div>
                        {post?.comments.length > 0 ? (
                            <>
                                {post?.comments.map((comment) => (
                                    <CommentCard
                                        key={comment.id}
                                        comment={comment}
                                        postId={post.id}
                                    />
                                ))}
                            </>
                        ) : (
                            <div className="no-comment">
                                <img src={NoCommentImage} alt="" />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default SinglePost;

const USER_QUERY = gql`
    query getUser($username: String!) {
        getUser(username: $username) {
            id
            name
            avatarUrl
            username
            email
            createdAt
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
            edited
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
                edited
            }
        }
    }
`;

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!) {
        deletePost(postId: $postId)
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
                edited
            }
        }
    }
`;

const CREATE_COMMENT_MUTATION = gql`
    mutation createComment($postId: ID!, $body: String!) {
        createComment(postId: $postId, body: $body) {
            id
            comments {
                id
                body
                username
                createdAt
                edited
            }
        }
    }
`;
