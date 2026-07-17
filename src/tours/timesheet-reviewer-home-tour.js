import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "timesheet-reviewer-home-tour";

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
        title: "Reviewer Home",
        description:
          "The Reviewer/Supervisor logs in to www.LTSystems.co.za and lands on the LTS Reviewer Home page.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#ts-rev-open-timesheets",
      popover: {
        title: "Open Timesheets",
        description:
          "The OPEN TIMESHEETS section lists the timesheets assigned to the reviewer for review and sign off.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#ts-rev-status",
      popover: {
        title: "Awaiting Reviewer SignOff",
        description:
          "The status 'Awaiting Reviewer SignOff' shows this timesheet is currently assigned to the reviewer. PRINT gives a view of the timesheet as currently updated.",
        side: "left",
        align: "start",
      },
    },
    {
      element: "#ts-rev-open-link",
      popover: {
        title: "Open the Timesheet",
        description:
          "Click on the assigned <strong>Timesheet hyperlink</strong> under OPEN TIMESHEETS to review and sign off.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#ts-rev-status-report",
      popover: {
        title: "Status Report",
        description:
          "The STATUS REPORT on the Reviewer/Supervisor's Home Page gives an overview of all documents and their statuses.",
        side: "left",
        align: "center",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
