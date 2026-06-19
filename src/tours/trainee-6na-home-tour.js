import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "trainee-6na-home-tour";

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
        title: "Step 2: Setup 6NA",
        description:
          "Welcome to the LTS Home Page. From here you will initiate a Six Monthly Needs Analysis by clicking on the Link to 6NA's hyperlink.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#na-link-6na",
      popover: {
        title: "Link to 6NA's",
        description:
          "Click on the hyperlink Link to 6NA's to initiate a new Six Monthly Needs Analysis.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#na-setup-panel",
      popover: {
        title: "6NA Setup Page",
        description:
          "This is the 6NA setup page. You need to fill in the required details to create your 6NA.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#na-supervisor-select",
      popover: {
        title: "Authorised Supervisor",
        description:
          "Select your Authorised Supervisor from the dropdown list.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#na-principal-select",
      popover: {
        title: "Principal",
        description:
          "Select the Principal from the dropdown list.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#na-number",
      popover: {
        title: "6NA Number",
        description:
          "Update the ANA Number if required.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#na-review-period",
      popover: {
        title: "Review Period",
        description:
          "Set the 6NA Review Period Start Date and End Date.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#na-add-btn",
      popover: {
        title: "Add 6NA",
        description:
          "Click Add 6NA to save the setup information and create your Six Monthly Needs Analysis.",
        side: "top",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
