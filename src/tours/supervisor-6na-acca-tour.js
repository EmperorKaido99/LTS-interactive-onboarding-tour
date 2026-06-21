import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "supervisor-6na-acca-tour";

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
        title: "Step 5: Review ACCA Audit Units",
        description:
          "As the Authorised Supervisor, review the ACCA Audit Units page. You can update values, review the Trainee's statement of achievement, and add your Authorised Supervisor comment before signing off.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#as-time-summary",
      popover: {
        title: "Time Summary",
        description:
          "Review and update the Period Start and End Dates, Number of Clients on High-risk and Low-risk work, Hours, and Other Work Hours. You can click Reload values from SRs to refresh values from the linked Skill Reviews.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#as-client-sectors",
      popover: {
        title: "Client Sectors",
        description:
          "Review and update the Client Sectors related to the work performed during this period.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#as-client-size",
      popover: {
        title: "Client Size",
        description:
          "Review and update the Client Size classification. Hover over the information icon for more details about size classifications.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#as-unit-section",
      popover: {
        title: "Audit Unit Details",
        description:
          "Review the audit unit, elements, date of achievement, and the Trainee's statement of achievement. Verify that the information is accurate and complete.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#as-overall-statement",
      popover: {
        title: "Overall Statement of Achievement",
        description:
          "Review the Trainee's Overall Statement of Achievement. ACCA can only consider client-specific examples where the member has worked or been personally involved.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#as-principal-review",
      popover: {
        title: "Principal Review",
        description:
          "Review and update the Principal Review section. This includes a summary of work performance, evaluation against previous targets, future development needs, and performance targets for the next period.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#as-supervisor-comment",
      popover: {
        title: "Authorised Supervisor Comment",
        description:
          "Add your Authorised Supervisor comment. This is your assessment and feedback for the Trainee's development during this review period.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#as-signoff-btn",
      popover: {
        title: "Sign Off Six Monthly Needs Analysis",
        description:
          "Once everything has been reviewed and updated, click SignOff Six Monthly Needs Analysis to proceed to the sign-off declaration page.",
        side: "top",
        align: "center",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
