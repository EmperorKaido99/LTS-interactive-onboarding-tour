import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "help-tour";

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
      element: "#help-contact",
      popover: {
        title: "Contact Support",
        description:
          "If you need help, these are the main support contacts for the LTS system.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#help-email",
      popover: {
        title: "Email Support",
        description:
          "For non-urgent questions, send an email to the LTS support team.",
        side: "right",
        align: "start",
      },
    },
    {
      element: "#help-phone",
      popover: {
        title: "Phone Support",
        description: "For urgent issues, call the support hotline during business hours.",
        side: "left",
        align: "start",
      },
    },
    {
      element: "#help-documents",
      popover: {
        title: "Documents & Guides",
        description:
          "Download user guides, training manuals, and reference materials from this section.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#help-faq",
      popover: {
        title: "FAQ",
        description:
          "Check here for answers to common questions before contacting support.",
        side: "top",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
