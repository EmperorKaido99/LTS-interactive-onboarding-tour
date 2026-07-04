import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "trainee-sr-rate-tour";

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
        title: "Step 3: Rate Skill Review",
        description:
          "Now you will rate your skills, provide evidence, and add comments for both Essential and Technical Performance Objectives.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#sr-essential-header",
      popover: {
        title: "Essential Performance Objectives",
        description:
          "This section contains the Essential Performance Objectives. You will rate each competency under the relevant outcome topics.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#sr-outcome-1",
      popover: {
        title: "1. Click on Outcome Topic",
        description:
          "Click on the Outcome topic to view all the competencies linked to it. A tick mark under L indicates that the Trainee has done self-assessment on one or more competencies related to that outcome.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#sr-rating-select",
      popover: {
        title: "2. Select a Rating",
        description:
          "Click on the rating scale and select a rate for each competency. Options range from Not Yet Competent to Advanced.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#sr-evidence-input",
      popover: {
        title: "3. Capture Evidence",
        description:
          "Capture evidence presented in support of the rate. Provide specific details using the STAR method: describe the Situation, Task, Action, and Result. Answer what happened, when, and for whom.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#sr-submit-btn",
      popover: {
        title: "4. Submit",
        description:
          "Once relevant competencies have been rated, click on Submit to save your changes.",
        side: "top",
        align: "end",
      },
    },
    {
      element: "#sr-technical-header",
      popover: {
        title: "Technical Performance Objectives",
        description:
          "Now rate the Technical Performance Objectives. The process is the same: click on the Outcome topic to view competencies, select a rating, capture activities performed using the STAR method, and click Submit.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#sr-tech-table",
      popover: {
        title: "Technical Outcome Topics",
        description:
          "Click on each technical outcome topic such as Auditing and Assurance, Financial Accounting, Management Accounting, and Taxation to rate the related competencies.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#sr-doc-complete-btn",
      popover: {
        title: "Document Complete",
        description:
          "Once you have rated the competencies for this review period, click Document Complete to proceed. A tick mark under L indicates you have done self-assessment on one or more competencies related to that outcome.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#sr-finish-btn",
      popover: {
        title: "Finish",
        description:
          "Click Finish to open the ACCA Audit Units page. You can also use the Print hyperlink to view a detailed Skill Review report before proceeding.",
        side: "top",
        align: "end",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
