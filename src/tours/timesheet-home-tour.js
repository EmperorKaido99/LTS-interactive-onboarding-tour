import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "timesheet-home-tour";

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
        title: "Timesheet User Home",
        description:
          "Welcome to the Weekly Timesheets training module. After logging on to www.LTSystems.co.za as a Timesheet User, you land on the Timesheet User Home page.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#ts-open-timesheets",
      popover: {
        title: "Open Timesheets",
        description:
          "The OPEN TIMESHEETS section lists timesheets that are still in progress. Right now there are none \u2014 we are about to create one.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#ts-user-links",
      popover: {
        title: "Timesheet User Links",
        description:
          "The TIMESHEET USER LINKS section gives you quick access to create a new timesheet, open the Status Report, and view your Closed Timesheets.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#ts-create-link",
      popover: {
        title: "Create a Timesheet",
        description:
          "Click on the hyperlink <strong>Create a Timesheets</strong> to initiate a new weekly timesheet.",
        side: "bottom",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
