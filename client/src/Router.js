import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Home, Login, Register } from "./pages"
import AuthRoute from "./utils/authRoute"
import PrivateRoute from "./utils/privateRoute"

const MyRouter = () => {
    return (
        <Router>
            <Switch>
                <PrivateRoute path="/home" component={Home} />
                <AuthRoute exact path="/" component={Login} />
                <AuthRoute path="/register" component={Register} />
            </Switch >
        </Router>
    )
}

export default MyRouter