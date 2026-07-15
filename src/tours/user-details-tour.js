import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "user-details-tour";

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
      element: "#alert-banner",
      popover: {
        title: "Important Notice",
        description:
          "You are now on your user details page. Please ensure all your information is correct before proceeding.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#personal-info",
      popover: {
        title: "Step 1: Personal Information",
        description:
          "Update your personal details here. Please take note of the mandatory fields marked with red asterisks (*), these fields are compulsory.",
        side: "right",
        align: "start",
      },
    },
    {
      element: "#contact-info",
      popover: {
        title: "Step 1b: Contact Information",
        description:
          "Email 1 must be your work email address, it should be accurate and is compulsory. Note: Email 2 is optional and only required if you also want to receive LTS workflow notifications on an additional email address, other than your work email.",
        side: "right",
        align: "start",
      },
    },
    {
      element: "#training-info",
      popover: {
        title: "Step 1c: Training Programme Information",
        description:
          "The final section is your Training Programme Information. You need to ensure this is always accurate and as registered with your workplace and professional body.",
        side: "right",
        align: "start",
      },
    },
    {
      element: "#membership-row",
      popover: {
        title: "Step 1d: Membership Number",
        description:
          'Enter your membership number or trainee registration number. This field is compulsory and should be accurate. If you still wait for confirmation regarding your registered number, please enter "To be confirmed" and update this field as soon as you received the relevant information.',
        side: "right",
        align: "start",
      },
    },
    {
      element: "#contract-info",
      popover: {
        title: "Step 1e: Contract Information",
        description:
          "The next part is your training contract information. The elective or programme should be accurate as well as your training contract start and end dates and the training contract period. If this section needs to be updated, then your Training Officer or Programme Administrator should contact Support@LTSystems.co.za.",
        side: "right",
        align: "start",
      },
    },
    {
      element: "#note-area",
      popover: {
        title: "Step 2: Verify Information",
        description:
          "Please verify that all information is accurate and up to date.",
        side: "right",
        align: "start",
      },
    },
    {
      element: "#update-btn",
      popover: {
        title: "Step 3: Click Update",
        description:
          'Click the "Update" button to save all changes and move on to your LTS User Home Page.',
        side: "right",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
