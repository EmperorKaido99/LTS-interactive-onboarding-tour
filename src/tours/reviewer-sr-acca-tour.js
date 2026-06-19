import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "reviewer-sr-acca-tour";

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
        title: "Step 3: Review ACCA Audit Units",
        description:
          "Review the ACCA Audit Units completed by the Trainee. You can update values and add your Reviewer/Supervisor comment.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#rv-acca-clients",
      popover: {
        title: "1. Review Audit Details",
        description:
          "Reviewer/Supervisor can update the Number of Clients, Audit class hours, Other work hours, Client sectors, and Client Size.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#rv-agree-col",
      popover: {
        title: "2. Agree or Disagree",
        description:
          "Review elements and Statement of Achievement. Reviewer/Supervisor can Agree or Disagree with the Trainee's submissions.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#rv-acca-comment-col",
      popover: {
        title: "3. Add Reviewer Comment",
        description:
          "Add your Reviewer/Supervisor comment for each element.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#rv-acca-send-back",
      popover: {
        title: "Send Back (if needed)",
        description:
          "If any amendments are required, Reviewer/Supervisor can send back the Skill Review to the Trainee.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#rv-acca-signoff-btn",
      popover: {
        title: "4. Sign Off",
        description:
          "Click on 'Sign Off' to finalise the skill review and proceed to the declaration page.",
        side: "top",
        align: "end",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
