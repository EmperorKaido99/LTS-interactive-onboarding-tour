import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "trainee-sr-signoff-tour";

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
      popover: {
        title: "Step 5: Sign Off Skill Review",
        description:
          "This is the final step. Read the declaration and agree to submit your Skill Review to your Reviewer/Supervisor.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#sr-declaration",
      popover: {
        title: "1. Read the Declaration",
        description:
          "Read the declaration carefully before clicking on 'Agree'. This confirms that the information you provided is true and accurate.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#sr-agree-btn",
      popover: {
        title: "2. Click Agree",
        description:
          "Click 'Agree' to sign off and submit your Skill Review to your Reviewer/Supervisor for assessment.",
        side: "right",
        align: "start",
      },
    },
    {
      element: "#sr-print-link",
      popover: {
        title: "Print Report",
        description:
          "Use the Print hyperlink to view and print a detailed Skill Review report.",
        side: "left",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
