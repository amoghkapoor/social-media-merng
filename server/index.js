require("dotenv").config()
const { ApolloServer } = require("apollo-server")
const mongoose = require("mongoose")

const typeDefs = require("./graphql/typeDefs")
const resolvers = require("./graphql/resolvers")
const DATABASE_URL = process.env.DATABASE_URL

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req })
})

mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
})
    .then(() => {
        console.log("Connected to database")
        return server.listen({ port: 5000 })
    })
    .then(res => {
        console.log(`Port is running on ${res.url}`)
    })
    .catch(err => console.log(err))