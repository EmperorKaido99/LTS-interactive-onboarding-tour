import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "sendback-review-tour";

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
        title: "Step 2: Skill Review Items",
        description:
          "The Skill Review opens showing the setup information and the performance objectives rated by the Trainee.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#sb-setup-info",
      popover: {
        title: "Setup Information",
        description:
          "Check the SR setup information — Supervisor, Client Description, dates, days worked, assignment description and notes.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#sb-sendback-link",
      popover: {
        title: "Send Back SR / Edit Setup Information",
        description:
          "Click on the 'Send Back SR/Edit Setup Information' hyperlink to send back the SR to the Trainee or to edit the setup information.",
        side: "left",
        align: "start",
      },
    },
    {
      element: "#sb-essential-header",
      popover: {
        title: "Performance Objectives",
        description:
          "Below the setup information you can see the Essential and Technical Performance Objectives. Highlighted sections indicate outcomes not yet rated and signed off.",
        side: "bottom",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
