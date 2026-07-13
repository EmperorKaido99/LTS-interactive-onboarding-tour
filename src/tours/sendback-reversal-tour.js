import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "sendback-reversal-tour";

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
        title: "Skill Review Reversal",
        description:
          "This page confirms the reversal of the Skill Review back to the Trainee.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#sb-reversal-note",
      popover: {
        title: "Please Note",
        description:
          "Read the notes carefully: the Trainee's initial sign off date will be cleared, and the document reverts to Step 1 with status 'With Trainee'. Once the Trainee finalises the amendments, the document is re-assigned to the Supervisor.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#sb-reversal-comment",
      popover: {
        title: "Supervisor Reversal Comment",
        description:
          "Add a comment or instructions for the Trainee so they know exactly which amendments to make. This comment is included in the Trainee's email notification.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#sb-reversal-actions",
      popover: {
        title: "Send Back or Cancel",
        description:
          "Click Send Back to Trainee to send the SR back, or Cancel to return without sending it back.",
        side: "top",
        align: "center",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
