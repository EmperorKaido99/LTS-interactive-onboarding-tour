import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "supervisor-6na-home-tour";

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
        title: "Step 2: Select Assigned 6NA",
        description:
          "Welcome to the Authorised Supervisor Home Page. From here you will review and complete Stage 2 of a Six Monthly Needs Analysis assigned to you by a Trainee.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#as-profile-select",
      popover: {
        title: "Select Authorised Supervisor Profile",
        description:
          "Select Authorised Supervisor if you have multiple permissions linked to your profile. This ensures you access the system with the correct role.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#as-continue-btn",
      popover: {
        title: "Continue",
        description:
          "Click Continue to navigate to the Home Page with your Authorised Supervisor permissions active.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#as-6na-link",
      popover: {
        title: "Open Six Monthly Needs Analysis",
        description:
          "Click on the Six Monthly Needs Analysis hyperlink to review the 6NA. The status shows the current stage and who needs to take action.",
        side: "top",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
