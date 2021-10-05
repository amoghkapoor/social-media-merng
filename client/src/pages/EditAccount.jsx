import React, { useContext }from 'react'
import { AuthContext } from '../context/auth'

const EditAccount = () => {
    const {user} = useContext(AuthContext)
console.log(user)
    return (
        <div>
            {user.name} edit
        </div>
    )
}

export default EditAccount
