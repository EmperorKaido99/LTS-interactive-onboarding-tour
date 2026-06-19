import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "reviewer-sr-home-tour";

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
        title: "Step 2: Reviewer/Supervisor Review Skill Review",
        description:
          "Welcome to the Reviewer/Supervisor Home Page. You will review Skill Reviews assigned to you by trainees.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#rv-profile-select",
      popover: {
        title: "1. Select Permission",
        description:
          "Select Reviewer/Supervisor permission if you have multiple permissions linked to your profile.",
        side: "right",
        align: "start",
      },
    },
    {
      element: "#rv-continue-btn",
      popover: {
        title: "2. Click Continue",
        description:
          "Click on Continue to navigate to the Home Page with Reviewer permissions.",
        side: "right",
        align: "start",
      },
    },
    {
      element: "#rv-sr-link",
      popover: {
        title: "3. Click on Assigned Skill Review",
        description:
          "On the Home page, click on the assigned Skill Review hyperlink to review it. The Skill Review awaiting your review will appear under OPEN ITEMS.",
        side: "bottom",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
