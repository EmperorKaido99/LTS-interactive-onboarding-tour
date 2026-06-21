import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "trainee-s3-signoff-tour";

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
        title: "Step 4: Trainee Sign Off Six Monthly Needs Analysis",
        description:
          "This is the final step. Review the ACCA Audit Unit details and Principal Review, then sign off the Six Monthly Needs Analysis.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#s3-unit-section",
      popover: {
        title: "UNIT AQ1 — Audit Process",
        description:
          "Review the audit unit details including the Client Description, Elements, date, and your Statement. Verify that the information is accurate.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#s3-overall-statement",
      popover: {
        title: "Overall Statement of Achievement",
        description:
          "Review the Overall Statement of Achievement. ACCA can only consider client-specific examples where the member has worked or been personally involved.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#s3-principal-review",
      popover: {
        title: "Principal Review",
        description:
          "Review the Principal Review section including summary of work performance, evaluation against previous targets, future development needs, and performance targets for the next period.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#s3-signoff-nav-btn",
      popover: {
        title: "Signoff Six Monthly Needs Analysis",
        description:
          "Once you have reviewed everything and all is in order, click Signoff Six Monthly Needs Analysis to proceed to the sign-off declaration.",
        side: "top",
        align: "center",
      },
    },
    {
      element: "#s3-signoff-notice",
      popover: {
        title: "Sign Off Declaration",
        description:
          "This sign off indicates that both the Trainee and the Authorised Supervisor, after having met and discussed this 6NA, agree with the contents of this document.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#s3-signoff-btn",
      popover: {
        title: "Sign Off",
        description:
          "Click Sign Off to finalise and complete Stage 3 of the Six Monthly Needs Analysis. The 6NA will then move to the Principal for the final quality check.",
        side: "top",
        align: "center",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
