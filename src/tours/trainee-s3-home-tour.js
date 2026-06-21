import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "trainee-s3-home-tour";

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
        title: "Step 1: Login to LTS and Review 6NA",
        description:
          "Login to www.LTSystems.co.za with your Trainee profile. You will review the assigned Six Monthly Needs Analysis to complete Stage 3.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#s3-6na-link",
      popover: {
        title: "Open Six Monthly Needs Analysis",
        description:
          "Click on the Six Monthly Needs Analysis hyperlink to open the 6NA. The status shows Stage 5: With Trainee, meaning it is ready for your review and sign-off.",
        side: "bottom",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
