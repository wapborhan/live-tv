"use client";
import React, { useEffect } from "react";

const ScrollableContainers = () => {
  useEffect(() => {
    const containers = document.querySelectorAll(".containers");

    containers.forEach((container) => {
      let isDragging = false;
      let startX;
      let scrollLeft;

      container.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
      });

      container.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const step = (x - startX) * 0.6;
        container.scrollLeft = scrollLeft - step;
      });

      container.addEventListener("mouseup", () => {
        isDragging = false;
      });

      container.addEventListener("mouseleave", () => {
        isDragging = false;
      });
    });
  }, []);

  return null;
};

export default ScrollableContainers;
