import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Navbar, PostCard, UserImageModal } from "../components";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../context/auth";
import moment from "moment";
import * as BsIcon from "react-icons/bs";

import NoPostSvg from "../assets/NoPostSvg";
import "../styles/pages/profile.scss";

const Profile = () => {
    const [show, setShow] = useState(false);
    const {
        user: { username },
    } = useContext(AuthContext);
    const { id } = useParams();

    const { loading, data } = useQuery(USER_QUERY, {
        variables: { username: id },
    });

    const { loading: postsLoading, data: postsData } = useQuery(GET_POSTS, {
        variables: { username: id },
    });

    let userData, userPostsData;

    if (!loading) {
        userData = data.getUser;
    }
    if (!postsLoading) {
        userPostsData = postsData.getPostsByUsername;
    }

    return (
        <>
            <Navbar />
            {userData ? (
                <div className="profile-outer-container">
                    <div className="user-container">
                        <div
                            className="user-image-container"
                            onClick={() => setShow(true)}
                        >
                            <img
                                src={userData.avatarUrl}
                                alt={userData.name}
                                className="user-image"
                            />
                        </div>
                        <div className="user-info">
                            <div className="user-info-left">
                                <h3 className="username">
                                    {userData.username}
                                </h3>
                                <h4 className="user-name">{userData.name}</h4>
                            </div>
                            <div className="user-info-right">
                                {userData.username === username && (
                                    <Link
                                        className="edit-profile"
                                        to={`/account/edit`}
                                    >
                                        <button>Edit Profile</button>
                                    </Link>
                                )}
                                <h5 className="user-createdAt">
                                    Joined{" "}
                                    {moment(userData.createdAt).format(
                                        "MMMM DD, YYYY"
                                    )}
                                </h5>
                            </div>
                        </div>
                    </div>
                    <div className="user-posts">
                        {userPostsData?.length !== 0 && (
                            <div className="user-posts-heading">
                                <BsIcon.BsGrid3X3 />
                                <span>Posts</span>
                            </div>
                        )}
                        {!postsLoading && (
                            <>
                                {userPostsData.length === 0 ? (
                                    <div className="user-no-posts">
                                        <div className="no-posts-heading">
                                            No posts{" "}
                                        </div>
                                        <NoPostSvg />
                                    </div>
                                ) : (
                                    <div className="user-posts-grid">
                                        {userPostsData.map((post) => (
                                            <Link
                                                to={`/post/${post.id}`}
                                                key={post.id}
                                            >
                                                <PostCard post={post} />
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <UserImageModal
                        onClose={() => setShow(false)}
                        show={show}
                        content={userData.avatarUrl}
                    />
                </div>
            ) : (
                <div>no user</div>
            )}
        </>
    );
};

export default Profile;

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

const GET_POSTS = gql`
    query getPostsByUsername($username: String!) {
        getPostsByUsername(username: $username) {
            id
            body
            username
            createdAt
            imagePath
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
