const { UserInputError, AuthenticationError } = require("apollo-server-express")

const Post = require("../../models/Post")
const checkAuth = require("../../utils/checkAuth")

module.exports = {
    Mutation: {
        async createComment(_, { postId, body }, context) {
            const { username } = checkAuth(context)
            if (body.trim() === "") {
                throw new UserInputError("Empty comment", {
                    errors: {
                        body: "Comment body must not be empty"
                    }
                })
            }

            const post = await Post.findById(postId)
            if (post) {
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString(),
                    edited: false,
                })

                await post.save()
                return post
            }
            else {
                throw new UserInputError("Post not found")
            }
        },
        async deleteComment(_, { postId, commentId }, context) {
            const { username } = checkAuth(context)

            const post = await Post.findById(postId)

            if (post) {
                const commentIndex = post.comments.findIndex(prevComment => prevComment.id === commentId)
                if (post.comments[commentIndex].username === username) {
                    post.comments.splice(commentIndex, 1)
                    await post.save()

                    return post
                }
                else {
                    throw new AuthenticationError("Action not allowed")
                }
            }
            else {
                throw new UserInputError("Post not found")
            }
        },
        async editComment(_, { postId, commentId, body }, context) {
            const { username } = checkAuth(context)

            if (body.trim() === "") {
                throw new UserInputError("Empty comment", {
                    errors: {
                        body: "Comment body must not be empty"
                    }
                })
            }

            const post = await Post.findById(postId)

            if (post) {
                const commentIndex = post.comments.findIndex(prevComment => prevComment.id === commentId)
                if (post.comments[commentIndex].username === username) {
                    post.comments[commentIndex].body = body
                    post.comments[commentIndex].edited = true
                    await post.save()

                    return post
                }
                else {
                    throw new AuthenticationError("Action not allowed")
                }
            }
            else {
                throw new UserInputError("Post not found")
            }
        }
    }
}