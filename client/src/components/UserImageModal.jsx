import React, { useEffect } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { IconContext } from "react-icons";

import "../styles/components/userImageModal.scss";

const UserImageModal = ({ show, onClose, content }) => {
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
            <>
                <div className="user-image-modal">
                    <div className="user-image-modal-content">
                        <img
                            src={
                                content.includes("https://avatars.dicebear.com")
                                    ? `${content}`
                                    : `${process.env.REACT_APP_SERVER_URL}/images/${content}.jpeg`
                            }
                            alt=""
                        />
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="user-image-modal-close-btn"
                >
                    <IconContext.Provider value={{ color: "#ef5350" }}>
                        <AiFillCloseCircle />
                    </IconContext.Provider>
                </button>
            </>
        );
    }

    if (show) {
        document.body.style.overflow = "hidden";
    }

    return (
        <>
            <div className="user-image-modal visible">
                <div className="user-image-modal-content">
                    <img
                        src={
                            content.includes("https://avatars.dicebear.com")
                                ? `${content}`
                                : `${process.env.REACT_APP_SERVER_URL}/images/${content}.jpeg`
                        }
                        alt=""
                    />
                </div>
            </div>
            <button
                onClick={onClose}
                className="user-image-modal-close-btn visible"
            >
                <IconContext.Provider value={{ color: "#ef5350" }}>
                    <AiFillCloseCircle />
                </IconContext.Provider>
            </button>
            <div className="overlay" onClick={onClose} />
        </>
    );
};

export default UserImageModal;
