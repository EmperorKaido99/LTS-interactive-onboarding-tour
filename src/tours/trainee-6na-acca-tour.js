import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "trainee-6na-acca-tour";

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
        title: "Step 5: Document Complete + ACCA Audit Units",
        description:
          "Complete the ACCA Audit Units and navigate to the sign-off page. Click Document Complete first, then update the ACCA Audit Units.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#na-doc-complete-btn",
      popover: {
        title: "Document Complete",
        description:
          "Click Document Complete to navigate to the ACCA Audit Units page. This indicates you have completed all required sections.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#na-time-summary",
      popover: {
        title: "Time Summary",
        description:
          "The Six Monthly Needs Analysis Time Summary shows the period dates and audit information. Update the hours, client details, and sectors as needed.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#na-client-sectors",
      popover: {
        title: "Client Sectors",
        description:
          "Select one or more Client Sectors related to the work performed during this period.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#na-client-size",
      popover: {
        title: "Client Size",
        description:
          "Select the Client Size classification.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#na-unit-section",
      popover: {
        title: "Audit Unit Details",
        description:
          "Review the audit unit details including elements and your statement of achievement.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#na-overall-statement",
      popover: {
        title: "Overall Statement of Achievement",
        description:
          "Capture your Overall Statement of Achievement. Use the STAR format to describe specific examples of your work.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#na-complete-btn",
      popover: {
        title: "Complete 6NA",
        description:
          "Click Complete Six Monthly Needs Analysis to assign the 6NA to your Authorised Supervisor for review.",
        side: "top",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
