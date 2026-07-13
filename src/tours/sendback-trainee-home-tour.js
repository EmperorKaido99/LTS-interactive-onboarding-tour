import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "sendback-trainee-home-tour";

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
        title: "Trainee Logs On to Make Amendments",
        description:
          "The Trainee logs on to LTS with the Trainee profile. The sent-back Skill Review appears under Open Items on the Learner Home page.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#sb-days-since",
      popover: {
        title: "Days Since Last",
        description:
          "The Days Since Last table shows when the SR was initiated, last worked on, and finalised.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#sb-open-sr-link",
      popover: {
        title: "Open the Skill Review",
        description:
          "The Trainee opens the SR to make the amendments as the Reviewer/Supervisor has instructed.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#sb-finish-btn",
      popover: {
        title: "Finish",
        description:
          "After all amendments are made, the Trainee clicks Finish to assign the SR back to the Reviewer/Supervisor for them to review.",
        side: "left",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
