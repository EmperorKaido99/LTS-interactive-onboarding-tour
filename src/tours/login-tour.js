import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "login-tour";

const tourDriver = driver({
  showProgress: true,
  animate: true,
  smoothScroll: true,
  allowClose: true,
  overlayColor: "rgba(0, 0, 0, 0.6)",
  onHighlightStarted: (element, step) => {
    const stepId = step.element?.replace("#", "");
    if (stepId) narrate(TOUR_NAME, stepId);
  },
  onDestroyStarted: () => {
    stopNarration();
  },
  steps: [
    {
      element: "#login-username",
      popover: {
        title: "Step 1: Enter Username",
        description:
          "Enter your LTS username — this is usually your employee ID or the username from your welcome email.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#login-password",
      popover: {
        title: "Step 2: Enter Password",
        description:
          "Enter the temporary password provided in your welcome email.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#login-button",
      popover: {
        title: "Step 3: Log In",
        description:
          'Click "Log In" to access the system. Since this is your first login, you will be prompted to set a new password.',
        side: "top",
        align: "start",
      },
      onDeselected: () => {
        // Show the password setup form when moving past the login button step
        document.getElementById("login-form").style.display = "none";
        document.getElementById("password-setup").style.display = "block";
      },
    },
    {
      element: "#password-new",
      popover: {
        title: "Step 4: New Password",
        description:
          "Create a strong new password that meets the requirements listed below.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#password-confirm",
      popover: {
        title: "Step 5: Confirm Password",
        description: "Re-enter your new password to confirm it matches.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#password-rules",
      popover: {
        title: "Step 6: Password Requirements",
        description:
          "Review these rules carefully. Your password must satisfy all of them before it can be accepted.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#password-submit",
      popover: {
        title: "Step 7: Submit",
        description:
          'Click "Submit" to save your new password. You will be redirected to update your user details.',
        side: "top",
        align: "start",
      },
    },
  ],
});

// Auto-start the tour when the page loads
window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
