import React from 'react'
import {useParams} from 'react-router-dom'

const SinglePost = () => {
    const {id} = useParams()
    return (
        <div>
            {id}
        </div>
    )
}

export default SinglePost
