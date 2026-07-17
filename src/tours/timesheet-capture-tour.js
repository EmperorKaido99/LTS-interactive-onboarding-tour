import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "timesheet-capture-tour";

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
        title: "Update the Weekly Timesheet",
        description:
          "This is the timesheet layout page. Here you capture the hours you worked per business unit/company, per activity, for each day of the week.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#ts-company-cell",
      popover: {
        title: "Select the Company",
        description:
          "Select the appropriate department/business unit under <strong>Company</strong>. Use the search function to quickly find the company.",
        side: "right",
        align: "start",
      },
    },
    {
      element: "#ts-type-cell",
      popover: {
        title: "Select the Type",
        description:
          "Select the relevant <strong>Type</strong> on the drop-down list.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#ts-activity-cell",
      popover: {
        title: "Select the Activity",
        description:
          "Select the relevant <strong>Activity</strong> on the drop-down list. Use the search function to quickly find the activity.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#ts-hours-cells",
      popover: {
        title: "Capture Hours",
        description:
          "Capture the <strong>hours worked per day</strong> in the respective company/activity \u2014 one column for each day of the week.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#ts-comments-cell",
      popover: {
        title: "Add a Comment",
        description:
          "In the <strong>Comments</strong> section, provide a brief description of the work done for the selected activity.",
        side: "left",
        align: "start",
      },
    },
    {
      element: "#ts-add-btn",
      popover: {
        title: "Save the Entry",
        description:
          "Click on <strong>Add</strong> to save the new entry. Always remember to click Add to save the line item before assigning the timesheet to the reviewer/supervisor.",
        side: "left",
        align: "center",
      },
    },
    {
      element: "#ts-del-btn",
      popover: {
        title: "Remove an Entry",
        description:
          "Click the <strong>Del</strong> button next to a timesheet entry to remove it.",
        side: "left",
        align: "center",
      },
    },
    {
      element: "#ts-update-btn",
      popover: {
        title: "Update Entries",
        description:
          "Modify hours or comments directly in the respective fields and click <strong>Update</strong> to save the changes.",
        side: "top",
        align: "center",
      },
    },
    {
      element: "#ts-totals",
      popover: {
        title: "Weekly Totals",
        description:
          "<strong>Total Core</strong> shows hours logged for core activities, <strong>Total Attendance</strong> the sum of all recorded hours, and <strong>Total Hours</strong> the complete weekly total.",
        side: "top",
        align: "center",
      },
    },
    {
      element: "#ts-edit-btn",
      popover: {
        title: "Edit this Timesheet",
        description:
          "Use <strong>Edit this Timesheet</strong> to correct the timesheet period or update the Reviewer/Manager if you selected the wrong one.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#ts-delete-btn",
      popover: {
        title: "Delete Timesheet",
        description:
          "Use <strong>Delete this Timesheet</strong> to remove a timesheet that is no longer relevant or was created in error.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#ts-request-signoff",
      popover: {
        title: "Request Sign Off",
        description:
          "Once everything is in order, click <strong>Request sign off for timesheet</strong> to assign the timesheet to the Reviewer/Supervisor. Note: this button only appears once hours have been captured.",
        side: "bottom",
        align: "start",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
