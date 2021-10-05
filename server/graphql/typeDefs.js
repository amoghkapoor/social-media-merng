const { gql } = require("graphql-tag")

const typeDefs = gql`
    type Post{
        id: ID!
        body: String!
        createdAt: String!
        username: String!
        comments: [Comment]!
        likes: [Like]!
    }
    type Comment{
        id: ID!
        body: String!
        createdAt: String!
        username: String!
    }
    type Like{
        id: ID!
        createdAt: String!
        username: String!
    }
    type User{
        id: ID!
        name: String!
        email: String!
        token: String!
        username: String!
        createdAt: String!
    }
    input UpdateInput{
        id: ID!
        username: String!
        email: String!
    }
    input UpdatePasswordInput{
        id: ID!
        password: String!
        confirmPassword: String!
    }
    input RegisterInput{
        name: String!
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }
    type Query {
        getPosts: [Post]
        getPost(postId: ID!): Post
        getPostsByUsername(username: String): Post
        getUser(username: String!): User
    }
    type Mutation{
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
        updateUser(updateInput: UpdateInput): User!
        updatePassword(updatePasswordInput: UpdatePasswordInput): User!
        createPost(body: String!): Post! 
        deletePost(postId: ID!): String!
        editPost(postId: ID!, body: String!): Post!
        createComment(body: String! postId: ID!): Post!
        deleteComment(postId: ID! commentId: ID!): Post!
        likePost(postId: ID!): Post!
    }
`

module.exports = typeDefs