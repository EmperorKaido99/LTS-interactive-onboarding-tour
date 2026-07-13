import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "sendback-trainee-email-tour";

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
        title: "Step 3: Skill Review Reassigned to Trainee",
        description:
          "The Trainee receives an email notification that the Skill Review has been sent back, with instructions from the Reviewer/Supervisor.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#sb-sendback-notice",
      popover: {
        title: "Send Back Notification",
        description:
          "The email confirms that the SR has been sent back to the Trainee profile to make the required amendments.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#sb-instruction-block",
      popover: {
        title: "Instruction from Supervisor",
        description:
          "The Supervisor's reversal comment appears here so the Trainee knows exactly what to amend before assigning the SR back.",
        side: "bottom",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
