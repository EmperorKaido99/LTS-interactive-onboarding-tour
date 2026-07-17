import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "timesheet-setup-tour";

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
        title: "Setup a Timesheet",
        description:
          "On the CREATE A TIMESHEET page you choose the week you want to record time for and the Reviewer/Supervisor who will sign it off.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#ts-date-field",
      popover: {
        title: "Select the Week",
        description:
          "Select any date during the relevant week of the timesheet \u2014 LTS calculates the week's start and end dates automatically.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#ts-reviewer-field",
      popover: {
        title: "Select the Reviewer/Supervisor",
        description:
          "Select the relevant <strong>Reviewer/Supervisor</strong> from the drop-down list. This is the person your timesheet will be assigned to for sign off.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#ts-new-btn",
      popover: {
        title: "Save the Timesheet",
        description:
          "Click on the <strong>New Timesheet</strong> button to save your changes and open the weekly timesheet.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#ts-faq",
      popover: {
        title: "Reviewer Not on the List?",
        description:
          "If your Reviewer/Supervisor is not on the drop-down list, contact your office administrator to inform LTS Support (Support@LTSystems.co.za) with the reviewer's name, surname and email address.",
        side: "top",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
