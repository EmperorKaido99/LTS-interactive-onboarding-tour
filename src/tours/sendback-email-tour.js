import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "sendback-email-tour";

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
        title: "Edit or Send Back a Skill Review",
        description:
          "In this tour you will learn how a Reviewer/Supervisor can edit Skill Review setup information or send a Skill Review back to the Trainee for amendments.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#sb-email-panel",
      popover: {
        title: "Step 1: Email Notification",
        description:
          "The Reviewer/Supervisor receives an email notification of the assigned Skill Review, showing the Trainee's name and the client the SR was created for.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#sb-email-logon",
      popover: {
        title: "Login to LTS",
        description:
          "Login to www.LTSystems.co.za with your Supervisor permission to review the SR.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#sb-profile-select",
      popover: {
        title: "Select Your Profile",
        description:
          "If you have multiple permissions linked to your profile, select the Reviewer/Supervisor profile before continuing.",
        side: "right",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
