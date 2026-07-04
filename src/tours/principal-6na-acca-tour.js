import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "principal-6na-acca-tour";

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
        title: "Step 3: Principal Review ACCA Audit Units",
        description:
          "As the Principal, you can update the Time Summary, review the Overall Statement of Achievement, update the Principal Review and Comments, and then click Signoff Six Monthly Needs Analysis.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#pr-time-summary",
      popover: {
        title: "Time Summary",
        description:
          "The Principal can update the Period Start and End Dates, Number of Clients, Hours, Other Work Hours, Client Sectors, and Client Size. Click Reload values from SRs to refresh values.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#pr-client-sectors",
      popover: {
        title: "Client Sectors",
        description:
          "Review and update the Client Sectors related to the work performed during this period.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#pr-client-size",
      popover: {
        title: "Client Size",
        description:
          "Review and update the Client Size classification.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#pr-unit-section",
      popover: {
        title: "Unit AQ1 — Audit Process",
        description:
          "Review the audit unit details including Client Description, Elements, date, and Statement.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#pr-overall-statement",
      popover: {
        title: "Overall Statement of Achievement",
        description:
          "Review the Overall Statement of Achievement. ACCA can only consider client-specific examples where the member has worked or been personally involved.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#pr-principal-review",
      popover: {
        title: "Principal Review",
        description:
          "Update the Principal Review including summary of work performance, evaluation against previous targets, future development needs, performance targets, and Principal comments.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#pr-declaration",
      popover: {
        title: "Declaration",
        description:
          "Read the declaration carefully. By signing off, you confirm agreement with the summary of work performance and targets.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#pr-signoff-6na-btn",
      popover: {
        title: "Signoff Six Monthly Needs Analysis",
        description:
          "Click Signoff Six Monthly Needs Analysis to proceed to the sign-off page.",
        side: "top",
        align: "center",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
