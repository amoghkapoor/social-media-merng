const postsResolver = require('./posts')
const usersResolver = require('./users')
const commentsResolver = require('./comments')

module.exports = {
    Query: {
        ...postsResolver.Query
    },
    Mutation: {
        ...usersResolver.Mutation,
        ...postsResolver.Mutation,
        ...commentsResolver.Mutation,
    }
}