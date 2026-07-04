import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "trainee-sr-acca-tour";

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
        title: "Step 4: Complete ACCA Audit Units",
        description:
          "Complete the ACCA Audit Units section before signing off your Skill Review. Select the appropriate audit type and fill in the required details.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#acca-audit-type",
      popover: {
        title: "1. Select Audit Type",
        description:
          "Select 'Not Applicable' if the skill review does not fall under High-risk audits or Low-risk assurance work. Select 'High-risk audits' if the work performed involves high-risk audits. Select 'Low-risk assurance' if it involves low-risk assurance work.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#acca-other-hours",
      popover: {
        title: "2. Other Work Hours",
        description:
          "Capture Other Work Hours: Hours not included in any Audit Class above. This may include non-chargeable time, time spent working in other areas such as research, payroll, tax, or insolvency.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#acca-high-risk-section",
      popover: {
        title: "High-Risk Audit Details",
        description:
          "If High-risk audits is selected, you must complete every section on this page before signing off. This includes Number of Clients, Audit Class hours, Client sectors, and Client Size.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#acca-num-clients",
      popover: {
        title: "a) Number of Clients",
        description:
          "Update the Number of Clients for this audit engagement.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#acca-audit-hours",
      popover: {
        title: "b) Audit Class Hours",
        description:
          "Update the Audit Class hours for the work performed.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#acca-client-sector",
      popover: {
        title: "d) Client Sector",
        description:
          "Select one or more Client sectors related to the work performed.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#acca-client-size",
      popover: {
        title: "e) Client Size",
        description:
          "Select the Client Size. This can also be classified by the firm. Hover over the information icon for more details.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#acca-elements-table",
      popover: {
        title: "Elements and Achievements",
        description:
          "Select one or more elements related to the work performed. Capture the Date of achievement and a Statement of achievement for each element selected.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#acca-signoff-btn",
      popover: {
        title: "3. Sign Off Skill Review",
        description:
          "Click on 'Sign Off Skill Review' to proceed to the sign-off declaration page.",
        side: "top",
        align: "end",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
