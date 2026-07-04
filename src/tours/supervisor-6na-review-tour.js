import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "supervisor-6na-review-tour";

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
        title: "Step 3: Review 6NA",
        description:
          "As the Authorised Supervisor, you will now review the 6NA. This includes reviewing the Trainee's self-evaluation, supplementary training, updating the Summary of Performance Evaluations, and completing the Conclusion.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#as-6na-info",
      popover: {
        title: "6NA Information",
        description:
          "Review the 6NA details including the Trainee name, review period, and current status. You can also edit user information or the 6NA details by clicking the edit link.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#as-section1-link",
      popover: {
        title: "Section 1: Summary of Performance Evaluations",
        description:
          "Click on Section 1: Summary of Performance Evaluations to review and update the overall rating level achieved by the Trainee to date. The indicators show what needs to be done and by whom.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#as-srs-included",
      popover: {
        title: "Skill Reviews Included",
        description:
          "You can link or delink Skill Reviews to this 6NA. Linked Skill Reviews will be included in the assessment. Click the Hyperlink Link or Delink button to manage the SRs.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#as-perf-eval-panel",
      popover: {
        title: "Items to Rate",
        description:
          "Click on each Topic to open all competencies linked to that topic. Tick marks indicate competencies that were rated in the Skill Review. Review each performance objective area.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#as-extended-view",
      popover: {
        title: "Extended View — Rate Competencies",
        description:
          "In the Extended View, you can mark competencies as Ready for Final Sign Off, mark Development Required if major intervention is needed, mark competencies for Discussion, and add your Authorised Supervisor Comment.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#as-ready-signoff-col",
      popover: {
        title: "Ready for Final Sign Off",
        description:
          "Mark competencies as Ready for Final Sign Off if the Trainee has met the expected level and needs to be signed off.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#as-dev-required-col",
      popover: {
        title: "Development Required",
        description:
          "Mark Development Required only when major intervention is needed, or if the Trainee performs below the expected level. This flags areas needing attention.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#as-marked-discussion-col",
      popover: {
        title: "Marked for Discussion",
        description:
          "Mark specific competencies that should be discussed during the one-on-one meeting with the Trainee.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#as-comment-col",
      popover: {
        title: "Authorised Supervisor Comment",
        description:
          "Add your comments or supporting notes for specific competencies. These comments provide feedback to the Trainee.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#as-submit-btn",
      popover: {
        title: "Submit Ratings",
        description:
          "Click Submit to save your changes. You can also use Hide Unrated SRs to focus only on rated competencies.",
        side: "top",
        align: "center",
      },
    },
    {
      element: "#as-doc-complete-btn",
      popover: {
        title: "Document Complete",
        description:
          "Once all competencies have been reviewed and updated, click Document Complete to proceed.",
        side: "top",
        align: "center",
      },
    },
    {
      element: "#as-conclusion-panel",
      popover: {
        title: "Section 3 (1): Conclusion",
        description:
          "Click on the Conclusion section to update. This should be completed by the Authorised Supervisor with the input of the trainee accountant. Comment on the effectiveness of the previous period's developmental plan.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#as-conclusion-update-btn",
      popover: {
        title: "Update Conclusion",
        description:
          "Once done, click Update to save your conclusion comments and proceed.",
        side: "top",
        align: "end",
      },
    },
    {
      element: "#as-finish-btn",
      popover: {
        title: "Finish — Navigate to ACCA Audit Units",
        description:
          "Once all sections have been reviewed, click Finish to navigate to the ACCA Audit Units page.",
        side: "top",
        align: "center",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
