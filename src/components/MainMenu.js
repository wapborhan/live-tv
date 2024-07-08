"use client";
import Image from "next/image";
import Link from "next/link";
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
          <Image src="/logo.avif" alt="user" width={100} height={100} />
          <p>Live TV</p>
        </div>
        <ul>
          <li className="nav-item active">
            <Link href="/">
              <i className="fa fa-home nav-icon"></i>
              <span className="nav-text">Home</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/channel">
              <i className="fa fa-arrow-trend-up nav-icon"></i>
              <span className="nav-text">Channel</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/music">
              <i className="fa fa-compact-disc nav-icon"></i>
              <span className="nav-text">Music</span>
            </Link>
          </li>
          {/* <li className="nav-item">
            <a href="#">
              <i className="fa fa-circle-play nav-icon"></i>
              <span className="nav-text">Playlist</span>
            </a>
          </li> */}
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
