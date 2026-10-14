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

    const activeEl = step.element ? document.querySelector(step.element) : null;

    // Show password dialog only when the active step is inside it
    const pwDialog = document.getElementById("password-dialog");
    if (pwDialog) {
      const isPasswordStep = activeEl && (pwDialog === activeEl || pwDialog.contains(activeEl));
      pwDialog.style.display = isPasswordStep ? "block" : "none";
    }

    // Blur all sections except the one containing the highlighted element
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
    tourDriver.destroy();
  },
  steps: [
    {
      element: "#credentials-panel",
      popover: {
        title: "Step 2: Login Credentials",
        description:
          "This is the Login Credentials panel. From here you can create a new password or continue to edit your user details.",
        side: "left",
        align: "start",
      },
    },
    {
      element: "#create-password-btn",
      popover: {
        title: "Step 2a: Create New Password",
        description:
          'Click "Create New Password" to set up your own password.',
        side: "left",
        align: "start",
      },
    },
    {
      element: "#password-dialog",
      popover: {
        title: "Step 3: Password Setup",
        description:
          "This dialog appears when you click Create New Password. Enter your new password and confirm it. Follow the instructions, then click Save.",
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
    },
    {
      element: "#continue-btn",
      popover: {
        title: "Step 4: Continue",
        description:
          'Click "Continue" to proceed to the next screen: Edit/Update User Details.',
        side: "left",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
