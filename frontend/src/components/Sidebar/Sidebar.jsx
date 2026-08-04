import { NavLink } from "react-router-dom";

import {
  FaShieldAlt,
  FaChartBar,
  FaUpload,
  FaRobot,
  FaFileAlt,
  FaCog
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar() {
  const menu = [
    {
      title: "Dashboard",
      icon: <FaChartBar />,
      path: "/",
    },
    {
      title: "Upload Logs",
      icon: <FaUpload />,
      path: "/upload",
    },
    {
      title: "AI Assistant",
      icon: <FaRobot />,
      path: "/assistant",
    },
    {
      title: "Reports",
      icon: <FaFileAlt />,
      path: "/reports",
    },
  ];

  return (
    <aside className="sidebar">

      <div className="logo">

        <FaShieldAlt className="logo-icon" />

        <div>
          <h2>SentinelAI</h2>
          <p>Security Copilot</p>
        </div>

      </div>

      <nav>

        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            {item.icon}

            <span>{item.title}</span>

          </NavLink>
        ))}

      </nav>

      <div className="sidebar-footer">

        <h4>System Status</h4>

        <div className="status">

          <span className="green-dot"></span>

          <p>Protected</p>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;