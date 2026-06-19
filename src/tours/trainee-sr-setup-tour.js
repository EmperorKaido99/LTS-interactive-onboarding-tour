import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "trainee-sr-setup-tour";

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
        title: "Step 2: Setup Skill Review",
        description:
          "Now you need to fill in the details to set up your Skill Review. Follow the steps below to complete the setup.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#sr-reviewer-select",
      popover: {
        title: "1. Select Supervisor/Reviewer",
        description:
          "Select your Supervisor/Reviewer from the drop-down list. Click on 'Show All Users' if you can't find your Reviewer/Supervisor on the drop-down list.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#sr-client-desc",
      popover: {
        title: "2. Add Client Description",
        description:
          "Add the Client Description — this is the assignment or engagement reference.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#sr-job-dates",
      popover: {
        title: "3. Job Start and End Dates",
        description:
          "Select the Job Start Date and Job End Date — indicate the day that the work/project/assignment started and the day it was finalised.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#sr-assignment-desc",
      popover: {
        title: "4. Assignment Description",
        description:
          "Add the Assignment Description — your assigned responsibility and important information related to the work reviewed in this SR.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#sr-additional-notes",
      popover: {
        title: "5. Additional Notes",
        description:
          "Add Additional Notes if necessary. This is an optional field.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#sr-new-review-btn",
      popover: {
        title: "6. Click New Review",
        description:
          "Click 'New Review' to save the information and proceed to rating your skills.",
        side: "top",
        align: "end",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
