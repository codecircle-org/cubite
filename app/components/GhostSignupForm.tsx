"use client"

import { useEffect } from 'react';

interface GhostSignupFormProps {
  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  title?: string;
  description?: string;
  icon?: string;
  siteUrl?: string;
  locale?: string;
}

export const GhostSignupForm = ({
  backgroundColor = 'rgb(8 9 12 / 88%)',
  textColor = '#FFFFFF',
  buttonColor = '#407fb5',
  buttonTextColor = '#FFFFFF',
  title = "Mr. John's Test Prep Newsletter",
  description = "Ace your exams with expert insights from Mr. John's Test Prep Newsletter! We offer personalized tips, strategies, and resources for SAT, ACT, and more.",
  icon = 'https://blog.mrjohnstestprep.com/content/images/size/w192h192/size/w256h256/2025/01/Mr.-John-s.png',
  siteUrl = 'https://blog.mrjohnstestprep.com/',
  locale = 'en'
}: GhostSignupFormProps) => {
  useEffect(() => {
    // Load the Ghost signup form script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/ghost/signup-form@~0.2/umd/signup-form.min.js';
    script.async = true;
    script.dataset.backgroundColor = backgroundColor;
    script.dataset.textColor = textColor;
    script.dataset.buttonColor = buttonColor;
    script.dataset.buttonTextColor = buttonTextColor;
    script.dataset.title = title;
    script.dataset.description = description;
    script.dataset.icon = icon;
    script.dataset.site = siteUrl;
    script.dataset.locale = locale;

    // Add script to the container
    const container = document.getElementById('ghost-signup-form');
    if (container) {
      container.appendChild(script);
    }

    // Cleanup
    return () => {
      if (container && script) {
        container.removeChild(script);
      }
    };
  }, [backgroundColor, textColor, buttonColor, buttonTextColor, title, description, icon, siteUrl, locale]);

  return (
    <div
      id="ghost-signup-form"
      style={{
        height: '40vmin',
        minHeight: '360px'
      }}
    />
  );
};