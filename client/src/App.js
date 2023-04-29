import { Route, Switch } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import Home from "./components/Home";
import Reminders from "./components/Reminders";
import MedicineReminderForm from "./components/MedicineReminderForm";
import GlucoseLevelForm from "./components/GlucoseLevelForm";
import Trackers from "./components/Trackers";
import "./App.css";

function App() {
  return (
    <Switch>
      <Route exact path="/login" component={Login} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute
        exact
        path="/add-medicine-reminder"
        component={MedicineReminderForm}
      />
      <ProtectedRoute
        exact
        path="/add-glucose-level"
        component={GlucoseLevelForm}
      />
      <ProtectedRoute exact path="/reminders" component={Reminders} />
      <ProtectedRoute exact path="/trackers" component={Trackers} />
    </Switch>
  );
}

export default App;
