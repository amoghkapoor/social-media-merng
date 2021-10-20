require("dotenv").config()
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
const { UserInputError } = require("apollo-server-express")
const crypto = require("crypto")
const shortid = require("shortid")
const { createWriteStream } = require("fs")
const {
    GraphQLUpload,
} = require('graphql-upload');
const path = require('path')

const checkAuth = require("../../utils/checkAuth")
const { validateRegisterInput, validateLoginInput, validateUsernameAndEmail, validatePassword } = require("../../utils/validators")
const secret_key = process.env.SECRET_KEY
const User = require("../../models/User")
const Post = require("../../models/Post")
const Token = require("../../models/Token")
const sendEmail = require("../../utils/email/sendEmail")

function generateToken(user) {
    return token = jwt.sign({
        id: user.id,
        name: user.name,
        username: user.username,
        avatarUrl: user.avatar,
        email: user.email,

    }, secret_key, { expiresIn: '1h' })
}

module.exports = {
    Upload: GraphQLUpload,
    Query: {
        async getUser(_, { username }) {
            const user = await User.findOne({ username })
            return user
        },
        async requestPasswordReset(_, { email }) {
            if (email.trim() === "") {
                throw new Error("Email must not be empty")
            }

            const user = await User.findOne({ email })
            if (!user) {
                throw new Error("No account linked with this email id")
            }

            let resetToken = crypto.randomBytes(32).toString("hex");
            const hash = await bcrypt.hash(resetToken, 10)

            await new Token({
                userId: user._id,
                token: hash,
                createdAt: Date.now(),
            }).save()

            const link = `http://localhost:3000/reset-password?token=${resetToken}&id=${user._id}`

            sendEmail(user.email, "Your Socialize password reset", { name: user.username, link: link, }, "./template/resetPassword.handlebars")

            return link
        }
    },
    Mutation: {
        async login(_, { username, password }) {
            const { errors, valid } = validateLoginInput(username, password)

            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }

            const user = await User.findOne({ username })

            if (!user) {
                errors.general = "User not found"
                throw new UserInputError("User not found", {
                    errors
                })
            }

            const match = await bcrypt.compare(password, user.password)
            if (!match) {
                errors.general = "Wrong credentials"
                throw new UserInputError("Wrong credentials", {
                    errors
                })
            }
            const token = generateToken(user)

            return {
                ...user._doc,
                id: user.id,
                token
            }
        },
        async register(_, { registerInput: { name, avatarUrl, username, email, password, confirmPassword } }) {
            const { valid, errors } = validateRegisterInput(
                username,
                email,
                password,
                confirmPassword,
                name
            )
            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }

            const user = await User.findOne({ username })
            if (user) {
                throw new UserInputError("Username already exists", {
                    errors: {
                        username: "This username already exists"
                    }
                })
            }
            const emailUser = await User.findOne({ email })
            if (emailUser) {
                throw new UserInputError("Email already linked with another account", {
                    errors: {
                        email: "Email already liked with another account"
                    }
                })
            }

            password = await bcrypt.hash(password, 12)

            const newUser = new User({
                name,
                avatarUrl,
                email,
                username,
                password,
                createdAt: new Date().toISOString(),
            })

            const res = await newUser.save()

            const token = generateToken(res)

            return {
                ...res._doc,
                id: res.id,
                token
            }
        },
        async updateUser(_, { updateInput: { name, username, avatarUrl, email, id } }, context) {
            const user = checkAuth(context)

            const fileId = shortid.generate()

            if (avatarUrl) {
                const { createReadStream, filename, mimetype, encoding } = await avatarUrl;
                const stream = createReadStream();

                const pathName = path.join(process.cwd(), `/public/images/${fileId}.jpeg`)

                await stream.pipe(createWriteStream(pathName))
            }

            const { valid, errors } = validateUsernameAndEmail(username, email)

            if (name.trim() === "") {
                errors.name = "Name must not be empty"
                throw new UserInputError('Errors', { errors });
            }

            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }

            if (username !== user.username) {
                const userCheck = await User.findOne({ username: username });
                if (userCheck) {
                    throw new UserInputError("Username already exists", {
                        errors: {
                            username: "This username already exists"
                        }
                    })
                }
                else {
                    const updatedUser = await User.findByIdAndUpdate(id, { username: username, email: email, name: name, avatarUrl: fileId }, { new: true })

                    const updatedPost = await Post.updateMany({ user: id }, { username: username })
                    const postLikes = await Post.updateMany(
                        { "likes.user": id },
                        { $set: { "likes.$.username": username } }
                    )
                    const postComments = await Post.updateMany(
                        { "comments.user": id },
                        { $set: { "comments.$.username": username } }
                    )

                    const token = generateToken(updatedUser)

                    return {
                        ...updatedUser._doc,
                        id: updatedUser.id,
                        token
                    }
                }
            }
            else {
                const updatedUser = await User.findByIdAndUpdate(id, { email: email, name: name, avatarUrl: fileId }, { new: true })

                const updatedPost = await Post.updateMany({ user: id }, { username: username })
                const postLikes = await Post.updateMany(
                    { "likes.user": id },
                    { $set: { "likes.$.username": username } }
                )
                const postComments = await Post.updateMany(
                    { "comments.user": id },
                    { $set: { "comments.$.username": username } }
                )

                const token = generateToken(updatedUser)

                return {
                    ...updatedUser._doc,
                    id: updatedUser.id,
                    token
                }
            }
        },
        async updatePassword(_, { updatePasswordInput: { password, confirmPassword, id } }) {
            const { valid, errors } = validatePassword(password, confirmPassword)

            const user = await User.findById(id)

            const match = await bcrypt.compare(password, user.password)
            if (match) {
                errors.general = "Same as previous password"
                throw new UserInputError("Same as previous password", {
                    errors
                })
            }

            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }

            password = await bcrypt.hash(password, 12)

            const updatedUser = await User.findByIdAndUpdate(id, { password }, { new: true })

            const token = generateToken(updatedUser)

            return {
                ...updatedUser._doc,
                id: updatedUser.id,
                token
            }
        },
        async resetPassword(_, { password, confirmPassword, id, token }) {
            let passwordResetToken = await Token.findOne({ userId: id })
            if (!passwordResetToken) {
                throw new UserInputError("Errors", { errors: { token: "Invalid or expired password reset token" } })
            }

            const isValid = await bcrypt.compare(token, passwordResetToken.token)
            if (!isValid) {
                throw new UserInputError("Errors", { errors: { token: "Invalid or expired password reset token" } })
            }

            const { valid, errors } = validatePassword(password, confirmPassword)

            const user = await User.findById(id)

            const match = await bcrypt.compare(password, user.password)
            if (match) {
                errors.general = "Same as previous password"
                throw new UserInputError("Same as previous password", {
                    errors
                })
            }

            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }

            password = await bcrypt.hash(password, 12)
            const updateUser = await User.findByIdAndUpdate(id, { password }, { new: true })

            return "Successfully Updated"
        }
    }
}