import React, { useEffect } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { IconContext } from "react-icons";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Link } from "react-router-dom";

import "../styles/components/modal.scss";

const Modal = ({ show, onClose, content }) => {
    useEffect(() => {
        document.body.addEventListener("keydown", closeOnEscape);

        return () =>
            document.body.removeEventListener("keydown", closeOnEscape);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const closeOnEscape = (e) => {
        if ((e.charCode || e.keyCode) === 27) {
            onClose();
        }
    };

    if (!show) {
        document.body.style.overflow = "visible";

        return (
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4>Likes</h4>
                    </div>
                    <div className="modal-body">
                        {content.map((like) => (
                            <>
                                <User like={like} key={like.id} />
                            </>
                        ))}
                    </div>
                </div>
                <button onClick={onClose} className="modal-close-btn">
                    <IconContext.Provider value={{ color: "#ef5350" }}>
                        <AiFillCloseCircle />
                    </IconContext.Provider>
                </button>
            </div>
        );
    }

    if (show) {
        document.body.style.overflow = "hidden";
    }

    return (
        <>
            <div className="modal visible">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4>Likes</h4>
                    </div>
                    <div className="modal-body">
                        {content.map((like) => (
                            <>
                                <User like={like} key={like.id} />
                            </>
                        ))}
                    </div>
                </div>
                <button onClick={onClose} className="modal-close-btn">
                    <IconContext.Provider value={{ color: "#ef5350" }}>
                        <AiFillCloseCircle />
                    </IconContext.Provider>
                </button>
            </div>
            <div className="overlay" onClick={onClose} />
        </>
    );
};

const User = ({ like }) => {
    let userData;

    const { loading, data } = useQuery(USER_QUERY, {
        variables: { username: like.username },
    });

    if (!loading) {
        userData = data.getUser;
    }

    return (
        <div className="modal-user">
            <Link to={`/profile/${like.username}`}>
                <div className="modal-user-image-container">
                    <img
                        className="modal-user-image"
                        src={userData?.avatarUrl}
                        alt=""
                    />
                </div>
            </Link>
            <Link to={`/profile/${like.username}`}>
                <div className="modal-username">{like.username}</div>
            </Link>
        </div>
    );
};

export default Modal;

const USER_QUERY = gql`
    query getUser($username: String!) {
        getUser(username: $username) {
            avatarUrl
        }
    }
`;
