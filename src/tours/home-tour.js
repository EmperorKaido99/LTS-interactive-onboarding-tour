import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "home-tour";

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
        title: "Trainee Home Page",
        description:
          "Welcome, you are now on your LTS trainee home page. You will notice you have a quick access menu bar on your left of the screen and workspace on the right of the screen.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#home-news",
      popover: {
        title: "NEWS Section",
        description:
          "The NEWS section shows the latest updates on document deadlines and other information related to your programme.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#home-days-since",
      popover: {
        title: "DAYS SINCE LAST",
        description:
          "This section indicates the last day a document on LTS was created, worked on, and finalized. It tracks both SR (Skill Review) and 6NA documents. View when your SR and 6NA documents were last Initiated, Worked On (In Progress), and Finalised.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#home-open-items",
      popover: {
        title: "OPEN ITEMS",
        description:
          "This shows any SR's or 6NA's currently open and in progress.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#home-skills-section",
      popover: {
        title: "SKILL REVIEWS / 6NA'S / STATUS REPORT",
        description:
          "This section gives you access to initiate new documents and view reports. Use the hyperlinks below to navigate.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#link-skill-review",
      popover: {
        title: "Link to Skill Review",
        description:
          'Click "Link to Skill Review" to start a new Skill Review.',
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#link-6na",
      popover: {
        title: "Link to 6NA's",
        description:
          'Click "Link to 6NA\'s" to start a new Six-Monthly Needs Analysis.',
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#link-status-report",
      popover: {
        title: "Status Report",
        description:
          "Click here to view your Status Reports.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#link-last-6na",
      popover: {
        title: "Last 6NA",
        description:
          "Click here to view detail reports of the last finalized 6NA.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#home-help-section",
      popover: {
        title: "Additional Help & Training Guides",
        description:
          "This section provides access to additional help and training guides. Click the link to view LTS training material. You can also see upcoming birthdays for the next 7 days.",
        side: "top",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
