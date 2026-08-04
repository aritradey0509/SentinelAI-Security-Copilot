import "./Navbar.css";

import {
  FaBell,
  FaSearch,
  FaUserCircle,
  FaChevronDown,
  FaCircle,
  FaFilePdf,
  FaShieldAlt,
  FaRobot,
} from "react-icons/fa";

import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const titles = {
    "/": "Dashboard",
    "/upload": "Upload Logs",
    "/assistant": "AI Assistant",
    "/reports": "Reports",
  };

  const pageTitle = titles[location.pathname] || "SentinelAI";

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <header className="navbar">

      <div className="navbar-left">

          <h1>{pageTitle}</h1>

          <p className="navbar-subtitle">
            Welcome back, Admin • Monitor your network security in real time.
          </p>

        </div>

      <div className="navbar-right">

        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search..."
          />
        </div>

        {/* Notifications */}

        <div
          className="dropdown-wrapper"
          ref={notificationRef}
        >
          <button
            className="notification-btn"
            onClick={() =>
              setShowNotifications(!showNotifications)
            }
          >
            <FaBell />

            <span className="notification-badge">
              3
            </span>

          </button>

          {showNotifications && (

            <div className="dropdown-menu">

              <h4>Notifications</h4>

              <div className="dropdown-item">
                <FaShieldAlt />
                <div>
                  <strong>Analysis Complete</strong>
                  <p>
                    Latest network scan finished.
                  </p>
                </div>
              </div>

              <div className="dropdown-item">
                <FaRobot />
                <div>
                  <strong>AI Assistant Ready</strong>
                  <p>
                    Ready to answer questions.
                  </p>
                </div>
              </div>

              <div className="dropdown-item">
                <FaFilePdf />
                <div>
                  <strong>PDF Report Available</strong>
                  <p>
                    Download the latest report.
                  </p>
                </div>
              </div>

            </div>

          )}

        </div>

        {/* Profile */}

        <div
          className="dropdown-wrapper"
          ref={profileRef}
        >
          <button
            className="profile-btn"
            onClick={() =>
              setShowProfile(!showProfile)
            }
          >
            <FaUserCircle />

            <span>Admin</span>

            <FaChevronDown
              style={{
                fontSize: 12,
              }}
            />
          </button>

          {showProfile && (

            <div className="dropdown-menu profile-menu">

              <h4>Administrator</h4>

              <div className="profile-row">
                <FaCircle
                  style={{
                    color: "#22c55e",
                    fontSize: 10,
                  }}
                />

                Backend Connected
              </div>

              <div className="profile-row">
                🤖 Random Forest IDS
              </div>

              <div className="profile-row">
                🛡 SentinelAI v1.0
              </div>

              <hr />

              <button className="menu-btn">
                View Profile
              </button>

              <button className="menu-btn logout">
                Logout
              </button>

            </div>

          )}

        </div>

      </div>

    </header>
  );
}

export default Navbar;