import App from "./App"
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client"
import { setContext } from 'apollo-link-context'
import { onError } from "@apollo/client/link/error";

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) => {
            if (message === "Invalid/Expired token") {
                console.log(message)
                localStorage.removeItem("jwtToken")
                window.location.reload()
            }
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
        });
    if (networkError) console.log(`[Network error]: ${networkError}`);

});

const httpLink = createHttpLink({
    uri: "http://localhost:5000/graphql"
})

const authLink = setContext(() => {
    const token = localStorage.getItem("jwtToken")

    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : ""
        }
    }
})

const client = new ApolloClient({
    link: errorLink.concat(authLink.concat(httpLink)),
    cache: new InMemoryCache()
})

export default (
    <ApolloProvider client={client} >
        <App />
    </ApolloProvider>
)