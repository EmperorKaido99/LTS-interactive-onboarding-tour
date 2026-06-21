import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "principal-6na-home-tour";

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
  },
  steps: [
    {
      popover: {
        title: "Step 2: Principal Review Six Monthly Needs Analysis",
        description:
          "As the Principal, you will review the 6NA in respect of the overall ratings and the integrity of the assessment process. Click on the assigned 6NA hyperlink to begin.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#pr-6na-link",
      popover: {
        title: "Assigned 6NA",
        description:
          "Click on the assigned 6NA hyperlink to review the ANA. You can also use Print to display the detail report, Ext ScoreGrid to view ratings, and Reverse To Not Competent to reverse a signed off competency.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#pr-prepare-info",
      popover: {
        title: "Prepare for ANA Review",
        description:
          "Before reviewing, familiarise yourself with the available reports: Score Grid, Extended Score Grid, ACCA Time Summary Report, and ACCA Principal Review Extract.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#pr-report-links",
      popover: {
        title: "Report Links",
        description:
          "Access the Six Monthly Needs Analysis Score Grid, Extended Score Grid, ACCA Time Summary Report, and ACCA Principal Review Extract Report from these links.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#pr-signoff-btn",
      popover: {
        title: "Sign Off",
        description:
          "Click Sign Off to proceed with reviewing and signing off the Six Monthly Needs Analysis.",
        side: "top",
        align: "center",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
