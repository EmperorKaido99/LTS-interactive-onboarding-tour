import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "reviewer-rd-resolve-tour";
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
        title: "Resolve Rating Differences",
        description:
          "Resolve rating differences by reviewing each competency, updating your rating, and adding comments.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#rd-warning-header",
      popover: {
        title: "Rating Differences Warning",
        description:
          "The Rating Differences warning shows all competencies where the Trainee and Reviewer ratings differ.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#rd-note",
      popover: {
        title: "Important Note",
        description:
          "Important: If there are no ratings under Final in the blue column, the supervisor still needs to enter revised ratings before the Trainee can resolve the differences.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#rd-essential-table",
      popover: {
        title: "Essential Performance Objectives",
        description:
          "Click on each Essential Performance Objective competency hyperlink to open the rating difference detail page. The T and S columns show the Trainee and Supervisor ratings.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#rd-technical-table",
      popover: {
        title: "Technical Performance Objectives",
        description:
          "Review Technical Performance Objectives the same way. Click on each competency to open and resolve the rating difference.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#rd-trainee-evidence",
      popover: {
        title: "Trainee Evidence",
        description:
          "Review the Trainee's original rating and the evidence they presented in support of their self-assessment.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#rd-revised-rating",
      popover: {
        title: "Revised Rating",
        description:
          "As the Reviewer or Supervisor, update the revised rating for this competency. This will become the final rating.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#rd-comment",
      popover: {
        title: "Reviewer Comment",
        description:
          "A comment is required when there is a rating difference. Explain why you have assigned this revised rating.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#rd-accept-btn",
      popover: {
        title: "Accept",
        description:
          "Click Accept to assign the Skill Review back to the Trainee for their review of the rating differences.",
        side: "top",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
