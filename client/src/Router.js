import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Home, Login, Register, ForgotPassword, Profile, AddPost, SinglePost } from "./pages"
import AuthRoute from "./utils/authRoute"
import PrivateRoute from "./utils/privateRoute"

const MyRouter = () => {
    return (
        <Router>
            <Switch>
                <PrivateRoute path="/home" component={Home} />
                <PrivateRoute path="/profile/:id" component={Profile} />
                <PrivateRoute path="/add-post" component={AddPost} />
                <PrivateRoute path="/post/:id" component={SinglePost} />
                <AuthRoute exact path="/" component={Login} />
                <AuthRoute path="/register" component={Register} />
                <AuthRoute path="/forgot-password" component={ForgotPassword} />
                <Route>
                    Not found
                </Route>
            </Switch >
        </Router>
    )
}

export default MyRouter