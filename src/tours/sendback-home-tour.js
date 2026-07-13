import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "sendback-home-tour";

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
        title: "Supervisor Home",
        description:
          "After logging in with the Reviewer/Supervisor profile, you land on the Supervisor Home page where your open Skill Reviews are listed.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#sb-open-reviews",
      popover: {
        title: "Open Skill Reviews",
        description:
          "OPEN REVIEWS lists all documents in progress where the Reviewer/Supervisor is selected. The status on the right indicates to whom the SR is currently assigned and what to do.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#sb-sr-status",
      popover: {
        title: "Assigned To & Status",
        description:
          "This SR shows 'Supervisor not complete' — it is currently assigned to you. PRINT gives a view of the document as it is currently updated.",
        side: "left",
        align: "start",
      },
    },
    {
      element: "#sb-sr-link",
      popover: {
        title: "Open the Skill Review",
        description:
          "Click on the document type hyperlink to open the assigned SR where the status is with the Supervisor/Reviewer.",
        side: "bottom",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
