import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "timesheet-reversal-tour";

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
        title: "Timesheet Reversal",
        description:
          "If the Reviewer does not approve the timesheet, the TIMESHEET REVERSAL window is used to reverse it back to the Timesheet User to correct.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#ts-reversal-note",
      popover: {
        title: "What Happens on Reversal",
        description:
          "The initial sign off date is cleared from all reports and the timesheet reverts to Step 1 with status 'With Timesheet User'. The user makes the amendments and re-assigns it to the Reviewer.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#ts-reversal-comment",
      popover: {
        title: "Capture the Reason",
        description:
          "Capture the <strong>reason for the reversal</strong> \u2014 this tells the Timesheet User what to amend.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#ts-reversal-actions",
      popover: {
        title: "Send Back",
        description:
          "Click on <strong>Send Back to Timesheet User</strong> to return the timesheet for correction, or Cancel to go back.",
        side: "top",
        align: "center",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
