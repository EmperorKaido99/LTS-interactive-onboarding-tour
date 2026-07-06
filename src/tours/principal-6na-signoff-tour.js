import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "principal-6na-signoff-tour";

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
        title: "Step 4: Principal Finalise 6NA",
        description:
          "This is the final step. Add your Principal Comment and sign off the Six Monthly Needs Analysis to complete the process.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#pr-signoff-notice",
      popover: {
        title: "Sign Off Declaration",
        description:
          "This sign off indicates that both the Trainee and the Authorised Supervisor, after having met and discussed this 6NA, agree with the contents of this document.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#pr-review-declaration",
      popover: {
        title: "Principal Review Declaration",
        description:
          "This sign off indicates that the Principal reviewed and is in agreement with the integrity of ratings, overall competence assessment, adequacy of the developmental plan, and credibility of the assessment process.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#pr-comment-area",
      popover: {
        title: "Principal Comment",
        description:
          "Add your Principal comment on the trainee's overall rating. Principal comments will automatically appear here and can be updated.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#pr-signoff-btn",
      popover: {
        title: "Sign Off",
        description:
          "Click Sign Off to finalise the Six Monthly Needs Analysis. The 6NA will be completed and the Trainee will receive an email notification.",
        side: "top",
        align: "center",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
