import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "sendback-reset-tour";

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
        title: "Reset Skill Review",
        description:
          "On this page you can update the SR setup information or send the SR back to the Trainee to make all necessary changes.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#sb-client-desc",
      popover: {
        title: "Client Description",
        description:
          "Change the description of the client if it needs correcting.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#sb-job-dates",
      popover: {
        title: "Job Dates & Days Worked",
        description:
          "Update the Job Start Date, Job End Date and the Days Worked on the job. The calculated work days are shown for reference.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#sb-assignment-desc",
      popover: {
        title: "Assignment Description & Notes",
        description:
          "Update the Assignment Description and any Additional Notes for the Skill Review.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#sb-update-btn",
      popover: {
        title: "Update",
        description:
          "Click Update to save your changes to the setup information without sending the SR back.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#sb-sendback-btn",
      popover: {
        title: "Send Back to Trainee",
        description:
          "Click Send Back to Trainee if the Trainee needs to make the amendments themselves. You will be asked to add a comment for the Trainee on the next screen.",
        side: "top",
        align: "center",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
