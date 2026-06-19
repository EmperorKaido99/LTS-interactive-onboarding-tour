import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "trainee-6na-self-eval-tour";

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
        title: "Step 3: Self-Evaluation",
        description:
          "Update Section 2: Self-Evaluation. Complete your self-evaluation by capturing your major assignments and academic record.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#na-self-eval-link",
      popover: {
        title: "Section 2: Self-Evaluation",
        description:
          "Click on the hyperlink Section 2: Self-Evaluation to open the self-evaluation form.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#na-self-eval-panel",
      popover: {
        title: "Self-Evaluation Form",
        description:
          "This section is mainly concerned with self-evaluation by the Trainee. The Authorised Supervisor should review each section and provide input where necessary.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#na-major-assignment",
      popover: {
        title: "Major Assignment",
        description:
          "Capture your Major Assignment for the next six-month period. Describe the work you are scheduled to undertake.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#na-next-btn",
      popover: {
        title: "Next",
        description:
          "Click Next to proceed to the academic record section.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#na-academic-record",
      popover: {
        title: "Academic Record",
        description:
          "Capture your Academic record. Document the state of your academic progress during this six-month period.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#na-finish-btn",
      popover: {
        title: "Finish",
        description:
          "Click Finish to save your self-evaluation and proceed.",
        side: "top",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
