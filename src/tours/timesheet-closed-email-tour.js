import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "timesheet-closed-email-tour";

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
        title: "Timesheet Closed",
        description:
          "Once the Reviewer signs off, the weekly timesheet is finalized and the Timesheet User receives an email notification about the closed timesheet.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#ts-final-body",
      popover: {
        title: "Finalised Notification",
        description:
          "The email confirms which Reviewer finalised the timesheet, for which period, and when.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#ts-final-howto",
      popover: {
        title: "View, Save or Print",
        description:
          "To view, save or print a copy: logon to LTS, open your STATUS REPORT from the home page, and click the document's STATUS hyperlink to view, print or save as PDF.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#ts-closed-link",
      popover: {
        title: "Closed Timesheets",
        description:
          "To view the completed timesheet, click on the hyperlink <strong>Link to Closed Timesheets</strong> on the Home Page.",
        side: "bottom",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
