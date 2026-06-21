import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "principal-6na-review-tour";

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
        title: "Step 2: Review Closed 6NA",
        description:
          "Review the closed Six Monthly Needs Analysis. The Principal reviews Section 1 Summary of Performance Evaluations, Self-Evaluation, Record of Supplementary Training, and Conclusion. Note: The Principal cannot edit any of the sections on this page.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#pr-6na-info",
      popover: {
        title: "6NA Information",
        description:
          "Review the 6NA details including Trainee name, Authorised Supervisor, review period, and sign-off dates.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#pr-send-back",
      popover: {
        title: "Send Back to Authorised Supervisor",
        description:
          "If amendments are required, click this hyperlink to reverse the 6NA back to Stage 2 with the Authorised Supervisor.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#pr-section-links",
      popover: {
        title: "Section Links",
        description:
          "Review the Summary of Performance Evaluations, Self-Evaluation, Record of Supplementary Training, and Conclusion. Note: Principal cannot edit any of these sections.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#pr-continue-btn",
      popover: {
        title: "Continue",
        description:
          "Click Continue to proceed to the Performance Evaluations view where you can review and update ratings.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#pr-perf-eval-panel",
      popover: {
        title: "Items to Be Signed Off by the Principal",
        description:
          "The tick under AS indicates competencies the Authorised Supervisor marked as Ready for final sign off. Click on a Topic Hyperlink to open the Extended View to review and update the ANA.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#pr-extended-view",
      popover: {
        title: "Extended View — Review and Update",
        description:
          "In the Extended View, the Principal can: update ratings, mark competencies as Ready for Final Sign Off, add comments, decide on the Overall Rating (change from Not Yet Competent to Competent), and add a Principal Sign Off Comment.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#pr-rating-col",
      popover: {
        title: "Rating",
        description:
          "The Principal can update the 6NA rating if necessary.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#pr-ready-signoff-col",
      popover: {
        title: "Ready for Final Sign Off",
        description:
          "The Principal can mark a competency as Ready for Final Sign Off if the Authorised Supervisor missed it.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#pr-as-comment-col",
      popover: {
        title: "Principal / Authorised Supervisor Comment",
        description:
          "The Principal can add comments if relevant in the Principal / Authorised Supervisor comment text box.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#pr-overall-rating-col",
      popover: {
        title: "Overall Rating",
        description:
          "Where relevant, the Principal should decide if the Overall Rating should change from Not Yet Competent to Competent.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#pr-signoff-comment-col",
      popover: {
        title: "Principal Sign Off Comment",
        description:
          "The Principal can give a Principal Sign Off Comment for competencies marked as Ready for Final Sign Off.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#pr-submit-btn",
      popover: {
        title: "Submit",
        description:
          "Click Submit to save your changes and proceed.",
        side: "top",
        align: "center",
      },
    },
    {
      element: "#pr-continue-acca-btn",
      popover: {
        title: "Continue to ACCA Audit Units",
        description:
          "Once all competencies have been reviewed, click Continue to navigate to the ACCA Audit Units page.",
        side: "top",
        align: "center",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
