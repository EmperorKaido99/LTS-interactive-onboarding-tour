import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "user-details-tour";

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
    currentStepIndex = 0;
  },
  steps: [
    {
      element: "#alert-banner",
      popover: {
        title: "Important Notice",
        description:
          "Please ensure all your information is correct before proceeding.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#personal-info",
      popover: {
        title: "Step 1: Personal Information",
        description:
          "Update your personal details here. Please take note of the mandatory fields marked with red asterisks (*). The yellow-highlighted fields are compulsory.",
        side: "right",
        align: "start",
      },
    },
    {
      element: "#contact-info",
      popover: {
        title: "Step 1b: Contact Information",
        description:
          "Email 1 must be your work email address. Email 2 may be updated with another personal address for additional notifications.",
        side: "right",
        align: "start",
      },
    },
    {
      element: "#training-info",
      popover: {
        title: "Step 1c: Training Program Information",
        description:
          "Contract information must always be accurate. If it needs to be updated, then your Training Officer or assistant can send an email to Support@LTSystems.co.za with the correct contract information.",
        side: "right",
        align: "start",
      },
    },
    {
      element: "#note-area",
      popover: {
        title: "Step 2: Verify Information",
        description:
          'Please verify that all information is accurate and up to date. If not, click on "Log Support Ticket" to inform the support team.',
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#support-tabs",
      popover: {
        title: "Step 2b: Support Tickets",
        description:
          'If your information is incorrect and cannot be updated by you, click "Log Support Ticket" to notify the LTS support team.',
        side: "top",
        align: "start",
      },
    },
    {
      element: "#update-btn",
      popover: {
        title: "Step 3: Click Update",
        description:
          'Click the "Update" button to save all changes and move on to your LTS User Home Page.',
        side: "top",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
