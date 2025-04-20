"use client";

import { useState, useEffect } from "react";

export const useAlert = (initialMessage = "", initialStatus = 0) => {
  const [message, setMessage] = useState(initialMessage);
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setStatus(0);
      }, 3000); // Alert will disappear after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [message]);

  return { message, status, setMessage, setStatus };
};
