import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "trainee-sr-home-tour";

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
        title: "Step 2: Trainee Initiate a Skill Review",
        description:
          "Welcome to the LTS Home Page. From here you will initiate a Skill Review by clicking on the 'Link to Skill Review' hyperlink. Let's walk through the key sections on this page first.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#sr-news",
      popover: {
        title: "NEWS Section",
        description:
          "Update the news to inform trainees about the documents' deadlines.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#sr-days-since",
      popover: {
        title: "DAYS SINCE LAST",
        description:
          "This section indicates the last day a document on LTS was created, worked on and finalized.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#sr-open-items",
      popover: {
        title: "OPEN ITEMS",
        description:
          "Open documents will be listed under OPEN ITEMS. Any SR's or 6NA's currently in progress will appear here.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#sr-link-skill-review",
      popover: {
        title: "Link to Skill Review",
        description:
          "Click on the hyperlink 'Link to Skill Review' to initiate a skill review. This will take you to the Skill Review setup page.",
        side: "bottom",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
