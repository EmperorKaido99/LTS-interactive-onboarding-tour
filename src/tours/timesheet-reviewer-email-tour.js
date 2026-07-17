import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "timesheet-reviewer-email-tour";

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
    tourDriver.destroy();
  },
  steps: [
    {
      popover: {
        title: "Timesheet Assigned to the Reviewer",
        description:
          "The Timesheet User's weekly timesheet has been assigned to the Reviewer/Supervisor for review and sign off. We now switch to the reviewer's point of view.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#ts-email-body",
      popover: {
        title: "Email Notification",
        description:
          "The Reviewer/Supervisor receives an email notification of the assigned timesheet, showing the Timesheet User and the timesheet period.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#ts-email-logon",
      popover: {
        title: "Logon to Finalise",
        description:
          "The email asks the reviewer to logon to www.LTSystems.co.za with their Reviewer permission to finalise the timesheet.",
        side: "bottom",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
