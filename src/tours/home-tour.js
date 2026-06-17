import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "home-tour";

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
      element: "#home-header",
      popover: {
        title: "LTS Header Bar",
        description:
          "This header appears on every page and gives you quick access to the main sections of the system.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#home-nav",
      popover: {
        title: "Navigation",
        description:
          "Use these links to move between Home, Reports, Documents, and Help.",
        side: "bottom",
        align: "end",
      },
    },
    {
      element: "#home-news",
      popover: {
        title: "News & Announcements",
        description:
          "Stay up to date with important system updates, training reminders, and maintenance notices.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#home-quick-links",
      popover: {
        title: "Quick Links",
        description:
          "One-click access to the most commonly used tools in the system.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#home-sr-link",
      popover: {
        title: "Service Requests",
        description:
          "Click here to access the Service Request module — create and track support tickets.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#home-6na-link",
      popover: {
        title: "6NA Forms",
        description:
          "Click here for 6NA compliance and audit-related form submissions.",
        side: "bottom",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
