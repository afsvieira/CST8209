/*
 * Student Name: Antonio Felipe Souza Vieira
 * Student ID: 041-176-405
 * Course: CST8209 - Web Programming I
 * Semester: 1
 * Assignment: 3 – Calendar of Events – Part 3 
 * Date Submitted: November 21th, 2024
 */

// declare an object Calendar
function Calendar(elem) {

  // jQuery element in which to display the calendar
  this.elem = $(elem);

  // array containing list of names of the days of the week 
  this.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  /** Returns the month name of the year for a given month index.
   * @param monthIndex {number} zero-based index of the month of the year (0 = January, 11 = December)
   * @returns {string} the name of the given month
   */
  this.getMonth = function(monthIndex) { 
    const months = [
      "January", "February", "March", "April", "May", 
      "June", "July", "August", "September", "October", 
      "November", "December"
    ];
    return months[monthIndex] || "Unknown";
  }

  /** Returns the number of days in the month for a given zero-based month index and year. */
  this.getDaysInMonth = function(monthIndex, year) {
    if (typeof monthIndex !== 'number' || monthIndex < 0 || monthIndex > 11 || typeof year !== 'number') {
      return -1;
    }

    const isLeapYear = (year) => (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));

    const days = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return days[monthIndex];
  }

  this.display = function(displayDate = new Date()) {
    // Clear existing content
    this.elem.empty();

    const daysInMonth = this.getDaysInMonth(displayDate.getMonth(), displayDate.getFullYear());

    const days = Array.from({ length: daysInMonth }, (_, i) =>
      new Date(displayDate.getFullYear(), displayDate.getMonth(), i + 1)
    );

    // Create the calendar structure
    const table = $("<table></table>");
    const thead = $("<thead></thead>");
    const tbody = $("<tbody></tbody>");

    // Create header row
    const headerRow = $("<tr></tr>");

    // Previous Month button
    $("<td></td>")
      .append(
        $("<button></button>")
          .text("<<")
          .on("click", () => {
            const prevMonthDate = new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1);
            this.display(prevMonthDate);
          })
      )
      .appendTo(headerRow);

    // Month and Year display
    $("<td></td>")
      .attr("colspan", 5)
      .append(
        $("<h1></h1>").text(`${this.getMonth(displayDate.getMonth())} ${displayDate.getFullYear()}`)
      )
      .appendTo(headerRow);

    // Next Month button
    $("<td></td>")
      .append(
        $("<button></button>")
          .text(">>")
          .on("click", () => {
            const nextMonthDate = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1);
            this.display(nextMonthDate);
          })
      )
      .appendTo(headerRow);

    thead.append(headerRow);

    // Day names row
    const dayNamesRow = $("<tr></tr>");
    this.dayNames.forEach((dayName) =>
      $("<th></th>").text(dayName).appendTo(dayNamesRow)
    );
    thead.append(dayNamesRow);

    table.append(thead);

    // Generate calendar days
    let weekRow = $("<tr></tr>");

    for (let i = 0; i < days[0].getDay(); i++) {
      $("<td></td>").appendTo(weekRow);
    }

    days.forEach((currentDay, i) => {
      if (currentDay.getDay() === 0 && i !== 0) {
        tbody.append(weekRow);
        weekRow = $("<tr></tr>");
      }
    
      const dayCell = $("<td></td>")
        .addClass("day")
        .text(currentDay.getDate());
    
      
      const today = new Date();
      if (
        currentDay.getDate() === today.getDate() &&
        currentDay.getMonth() === today.getMonth() &&
        currentDay.getFullYear() === today.getFullYear()
      ) {
        dayCell.addClass("today"); 
      }
    
      
      if (currentDay.getDay() === 0 || currentDay.getDay() === 6) {
        dayCell.addClass("weekend"); 
      }
    
      weekRow.append(dayCell);
    });

    for (let i = days[days.length - 1].getDay() + 1; i < 7; i++) {
      $("<td></td>").appendTo(weekRow);
    }

    tbody.append(weekRow);
    table.append(tbody);

    // Append table to calendar container
    this.elem.append(table);
  };
}

// declare a instance of Calendar
const cal = new Calendar("#calendar");

// call the display() method
cal.display();

// Global variable to store events
var events = [];

$(document).ready(function () {
  function updateEventCount() {
    $("#event-count").text(events.length);
  }
  
  // Initialize datepicker
  $("#event-date").datepicker({
    dateFormat: "yy-mm-dd", 
    onSelect: function () {
      removeErrorMessage($(this));
    }
  });

  // Add validation messages dynamically
  const addErrorMessage = (field, message) => {
    if (!field.next(".error-message").length) {
      field.after(`<span class="error-message" style="color: red; font-size: 0.9em;">${message}</span>`);
    }
  };

  const removeErrorMessage = (field) => {
    field.next(".error-message").remove();
  };

  // Validate on blur
  $("#event-date").on("blur", function () {
    const value = $(this).val();
    if (!value || !isValidDate(value)) {
      addErrorMessage($(this), "The event date is invalid.");
    } else {
      removeErrorMessage($(this));
    }
  });

  $("#event-title").on("blur", function () {
    const value = $(this).val().trim();
    if (value.length < 3) {
      addErrorMessage($(this), "The event title must have at least 3 characters.");
    } else {
      removeErrorMessage($(this));
    }
  });

  // Event handler for form submission
  $("#event-form").on("submit", function (e) {
    e.preventDefault(); // Prevent default form submission behavior

    // Get form values
    const eventDate = $("#event-date").val();
    const eventTitle = $("#event-title").val().trim();
    const eventDescription = $("#event-description").val().trim();

    // Validate form inputs
    let isValid = true;

    if (!eventDate || !isValidDate(eventDate)) {
      addErrorMessage($("#event-date"), "The event date is invalid.");
      console.log("The event date is invalid.");
      isValid = false;
    } else {
      removeErrorMessage($("#event-date"));
    }

    if (!eventTitle || eventTitle.length < 3) {
      addErrorMessage($("#event-title"), "The event title must have at least 3 characters.");
      console.log("The event title must have at least 3 characters.");
      isValid = false;
    } else {
      removeErrorMessage($("#event-title"));
    }

    if (!isValid) {
      return; // Stop submission if validation fails
    }

    // If valid, add event to the global array
    const eventString = `Date: ${eventDate}, Title: ${eventTitle}, Description: ${eventDescription}`;
    events.push(eventString);

    // Update the event count
    updateEventCount();

    // Output events to the console
    console.log("Current events:", events);

    // Display success message
    alert("Event added successfully!");

    // Clear the form
    $("#event-form")[0].reset();
    $(".error-message").remove(); // Clear error messages
  });

  // Clear button handler
  $("#clear-button").on("click", function () {
    $("#event-form")[0].reset(); // Clear the form fields
    $(".error-message").remove(); // Clear error messages
  });

  // Helper function to validate dates
  function isValidDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return false;
    }
    const [year, month, day] = dateString.split("-").map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    return day <= daysInMonth;
  }
});


