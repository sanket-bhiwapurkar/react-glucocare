import { Link, withRouter } from "react-router-dom";
import { Component } from "react";
import Cookies from "js-cookie";
import { MdNotificationsActive } from "react-icons/md";
import "./index.css";

class NavBar extends Component {
  state = { showMenu: false };

  showMenu = () => {
    this.setState({ showMenu: true });
  };

  closeMenu = () => {
    this.setState({ showMenu: false });
  };

  onLogout = () => {
    Cookies.remove("jwt_token");
    const { history } = this.props;
    history.replace("/login");
  };

  render() {
    const { showMenu } = this.state;
    const hamburgerMenuItemsClassName = showMenu ? "show-menu" : "hide-menu";
    return (
      <>
        <nav className="navbar" id="navbar">
          <Link to="/" className="link">
            <div className="logo-container">
              <img
                src="https://www.kratin.co.in/images/kratin01.png"
                alt="website logo"
                className="logo"
              />
              <h1 className="logo-heading">GlucoCare</h1>
            </div>
          </Link>
          <ul className="menu-list">
            <li>
              <Link to="/reminders" className="link notification-menu-item">
                <MdNotificationsActive size={20} />
                <p></p>
              </Link>
            </li>
            <li className="hamburger-menu-item">
              <button
                type="button"
                className="menu-btn"
                onClick={this.showMenu}
              >
                <img
                  src="https://res.cloudinary.com/dsmezwsiq/image/upload/v1681288446/BookHub/hamburger-icon_epz2jl.svg"
                  alt="menu"
                />
              </button>
            </li>
            <li className="menu-item">
              <Link to="/" className="link">
                <p>Home</p>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/trackers" className="link">
                <p>Trackers</p>
              </Link>
            </li>
            <li className="menu-item">
              <button
                type="button"
                className="logout-btn"
                onClick={this.onLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>

        <div
          className={`hamburger-menu-items ${hamburgerMenuItemsClassName}`}
          id="hamburgerMenuItems"
        >
          <ul className="menu-list">
            <li className="hamburger-menu-item">
              <Link to="/" className="link">
                <p>Home</p>
              </Link>
            </li>
            <li className="hamburger-menu-item">
              <Link to="/trackers" className="link">
                <p>Trackers</p>
              </Link>
            </li>
            <li className="hamburger-menu-item">
              <button
                type="button"
                className="logout-btn"
                onClick={this.onLogout}
              >
                Logout
              </button>
            </li>
            <li className="hamburger-menu-item">
              <button
                type="button"
                className="menu-btn"
                onClick={this.closeMenu}
              >
                <img
                  src="https://res.cloudinary.com/dsmezwsiq/image/upload/v1681290083/BookHub/Close-icon_o1p2bn.svg"
                  alt="close"
                />
              </button>
            </li>
          </ul>
        </div>
      </>
    );
  }
}
export default withRouter(NavBar);
