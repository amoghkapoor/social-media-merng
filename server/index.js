require("dotenv").config()
const { ApolloServer } = require("apollo-server")
const mongoose = require("mongoose")
const express = require("express")

const app = express()

app.get("/", (req, res) => {
    res.write("Socialize Server")
})

const typeDefs = require("./graphql/typeDefs")
const resolvers = require("./graphql/resolvers")
const DATABASE_URL = process.env.DATABASE_URL

const PORT = process.env.PORT || 5000

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
        return server.listen({ port: PORT })
    })
    .then(res => {
        console.log(`Port is running on ${res.url}`)
    })
    .catch(err => console.log(err))