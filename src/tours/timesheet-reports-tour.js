import { driver } from "../../node_modules/driver.js/dist/driver.js.mjs";
import { narrate, stopNarration } from "../shared/narrate.js";

const TOUR_NAME = "timesheet-reports-tour";

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
        title: "Closed Timesheets & Reports",
        description:
          "On this page you can view all completed timesheets and generate detailed timesheet reports for any period.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#ts-closed-list",
      popover: {
        title: "Closed Timesheets List",
        description:
          "Under CLOSED TIMESHEETS you see the list of all completed timesheets, each showing who signed it off and when.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#ts-period-link",
      popover: {
        title: "Detailed Timesheet Report",
        description:
          "Click on the <strong>period hyperlink</strong> of the relevant timesheet to view the detailed timesheet report \u2014 including comments and Total Core, Attendance and Accumulated Hours. It can be downloaded as a PDF.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#ts-summary-link",
      popover: {
        title: "Timesheet User Summary Report",
        description:
          "Click on the <strong>Timesheet User Summary Report</strong> hyperlink to open the summary report form.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#ts-report-form",
      popover: {
        title: "Generate the Summary Report",
        description:
          "Select the Start Date and End Date, choose the Report Type (Type or Activity), and click <strong>Generate Report</strong>. Then click <strong>Click here to download</strong> to export it to Excel \u2014 the first sheet summarises all firms, with totals per firm on the following sheets.",
        side: "top",
        align: "center",
      },
    },
    {
      element: "#ts-total-form",
      popover: {
        title: "Timesheet User Total Report",
        description:
          "The <strong>Timesheet User Total Report</strong> works the same way and displays total hours per Activity Type for the selected period \u2014 including Core and Attendance hours per activity.",
        side: "top",
        align: "center",
      },
    },
  ],
});

window.addEventListener("load", () => {
  setTimeout(() => tourDriver.drive(), 500);
});
