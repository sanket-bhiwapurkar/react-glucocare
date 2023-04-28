import { Route, Switch } from "react-router-dom";
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
      <Route exact path="/" component={Home} />
      <Route
        exact
        path="/add-medicine-reminder"
        component={MedicineReminderForm}
      />
      <Route exact path="/add-glucose-level" component={GlucoseLevelForm} />
      <Route exact path="/reminders" component={Reminders} />
      <Route exact path="/trackers" component={Trackers} />
    </Switch>
  );
}

export default App;
