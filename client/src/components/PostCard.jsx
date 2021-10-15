import React, { useContext } from "react";
import moment from "moment";
import _ from "lodash";
import * as BsIcon from "react-icons/bs";
import * as VscIcon from "react-icons/vsc";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

import { LikeButton } from "./";
import { AuthContext } from "../context/auth";
import { IconContext } from "react-icons";

import "../styles/components/postCard.scss";

const PostCard = ({
    post: { body, username, createdAt, id, likes, comments, edited, imagePath },
    profile,
}) => {
    let postLink = `/post/${id}`;
    let userLink = `/profile/${username}`;

    const { user } = useContext(AuthContext);
    let commentCount = comments.length;

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
        },
        onError(err) {
            console.error(err);
        },
    });

    const { loading, data } = useQuery(FETCH_USER, {
        variables: { username: username },
    });

    let userData;

    if (!loading) {
        userData = data.getUser;
    }

    const onDelete = () => {
        confirmAlert({
            title: "Delete post?",
            message: "Are you sure you want to delete this post?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => {
                        deletePost();
                    },
                },
                {
                    label: "No",
                    onClick: () => null,
                },
            ],
        });
    };

    return (
        <>
            {userData && (
                <div className={profile ? "post-card" : "post-card hover"}>
                    {profile && (
                        <div className="post-user-container">
                            <Link to={userLink}>
                                <div className="post-user-image">
                                    <img
                                        src={userData.avatarUrl}
                                        alt={userData.name}
                                    />
                                </div>
                            </Link>
                            <Link to={userLink}>
                                <div className="post-username">{username}</div>
                            </Link>

                            <Menu
                                menuButton={
                                    <MenuButton className="menu-btn">
                                        <BsIcon.BsThreeDots />
                                    </MenuButton>
                                }
                                transition
                            >
                                {user.username === username && (
                                    <>
                                        <MenuItem
                                            onClick={onDelete}
                                            className="delete-menu-button"
                                        >
                                            Delete
                                        </MenuItem>
                                        <Link to={`/edit/${id}`}>
                                            <MenuItem>Edit Post</MenuItem>
                                        </Link>
                                    </>
                                )}
                                <Link to={postLink}>
                                    <MenuItem>Go to post</MenuItem>
                                </Link>
                            </Menu>
                        </div>
                    )}
                    <div className="post-card-content">
                        <div className="post-body">
                            {imagePath && (
                                <>
                                    <div className="post-image">
                                        <img src={imagePath} alt="" />
                                    </div>
                                    <div className="divider" />
                                </>
                            )}
                            <div className="post-caption">{body}</div>
                        </div>
                    </div>
                    <div className="edited">
                        <div className="post-createdAt">
                            {_.capitalize(moment(createdAt).fromNow(true))}
                        </div>
                        {edited && <span>&nbsp; (edited)</span>}
                    </div>

                    {profile && (
                        <div className="post-actions">
                            <LikeButton id={id} likes={likes} count={true} />
                            <Link to={postLink}>
                                <div className="post-comment-action">
                                    <button className="comment-btn">
                                        <VscIcon.VscComment />
                                    </button>

                                    <div className="post-comments">
                                        {commentCount}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )}
                    {!profile && (
                        <div className="post-actions-hover">
                            <div className="like">
                                <span>{likes?.length}</span>
                                <IconContext.Provider value={{ color: "#fff" }}>
                                    <BsIcon.BsHeartFill />
                                </IconContext.Provider>
                            </div>
                            <div className="comment">
                                <span>{commentCount}</span>
                                <VscIcon.VscComment />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default PostCard;

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
            }
        }
    }
`;

const FETCH_USER = gql`
    query getUser($username: String!) {
        getUser(username: $username) {
            name
            avatarUrl
        }
    }
`;
