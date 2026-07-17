import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "timesheet-review-tour";

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
        title: "Review the Timesheet",
        description:
          "The Reviewer/Supervisor reviews the timesheet information and hours captured by the Timesheet User for the week.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#ts-review-table",
      popover: {
        title: "Check the Entries",
        description:
          "Review each line \u2014 the company, type, activity, daily hours and the comments describing the work done.",
        side: "top",
        align: "center",
      },
    },
    {
      element: "#ts-review-totals",
      popover: {
        title: "Check the Totals",
        description:
          "Verify the Total Core, Total Attendance and Total Hours for the week before signing off.",
        side: "top",
        align: "center",
      },
    },
    {
      element: "#ts-signoff-btn",
      popover: {
        title: "Sign Off",
        description:
          "If everything is in order, click <strong>Sign Off</strong> to approve the timesheet for the stated week. The timesheet is then CLOSED.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#ts-correct-btn",
      popover: {
        title: "Send Back for Correction",
        description:
          "If the timesheet needs to be corrected, click <strong>Timesheet User to correct timesheet</strong> to send it back to the Trainee/Timesheet User.",
        side: "bottom",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
