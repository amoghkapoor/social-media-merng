const { AuthenticationError, UserInputError } = require("apollo-server")

const Post = require("../../models/Post")
const checkAuth = require("../../utils/checkAuth")

const { validatePost } = require("../../utils/validators")

module.exports = {
    Query: {
        async getPost(_, { postId }) {
            try {
                const post = await Post.findById(postId)
                if (post) {
                    return post
                }
                else {
                    throw new Error("Post not found")
                }
            }
            catch (err) {
                throw new Error(err)
            }
        },
        async getPosts() {
            try {
                const posts = await Post.find({}).sort({ createdAt: -1 })
                return posts
            }
            catch (error) {
                throw new Error(error)
            }
        },
        async getPostsByUsername(_, { username }) {
            try {
                const posts = await Post.find({ username }).sort({ createdAt: -1 })
                return posts
            }
            catch (error) {
                throw new Error(error)
            }
        }
    },
    Mutation: {
        async createPost(_, { body, imagePath }, context) {
            const user = checkAuth(context)

            const { errors, valid } = validatePost(body, imagePath)

            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }

            const newPost = new Post({
                body,
                imagePath,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString(),
                edited: false,
            })

            const post = await newPost.save()

            return post
        },
        async deletePost(_, { postId }, context) {
            const user = checkAuth(context)

            try {
                const post = await Post.findById(postId)
                if (user.username === post.username) {
                    await post.delete()
                    return "Post successfully deleted"
                }
                else {
                    throw new AuthenticationError("Action not allowed")
                }
            }
            catch (err) {
                throw new Error(err)
            }
        },
        async likePost(_, { postId }, context) {
            const { username, id } = checkAuth(context)
            const post = await Post.findById(postId)
            if (post) {
                if (post.likes.find(like => like.username === username)) {
                    // Already liked
                    post.likes = post.likes.filter(like => like.username !== username)
                }
                else {
                    // Not liked
                    post.likes.push({
                        user: id,
                        username,
                        createdAt: new Date().toISOString()
                    })
                }

                await post.save()
                return post
            }
            else {
                throw new UserInputError("Post not found")
            }
        },
        async editPost(_, { postId, body, imagePath }, context) {
            const { username } = checkAuth(context)

            const { errors, valid } = validatePost(body, imagePath)

            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }

            const post = await Post.findById(postId)

            if (post) {
                if (post.username === username) {

                    const updatedPost = await Post.findByIdAndUpdate(postId, { body, imagePath, edited: true }, { new: true })

                    return updatedPost
                }
            }
        }
    }
}
