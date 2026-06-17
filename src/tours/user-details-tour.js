import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "user-details-tour";

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
      element: "#user-first-name",
      popover: {
        title: "First Name",
        description: "Verify your first name is correct. Update it if needed.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#user-last-name",
      popover: {
        title: "Last Name",
        description:
          "Verify your last name. This should match your official records.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#user-email",
      popover: {
        title: "Email Address",
        description:
          "Enter or update your email. This is used for notifications and password resets.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#user-phone",
      popover: {
        title: "Phone Number",
        description:
          "Enter your phone number (optional). Helpful for account recovery.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#user-department",
      popover: {
        title: "Department",
        description:
          "Select your department. This determines which modules and reports you can access.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#user-role",
      popover: {
        title: "Role",
        description:
          "Your role is set by your administrator and controls your permissions. You cannot change this.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#user-save",
      popover: {
        title: "Save Changes",
        description:
          'Click "Save Changes" once all details are correct. You will be redirected to the LTS Home page.',
        side: "top",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
