require("dotenv").config()
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
const { UserInputError } = require("apollo-server")

const { validateRegisterInput, validateLoginInput, validateUsernameAndEmail, validatePassword } = require("../../utils/validators")
const secret_key = process.env.SECRET_KEY
const User = require("../../models/User")

function generateToken(user) {
    return token = jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username,
    }, secret_key, { expiresIn: '1h' })
}

module.exports = {
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
        async register(_, { registerInput: { username, email, password, confirmPassword } }) {
            const { valid, errors } = validateRegisterInput(
                username,
                email,
                password,
                confirmPassword
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

            password = await bcrypt.hash(password, 12)

            const newUser = new User({
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
        async updateUser(_, { updateInput: { username, email, id } }, context) {
            const { valid, errors } = validateUsernameAndEmail(username, email)

            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }

            const user = await User.findOne({ username: username });
            if (user) {
                throw new UserInputError("Username already exists", {
                    errors: {
                        username: "This username already exists"
                    }
                })
            }
            else {
                const updatedUser = await User.findByIdAndUpdate(id, { username: username, email: email }, { new: true })

                const token = generateToken(updatedUser)

                return {
                    ...updatedUser._doc,
                    id: updatedUser.id,
                    token
                }
            }
        },
        async updatePassword(_, { updatePasswordInput: { password, confirmPassword, id } }, context) {
            const { valid, errors } = validatePassword(password, confirmPassword)

            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }

            password = await bcrypt.hash(password, 12)

            const user = await User.findByIdAndUpdate(id, { password }, { new: true })

            const token = generateToken(user)

            return {
                ...user._doc,
                id: user.id,
                token
            }
        }
    }
}