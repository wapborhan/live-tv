"use client";
import React, { useEffect } from "react";

const MainMenu = () => {
  useEffect(() => {
    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach((navItem) => {
      navItem.addEventListener("click", () => {
        navItems.forEach((item) => {
          item.className = "nav-item";
        });
        navItem.className = "nav-item active";
      });
    });
  }, []);

  return (
    <nav className="main-menu">
      <div>
        <div className="user-info">
          <img
            src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/37e5ccfa-f9ee-458b-afa2-dcd85b495e4e"
            alt="user"
          />
          <p>Jane Wilson</p>
        </div>
        <ul>
          <li className="nav-item active">
            <a href="#">
              <i className="fa fa-map nav-icon"></i>
              <span className="nav-text">Discover</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#">
              <i className="fa fa-arrow-trend-up nav-icon"></i>
              <span className="nav-text">Trending</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#">
              <i className="fa fa-compact-disc nav-icon"></i>
              <span className="nav-text">Album</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#">
              <i className="fa fa-circle-play nav-icon"></i>
              <span className="nav-text">Playlist</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#">
              <i className="fa fa-heart nav-icon"></i>
              <span className="nav-text">Favorites</span>
            </a>
          </li>
        </ul>
      </div>
      <ul>
        <li className="nav-item">
          <a href="#">
            <i className="fa fa-user nav-icon"></i>
            <span className="nav-text">Profile</span>
          </a>
        </li>
        <li className="nav-item">
          <a href="#">
            <i className="fa fa-gear nav-icon"></i>
            <span className="nav-text">Settings</span>
          </a>
        </li>
        <li className="nav-item">
          <a href="#">
            <i className="fa fa-right-from-bracket nav-icon"></i>
            <span className="nav-text">Logout</span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default MainMenu;
