import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "principal-6na-reports-tour";

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
        title: "Reports on the Principal Home Page",
        description:
          "As the Principal, you can access various reports for each Trainee. Click on Signoff ANA's under the Learner's section to view reports for a specific Trainee.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#pr-report-nav",
      popover: {
        title: "Report Links",
        description:
          "Access the Six Monthly Needs Analysis Score Grid, Extended Score Grid, ACCA Time Summary Report, and ACCA Principal Review Extract Report.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#pr-time-summary-report",
      popover: {
        title: "ACCA Time Summary Report",
        description:
          "The ACCA Time Summary Report returns the High-risk audits and related assurance work and Low-risk assurance work hours for the Six Monthly Needs Analysis period. You can export to PDF.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#pr-principal-extract",
      popover: {
        title: "ACCA Principal Review Extract Report",
        description:
          "The ACCA Principal Review Extract Report returns the Principal Review data extract. Click Generate Report to create the report, which shows summary of work performance, evaluation of targets, development needs, and Principal comments.",
        side: "top",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
