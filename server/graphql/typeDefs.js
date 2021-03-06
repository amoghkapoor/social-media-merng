const { gql } = require("graphql-tag")
const {
    GraphQLUpload,
} = require('graphql-upload');


const typeDefs = gql`
    scalar Upload
    type Post{
        id: ID!
        body: String!
        imagePath: String
        createdAt: String!
        username: String!
        comments: [Comment]!
        likes: [Like]!
        edited: Boolean!
    }
    type Comment{
        id: ID!
        body: String!
        createdAt: String!
        username: String!
        edited: Boolean!
    }
    type Like{
        id: ID!
        createdAt: String!
        username: String!
    }
    type User{
        id: ID!
        name: String!
        avatarUrl: String!
        email: String!
        token: String!
        username: String!
        createdAt: String!
    }
    input UpdateInput{
        id: ID!
        username: String!
        name: String!
        email: String!
        avatarUrl: Upload
    }
    input UpdatePasswordInput{
        id: ID!
        password: String!
        confirmPassword: String!
    }
    input RegisterInput{
        avatarUrl: String!
        name: String!
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }
    type Query {
        getPosts: [Post]
        getPost(postId: ID!): Post
        getPostsByUsername(username: String): [Post]
        getUser(username: String!): User
        requestPasswordReset(email: String!): String
    }
    type Mutation{
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
        updateUser(updateInput: UpdateInput): User!
        updatePassword(updatePasswordInput: UpdatePasswordInput): User!
        createPost(body: String!, imagePath: Upload): Post! 
        deletePost(postId: ID!): String!
        editPost(postId: ID!, body: String!, imagePath: Upload, prevImagePath: String): Post!
        resetPassword(password: String!, confirmPassword: String!, token: String!, id: ID!): String!
        createComment(body: String! postId: ID!): Post!
        deleteComment(postId: ID! commentId: ID!): Post!
        likePost(postId: ID!): Post!
        editComment(postId: ID! commentId: ID!, body: String!): Post!
    },
`

module.exports = typeDefs