import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "sendback-signoff-tour";

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
        title: "Step 4: Complete the Audit Units Page",
        description:
          "After making the amendments, the Trainee completes the Audit Units page and signs off the Skill Review to assign it back to the Reviewer/Supervisor.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#sb-instruction-reminder",
      popover: {
        title: "Supervisor's Instruction",
        description:
          "The Supervisor's instruction is shown as a reminder of the amendments required before signing off.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#sb-audit-class",
      popover: {
        title: "Select Audit Class",
        description:
          "Select the Audit Class if relevant, and complete all the Audit Class sections.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#sb-other-hours",
      popover: {
        title: "Other Work Hours",
        description:
          "Capture any hours not included in the Audit Class selected above.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#sb-signoff-btn",
      popover: {
        title: "Sign Off Skill Review",
        description:
          "Click Signoff Skill Review to assign the SR to the Reviewer/Supervisor. A declaration will appear — read it before clicking Agree.",
        side: "top",
        align: "end",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
