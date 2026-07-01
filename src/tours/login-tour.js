import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";
import { blurExcept, clearBlur } from "../shared/blur-overlay.js";

const TOUR_NAME = "login-tour";

let currentStepIndex = 0;

const tourDriver = driver({
  showProgress: true,
  animate: true,
  smoothScroll: true,
  allowClose: true,
  overlayColor: "rgba(0, 0, 0, 0.6)",
  onHighlightStarted: (element, step) => {
    const stepId = step.element ? step.element.replace("#", "") : `step-${currentStepIndex}`;
    narrate(TOUR_NAME, stepId);

    // Blur all sections except the one containing the highlighted element
    const activeEl = step.element ? document.querySelector(step.element) : null;
    blurExcept(activeEl);
  },
  onNextClick: () => {
    currentStepIndex++;
    tourDriver.moveNext();
  },
  onPrevClick: () => {
    currentStepIndex--;
    tourDriver.movePrevious();
  },
  onDestroyStarted: () => {
    stopNarration();
    clearBlur();
    currentStepIndex = 0;
  },
  steps: [
    {
      element: "#login-bar",
      popover: {
        title: "Step 1: Login Area",
        description:
          "You will receive a welcome email with your username and password. Enter them here in the login bar at the top of the LTS website (www.LTSystems.co.za).",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#top-username",
      popover: {
        title: "Step 1a: Username",
        description:
          "Enter your assigned USERNAME from the welcome email.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#top-password",
      popover: {
        title: "Step 1b: Password",
        description:
          "Enter the PASSWORD provided in your welcome email.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#login-button",
      popover: {
        title: "Step 1c: Click LOGIN",
        description:
          "Click the LOGIN button to access the system. You will be taken to the Login Credentials screen.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#credentials-panel",
      popover: {
        title: "Step 2: Login Credentials",
        description:
          "This is the Login Credentials panel. From here you can create a new password or continue to edit your user details.",
        side: "right",
        align: "start",
      },
    },
    {
      element: "#create-password-btn",
      popover: {
        title: "Step 2a: Create New Password",
        description:
          'Click "Create New Password" to set up your own password. Follow the instructions, then click Save.',
        side: "bottom",
        align: "start",
      },
      onDeselected: () => {
        // Blur left panel, un-blur right panel (password dialog)
        document.getElementById("credentials-panel").classList.add("credential-panel-blurred");
        document.getElementById("password-dialog").classList.remove("credential-panel-blurred");
      },
    },
    {
      element: "#password-dialog",
      popover: {
        title: "Step 3: Password Setup",
        description:
          "This dialog appears when you click Create New Password. Enter your new password and confirm it.",
        side: "left",
        align: "start",
      },
    },
    {
      element: "#new-password",
      popover: {
        title: "Step 3a: New Password",
        description:
          "Enter your new password here.",
        side: "left",
        align: "start",
      },
    },
    {
      element: "#confirm-password",
      popover: {
        title: "Step 3b: Confirm Password",
        description:
          "Re-enter your new password to confirm it matches.",
        side: "left",
        align: "start",
      },
    },
    {
      element: "#password-rules",
      popover: {
        title: "Step 3c: Password Requirements",
        description:
          "Your password must contain: minimum 8 characters, maximum 15 characters, at least 1 alphabet character and at least 1 number.",
        side: "left",
        align: "start",
      },
    },
    {
      element: "#save-btn",
      popover: {
        title: "Step 3d: Save Password",
        description:
          'Click "Save" to save your new password.',
        side: "left",
        align: "start",
      },
      onDeselected: () => {
        // Blur right panel, un-blur left panel (back to credentials)
        document.getElementById("password-dialog").classList.add("credential-panel-blurred");
        document.getElementById("credentials-panel").classList.remove("credential-panel-blurred");
      },
    },
    {
      element: "#continue-btn",
      popover: {
        title: "Step 4: Continue",
        description:
          'Click "Continue" to proceed to the next screen: Edit/Update User Details.',
        side: "top",
        align: "end",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
