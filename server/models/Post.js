const { model, Schema } = require('mongoose')

const postSchema = new Schema({
    body: String,
    imagePath: String,
    username: String,
    createdAt: String,
    edited: Boolean,
    comments: [
        {
            body: String,
            username: String,
            createdAt: String,
            edited: Boolean,
        }
    ],
    likes: [
        {
            user: String,
            username: String,
            createdAt: String,
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: "users"
    }
})

module.exports = model("Post", postSchema)