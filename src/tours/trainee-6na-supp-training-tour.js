import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "trainee-6na-supp-training-tour";

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
        title: "Step 4: Record of Supplementary Training",
        description:
          "Update Section 2: Record of Supplementary Training. Capture all courses attended during the preceding six-month period.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#na-supp-training-link",
      popover: {
        title: "Section 2: Record of Supplementary Training",
        description:
          "Click on the hyperlink Section 2: Record of Supplementary Training to open the training record form.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#na-training-course",
      popover: {
        title: "Training Course",
        description:
          "Enter the Training Course name. For example, Advance Excel.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#na-learning-objectives",
      popover: {
        title: "Learning Objectives",
        description:
          "Capture the Learning Objectives for the course attended.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#na-transfer-examples",
      popover: {
        title: "Examples Of Transfer",
        description:
          "Select Examples of Transfer to indicate whether the learning was transferred to the workplace.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#na-result",
      popover: {
        title: "Result",
        description:
          "Select the Result of the training. Options include In Progress, Completed, or Not Applicable.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#na-add-course-btn",
      popover: {
        title: "Add Course",
        description:
          "Click Add to save the course information and create a new entry. You can add multiple courses.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#na-evaluator-comment",
      popover: {
        title: "Evaluator Comment",
        description:
          "The Evaluator can add a comment on the transfer of learning. The Trainee can also add comments on the action decided on the transfer learning.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#na-update-btn",
      popover: {
        title: "Update",
        description:
          "Click Update to save all changes to the Record of Supplementary Training.",
        side: "top",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
