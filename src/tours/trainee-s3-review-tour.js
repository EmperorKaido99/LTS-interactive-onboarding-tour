import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "trainee-s3-review-tour";

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
        title: "Step 2: Trainee Review Six Monthly Needs Analysis",
        description:
          "Review the Six Monthly Needs Analysis and check if all sections are updated as discussed with the Authorised Supervisor. You can view ratings, comments, and competencies but cannot update Authorised Supervisor comments.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#s3-6na-info",
      popover: {
        title: "6NA Information",
        description:
          "Review the 6NA details including the Trainee name, Authorised Supervisor, review period, and sign-off dates. The status shows With Trainee: Awaiting Trainee Sign-Off.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#s3-section-links",
      popover: {
        title: "Section Links",
        description:
          "Click on each section to review the content. The coloured indicators show the completion status. Click on Summary of Performance Evaluations, Self-Evaluation, and Conclusion to review the Authorised Supervisor's updates.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#s3-validate-panel",
      popover: {
        title: "Validate — Review Ratings",
        description:
          "Click on Validate to view the validation report with ratings and Authorised Supervisor comments, and competencies that are marked as Ready for final sign off. Tick marks indicate that competencies related to the outcomes have been rated.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#s3-self-eval-panel",
      popover: {
        title: "Section 2: Self-Evaluation",
        description:
          "Click on Self-Evaluation to view Authorised Supervisor Comments. Read the comments on major assignments and academic record. Please note: Authorised Supervisor comments cannot be updated.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#s3-conclusion-panel",
      popover: {
        title: "Section 3 (1): Conclusion",
        description:
          "Click on Conclusion to review the Authorised Supervisor's comments on the effectiveness of the developmental plan, technical skills, and professional skills. Please note: Authorised Supervisor comments cannot be updated.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#s3-finish-btn",
      popover: {
        title: "Finish — Navigate to ACCA Audit Units",
        description:
          "Once you have reviewed all sections, click Finish to navigate to the ACCA Audit Units page.",
        side: "top",
        align: "center",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
