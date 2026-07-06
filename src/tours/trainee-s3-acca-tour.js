import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "trainee-s3-acca-tour";

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
        title: "Step 3: Review ACCA Audit Units",
        description:
          "Review the ACCA Audit Units page. As a Trainee, you can only review the information on this page — you cannot update anything. If all is in order, click Signoff Six Monthly Needs Analysis.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#s3-readonly-notice",
      popover: {
        title: "Read-Only Notice",
        description:
          "Please Note: As the Trainee, you cannot update anything on this page. This page is for review purposes only.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#s3-time-summary",
      popover: {
        title: "Time Summary",
        description:
          "Review the Six Monthly Needs Analysis Time Summary. This includes Period Start and End Dates, Number of Clients on High-risk and Low-risk work, Hours, and Other Work Hours.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#s3-client-sectors",
      popover: {
        title: "Client Sectors",
        description:
          "Review the Client Sectors related to the work performed during this period. These have been set by the Authorised Supervisor.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#s3-client-size",
      popover: {
        title: "Client Size",
        description:
          "Review the Client Size classification. This has been set by the Authorised Supervisor.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#s3-signoff-6na-btn",
      popover: {
        title: "Signoff Six Monthly Needs Analysis",
        description:
          "If all information is in order, click Signoff Six Monthly Needs Analysis to proceed to the sign-off page.",
        side: "top",
        align: "center",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
