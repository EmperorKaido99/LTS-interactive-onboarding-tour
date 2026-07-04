import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "reviewer-sr-signoff-tour";

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
        title: "Step 4: Finalise Skill Review",
        description:
          "This is the final step. Read the declaration and agree to finalise the Skill Review.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#rv-declaration",
      popover: {
        title: "Read the Declaration",
        description:
          "Read the declaration carefully. By clicking Agree, you confirm that you have reviewed and assessed the Trainee's competencies.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#rv-agree-btn",
      popover: {
        title: "Click Agree",
        description:
          "Click 'Agree' to finalise the Skill Review. Both the Trainee and Reviewer/Supervisor will be notified.",
        side: "right",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
