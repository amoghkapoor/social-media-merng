const postsResolver = require('./posts')
const usersResolver = require('./users')

module.exports = {
    Query: {
        ...postsResolver.Query
    },
    Mutation: {
        ...usersResolver.Mutation
    }
}