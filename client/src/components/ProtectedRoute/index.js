import Cookies from "js-cookie";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = (props) => {
  const JwtToken = Cookies.get("jwt_token");
  if (JwtToken === undefined) {
    return <Redirect to="/login" />;
  }
  return <Route {...props} />;
};
export default ProtectedRoute;
