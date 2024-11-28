/*
 * Student Name: Antonio Felipe Souza Vieira
 * Student ID: 041-176-405
 * Course: CST8209 - Web Programming I
 * Semester: 1
 * Assignment: 4 – Calendar of Events – Part 4 
 * Date Submitted: November 28th, 2024
 */

// Declare a Calendar object
function Calendar(elem) {
  // jQuery element to display the calendar
  this.elem = $(elem);

  // Array of day names for the calendar header
  this.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  /**
   * Get the name of the month based on a zero-based index.
   * @param {number} monthIndex - Index of the month (0 = January, 11 = December)
   * @returns {string} Name of the month
   */
  this.getMonth = function (monthIndex) {
    const months = [
      "January", "February", "March", "April", "May",
      "June", "July", "August", "September", "October",
      "November", "December"
    ];
    return months[monthIndex] || "Unknown";
  };

  /**
   * Get the number of days in a specific month of a given year.
   * @param {number} monthIndex - Zero-based month index
   * @param {number} year - Year to check
   * @returns {number} Number of days in the month
   */
  this.getDaysInMonth = function (monthIndex, year) {
    if (typeof monthIndex !== "number" || monthIndex < 0 || monthIndex > 11 || typeof year !== "number") {
      return -1;
    }

    const isLeapYear = (year) => (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
    const days = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return days[monthIndex];
  };

  /**
   * Display the calendar for a specific date.
   * @param {Date} displayDate - Date to display (defaults to today)
   */
  this.display = function (displayDate = new Date()) {
    // Clear the calendar container
    this.elem.empty();

    // Get the number of days in the current month
    const daysInMonth = this.getDaysInMonth(displayDate.getMonth(), displayDate.getFullYear());
    const days = Array.from({ length: daysInMonth }, (_, i) =>
      new Date(displayDate.getFullYear(), displayDate.getMonth(), i + 1)
    );

    // Create the calendar table
    const table = $("<table class='table table-bordered'></table>");
    const thead = $("<thead></thead>");
    const tbody = $("<tbody></tbody>");

    // Header row with navigation buttons
    const headerRow = $("<tr></tr>");

    // Previous month button
    $("<td></td>")
      .append(
        $("<button class='btn btn-secondary'></button>")
          .text("<<")
          .on("click", () => {
            const prevMonthDate = new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1);
            this.display(prevMonthDate);
          })
      )
      .appendTo(headerRow);

    // Month and year display
    $("<td></td>")
      .attr("colspan", 5)
      .append(
        $("<h5></h5>").text(`${this.getMonth(displayDate.getMonth())} ${displayDate.getFullYear()}`)
      )
      .appendTo(headerRow);

    // Next month button
    $("<td></td>")
      .append(
        $("<button class='btn btn-secondary'></button>")
          .text(">>")
          .on("click", () => {
            const nextMonthDate = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1);
            this.display(nextMonthDate);
          })
      )
      .appendTo(headerRow);

    thead.append(headerRow);

    // Row for day names
    const dayNamesRow = $("<tr></tr>");
    this.dayNames.forEach((dayName) =>
      $("<th class='text-center'></th>").text(dayName).appendTo(dayNamesRow)
    );
    thead.append(dayNamesRow);

    table.append(thead);

    // Generate the calendar days
    let weekRow = $("<tr></tr>");

    // Empty cells before the first day of the month
    for (let i = 0; i < days[0].getDay(); i++) {
      $("<td></td>").appendTo(weekRow);
    }

    // Fill in the days of the month
    days.forEach((currentDay, i) => {
      if (currentDay.getDay() === 0 && i !== 0) {
        tbody.append(weekRow);
        weekRow = $("<tr></tr>");
      }

      const dayCell = $("<td></td>")
        .addClass("day text-center")
        .text(currentDay.getDate());

      // Highlight today's date
      const today = new Date();
      if (
        currentDay.getDate() === today.getDate() &&
        currentDay.getMonth() === today.getMonth() &&
        currentDay.getFullYear() === today.getFullYear()
      ) {
        dayCell.addClass("bg-success text-white");
      }

      // Highlight weekends
      if (currentDay.getDay() === 0 || currentDay.getDay() === 6) {
        dayCell.addClass("bg-light text-muted");
      }

      weekRow.append(dayCell);
    });

    // Empty cells after the last day of the month
    for (let i = days[days.length - 1].getDay() + 1; i < 7; i++) {
      $("<td></td>").appendTo(weekRow);
    }

    tbody.append(weekRow);
    table.append(tbody);

    // Append the table to the calendar container
    this.elem.append(table);
  };
}

// Create an instance of Calendar
const cal = new Calendar("#calendar");
cal.display();

// Global variable to store events
var events = [];

$(document).ready(function () {
  // Helper function to validate dates
  function isValidDate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);

    if (!year || !month || !day) return false;

    // Check if the date is valid
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }

  // Initialize the datepicker
  $("#event-date").datepicker({
    dateFormat: "yy-mm-dd",
    onSelect: function () {
      removeErrorMessage($(this));
      updateProgress();
    },
  });

  // Add error message dynamically
  const addErrorMessage = (field, message) => {
    if (!field.next(".error-message").length) {
      field.after(`<span class="error-message" style="color: red; font-size: 0.9em;">${message}</span>`);
    }
  };

  // Remove error message
  const removeErrorMessage = (field) => {
    field.next(".error-message").remove();
  };

  // Update the progress bar
  const updateProgress = () => {
    const formFields = $("#event-form input, #event-form textarea");
    const progressBar = $("#form-progress");
    const filledFields = formFields.filter(function () {
      return $(this).val().trim() !== "";
    }).length;

    const progress = (filledFields / formFields.length) * 100;
    progressBar.css("width", `${progress}%`).attr("aria-valuenow", progress);
  };

  $("#event-form input, #event-form textarea").on("input", updateProgress);

  // Handle form submission
  $("#event-form").on("submit", function (e) {
    e.preventDefault();

    const eventDate = $("#event-date").val();
    const eventTitle = $("#event-title").val().trim();

    // Validation: Title must have at least 3 characters
    if (!eventTitle || eventTitle.length < 3) {
      addErrorMessage($("#event-title"), "The event title must have at least 3 characters.");
      return;
    } else {
      removeErrorMessage($("#event-title"));
    }

    // Validation: Date must be valid
    if (!eventDate || !isValidDate(eventDate)) {
      addErrorMessage($("#event-date"), "The event date is invalid.");
      return;
    } else {
      removeErrorMessage($("#event-date"));
    }

    events.push({ eventDate, eventTitle });
    $("#event-count").text(events.length);
    $("#event-form")[0].reset();
    updateProgress();
    cal.display();
  });
});
