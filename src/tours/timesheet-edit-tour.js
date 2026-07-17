import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "timesheet-edit-tour";

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
        title: "Edit the Timesheet",
        description:
          "Clicking <strong>Edit this Timesheet</strong> opens the TIMESHEET CHANGE window, where you can update the timesheet period or the Reviewer/Supervisor/Manager.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#ts-change-date",
      popover: {
        title: "Update the Date",
        description:
          "Update the <strong>Date</strong> to correct the timesheet period \u2014 select any date during the relevant week.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#ts-change-reviewer",
      popover: {
        title: "Update the Reviewer",
        description:
          "Update the <strong>Reviewer/Supervisor/Manager</strong> if you selected the wrong person.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#ts-change-comment",
      popover: {
        title: "Add a Comment",
        description:
          "Add a <strong>Comment</strong> \u2014 a comment is required for any update.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#ts-change-save",
      popover: {
        title: "Save the Changes",
        description:
          "Click on <strong>Save</strong> to save the changes. Note: the timesheet will be updated permanently.",
        side: "top",
        align: "center",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
