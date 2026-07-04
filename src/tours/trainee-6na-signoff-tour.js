import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "trainee-6na-signoff-tour";

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
        title: "Step 6: Finalise 6NA",
        description:
          "This is the final step. Read the declaration carefully before clicking Agree to finalise your Six Monthly Needs Analysis.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#na-please-note",
      popover: {
        title: "Please Note",
        description:
          "Please Note: Read the declaration carefully before proceeding.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#na-declaration",
      popover: {
        title: "Declaration",
        description:
          "By clicking Agree, you confirm that the work submitted is a true and accurate reflection of your work experience. The information provided is genuine and you acknowledge full responsibility for its authenticity.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#na-next-steps",
      popover: {
        title: "Next Steps",
        description:
          "Once you click Agree, no further changes can be made. The Authorised Supervisor will then be able to access and review the 6NA.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#na-agree-btn",
      popover: {
        title: "Agree",
        description:
          "Click Agree to finalise and submit your Six Monthly Needs Analysis to the Authorised Supervisor.",
        side: "top",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
