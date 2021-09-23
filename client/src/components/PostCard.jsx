import React from 'react'
import moment from 'moment'
import _ from 'lodash'

import "../styles/components/postCard.scss"

const PostCard = ({post: {body, username, createdAt, id, likes, comments}}) => {
    let likeCount = likes.length
    let commentCount = comments.length

    return (
        <div className="post-card">
            <div className="post-body">{body}</div>
            <div className="post-user">{username}</div>
            <div className="post-createdAt">{_.capitalize(moment(createdAt).fromNow(true))}</div>
            <div className="post-likes">{likeCount}</div>
            <div className="post-comments">{commentCount}</div>
        </div>
    )
}

export default PostCard
