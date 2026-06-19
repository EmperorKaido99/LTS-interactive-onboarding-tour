import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "trainee-rd-resolve-tour";
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
        title: "Trainee: Resolve Rating Differences",
        description:
          "Resolve rating differences by clicking on your assigned Skill Review, reviewing the Supervisor's revised ratings, and agreeing or disagreeing.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#rd-open-items",
      popover: {
        title: "1. Open Assigned Skill Review",
        description:
          "Click on the assigned Skill Review hyperlink marked 'With Trainee (Rating Diff)' to open the rating differences page.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#rd-differences-table",
      popover: {
        title: "2. Rating Differences Table",
        description:
          "The Rating Differences table shows the Trainee rating, Supervisor rating, and the Final revised rating for each competency with differences.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#rd-supervisor-comment",
      popover: {
        title: "3. Supervisor's Revised Rating",
        description:
          "Review the Supervisor's revised rating and their comment explaining the rating difference.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#rd-resolve-select",
      popover: {
        title: "4. Agree or Disagree",
        description:
          "Select 'Agree With Supervisor' or 'Disagree With Supervisor' for each competency. Meet with your Supervisor to discuss any disagreements.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#rd-trainee-comment",
      popover: {
        title: "5. Trainee Comment",
        description:
          "Add your comment explaining your position on the rating difference.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#rd-trainee-accept-btn",
      popover: {
        title: "6. Finalise",
        description:
          "Click Accept to finalise the Skill Review. Note: The skill review will be finalised even if you disagree with the Reviewer or Supervisor.",
        side: "top",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
