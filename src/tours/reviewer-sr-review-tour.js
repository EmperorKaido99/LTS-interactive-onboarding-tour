import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "reviewer-sr-review-tour";

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
        title: "Step 2: Review Skills",
        description:
          "Review the Trainee's Essential and Technical Performance Objectives. You can update ratings, rate unrated skills, and add comments.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#rv-actions-bar",
      popover: {
        title: "Edit / Send Back",
        description:
          "As a Reviewer or Supervisor, you can Edit the Skill Review setup or Send the Skill Review back to the Trainee for amendments.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#rv-outcome-table",
      popover: {
        title: "Outcome Topics",
        description:
          "Click on the outcome hyperlink to open skills related to the outcome. A tick mark under L indicates skills rated by the Trainee. Click on the outcome to view related competencies.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#rv-outcome-1",
      popover: {
        title: "1. Review Essential Performance Objectives",
        description:
          "The Reviewer or Supervisor reviews the Trainee's Essential Performance Objectives. You can update the Trainee's rating and rate skills NOT rated by the Trainee. Different ratings will lead to the rating differences stage.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#rv-reviewer-rating-col",
      popover: {
        title: "2. Update Rating",
        description:
          "Select your rating for each competency. You can update the Trainee's rating or rate skills the Trainee has not rated. Rating differences will be flagged for resolution.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#rv-comment-col",
      popover: {
        title: "3. Add Comments",
        description:
          "Add your Reviewer or Supervisor comments for each competency. You can see the Trainee's evidence presented in support of their rating.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#rv-submit-btn",
      popover: {
        title: "4. Submit Essential Ratings",
        description:
          "Click Submit to save your changes for the Essential Performance Objectives.",
        side: "top",
        align: "end",
      },
    },
    {
      element: "#rv-technical-header",
      popover: {
        title: "Review Technical Performance Objectives",
        description:
          "Now review the Trainee's Technical Performance Objectives. The process is the same: you can update the Trainee's rating, rate unrated skills, add comments, and click Submit to save.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#rv-doc-complete-btn",
      popover: {
        title: "Document Complete",
        description:
          "Once all skills have been reviewed, click Document Complete to proceed. A tick mark under L and S indicates that skills have been rated and reviewed by both the Trainee and the Reviewer or Supervisor.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#rv-finish-btn",
      popover: {
        title: "Finish",
        description:
          "Click Finish to navigate to the ACCA Audit Units page. You can also use the Print hyperlink to view a detailed Skill Review report.",
        side: "top",
        align: "end",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
