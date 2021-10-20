require("dotenv").config()
const { ApolloServer } = require("apollo-server-express")
const mongoose = require("mongoose")
const express = require("express")
const http = require("http")
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')
const cors = require('cors')
const DATABASE_URL = process.env.DATABASE_URL
const {
    graphqlUploadExpress,
} = require('graphql-upload');

const PORT = process.env.PORT || 5000

const typeDefs = require("./graphql/typeDefs")
const resolvers = require("./graphql/resolvers")

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}

async function startApolloServer(typeDefs, resolvers) {
    const app = express();
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        context: ({ req }) => ({ req }),
        cors: corsOptions,
        uploads: false
    });
    await server.start();
    app.use(graphqlUploadExpress())
    app.use(express.static("public"))
    server.applyMiddleware({ app });
    await mongoose.connect(DATABASE_URL, {
        useNewUrlParser: true,
    })
        .then(() => {
            console.log("Connected to database")
        })
        .catch(err => console.log(err))
    await new Promise(resolve => httpServer.listen({ port: PORT }, resolve))
    console.log(`Server ready at ${PORT} ${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers)