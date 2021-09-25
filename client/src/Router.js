import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Home, Login, Register, ForgotPassword } from "./pages"
import AuthRoute from "./utils/authRoute"
import PrivateRoute from "./utils/privateRoute"

const MyRouter = () => {
    return (
        <Router>
            <Switch>
                <PrivateRoute path="/home" component={Home} />
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