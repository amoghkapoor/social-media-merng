import App from "./App"
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import { setContext } from 'apollo-link-context'
import { onError } from "@apollo/client/link/error";
import { createUploadLink } from "apollo-upload-client"

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) => {
            if (message === "Invalid/Expired token") {
                console.log(message)
                localStorage.removeItem("jwtToken")
                window.location.reload()
            }
            console.log(
                `[GraphQL error]: \nMessage: ${message} \nLocation: ${locations.map(location => (location.line))
                } ${locations.map(location => (location.column))}, \nPath: ${path}`
            )
        });
    if (networkError) console.log(`[Network error]: ${networkError}`);

});

const uploadLink = createUploadLink({
    uri: `${process.env.REACT_APP_SERVER_URL}/graphql`

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
    link: errorLink.concat(authLink.concat(uploadLink)),
    cache: new InMemoryCache()
})

export default (
    <ApolloProvider client={client} >
        <App />
    </ApolloProvider>
)