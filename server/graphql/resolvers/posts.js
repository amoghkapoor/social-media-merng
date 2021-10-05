const { AuthenticationError, UserInputError } = require("apollo-server")

const Post = require("../../models/Post")
const checkAuth = require("../../utils/checkAuth")

module.exports = {
    Query: {
        async getPost(_, { postId }) {
            try {
                const post = await Post.findById({ postId })
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
        async createPost(_, { body }, context) {
            const user = checkAuth(context)

            if (body.trim() === "") {
                throw new Error("Body must not be empty")
            }

            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
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
            const { username } = checkAuth(context)

            const post = await Post.findById(postId)
            if (post) {
                if (post.likes.find(like => like.username === username)) {
                    // Already liked
                    post.likes = post.likes.filter(like => like.username !== username)
                }
                else {
                    // Not liked
                    post.likes.push({
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
        async editPost(_, { postId, body }, context) {
            const { username } = checkAuth(context)

            const post = await Post.findById(postId)

            if (post) {
                if (post.username === username) {

                    const updatedPost = await Post.findByIdAndUpdate(postId, { body }, { new: true })

                    return updatedPost
                }
            }
        }
    }
}
