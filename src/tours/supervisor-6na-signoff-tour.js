import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "supervisor-6na-signoff-tour";

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
        title: "Step 6: Complete Stage 2 of 6NA",
        description:
          "This is the final step. As the Authorised Supervisor, you will now sign off the Six Monthly Needs Analysis to complete Stage 2.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#as-signoff-notice",
      popover: {
        title: "Sign Off Declaration",
        description:
          "This sign off indicates that both the Trainee and the Authorised Supervisor, after having met and discussed this 6NA, agree with the contents of this document.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#as-signoff-btn",
      popover: {
        title: "Sign Off",
        description:
          "Click Sign Off to finalise and complete Stage 2 of the Six Monthly Needs Analysis. The Trainee will be notified, and the 6NA will move to the next stage.",
        side: "top",
        align: "center",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
