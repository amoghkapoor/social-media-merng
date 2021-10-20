const postsResolver = require('./posts')
const usersResolver = require('./users')
const commentsResolver = require('./comments')

module.exports = {
    Upload: {
        ...postsResolver.Upload,
        ...usersResolver.Upload,
    },
    Query: {
        ...postsResolver.Query,
        ...usersResolver.Query,
    },
    Mutation: {
        ...usersResolver.Mutation,
        ...postsResolver.Mutation,
        ...commentsResolver.Mutation,
    }
}