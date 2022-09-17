import React from "react";

import { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context";

import style from "./Header.module.css";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);

  const getActions = () => {
    if (!user) {
      return (
          <button className={style.action} onClick={() => navigate("login")}>
            Login
          </button>
      )
    } else if (location.pathname === "/") {
      return (
          <button
            className={style.action}
            onClick={() => navigate("gameHistory")}
          >
            Previous Games
          </button>
      );
    }
  };

  return (
    <header className={style.header}>
      <div className={style.container}>
        <Link to="/">Gomoku</Link>
        <div className={style.actions}>{getActions()}</div>
      </div>
    </header>
  );
}
