import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "help-tour";

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
      element: "#help-contact",
      popover: {
        title: "Need Help?",
        description:
          "If you need assistance, contact LTS Support at Support@LTSystems.co.za, or view training material and FAQ under Documents on the LTS Home page.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#help-email",
      popover: {
        title: "Support Email",
        description:
          "Email the LTS support team at Support@LTSystems.co.za for any assistance.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#acca-docs",
      popover: {
        title: "ACCA Training Programme",
        description:
          "This section contains ACCA-related documents including qualification guides, programme handbooks, RPL policies, and PCEF forms.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#training-docs",
      popover: {
        title: "LTS Training Material and FAQ",
        description:
          "Here you will find all LTS training slides covering Skill Reviews, 6NA processes, and system guides. Download these for reference.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#training-docs-list",
      popover: {
        title: "Training Slides",
        description:
          "Browse and download training slides 1 through 8, covering everything from logging in to finalizing a 6NA assessment.",
        side: "top",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
