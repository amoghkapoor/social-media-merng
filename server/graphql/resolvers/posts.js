const { AuthenticationError, UserInputError } = require("apollo-server-express")
const shortid = require("shortid")
const { createWriteStream, unlink } = require("fs")
const {
    GraphQLUpload,
} = require('graphql-upload');
const path = require('path')

const Post = require("../../models/Post")
const checkAuth = require("../../utils/checkAuth")
const { validatePost } = require("../../utils/validators")

module.exports = {
    Upload: GraphQLUpload,
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

            let id = null

            if (imagePath) {
                const { createReadStream, filename, mimetype, encoding } = await imagePath;
                const stream = createReadStream();

                id = shortid.generate()

                const pathName = path.join(process.cwd(), `/public/images/${id}.jpeg`)

                await stream.pipe(createWriteStream(pathName))
            }

            const { errors, valid } = validatePost(body)

            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }

            const newPost = new Post({
                body,
                imagePath: id,
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
                    unlink(path.join(process.cwd(), `/public/images/${post.imagePath}.jpeg`), (err) => {
                        if (err) throw err;
                        console.log('file was deleted successfully');
                    });
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
                    post.likes = post.likes.filter(like => like.username !== username)
                }
                else {
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
        async editPost(_, { postId, body, imagePath, prevImagePath }, context) {
            const { username } = checkAuth(context)

            console.log(prevImagePath)

            let id = prevImagePath

            if (imagePath) {
                const { createReadStream, filename, mimetype, encoding } = await imagePath;
                const stream = createReadStream();

                unlink(path.join(process.cwd(), `/public/images/${prevImagePath}.jpeg`), (err) => {
                    if (err) throw err;
                    console.log('file was deleted successfully');
                });

                id = shortid.generate()

                const pathName = path.join(process.cwd(), `/public/images/${id}.jpeg`)

                await stream.pipe(createWriteStream(pathName))
            }

            const { errors, valid } = validatePost(body)

            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }

            const post = await Post.findById(postId)

            if (post) {
                if (post.username === username) {

                    const updatedPost = await Post.findByIdAndUpdate(postId, { body, imagePath: id, edited: true }, { new: true })

                    return updatedPost
                }
            }
        }
    }
}
