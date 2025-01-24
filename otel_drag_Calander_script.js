// =================================================================== Global variable ======================================================================
// Start with an empty calendar
let eventData = {
  events: [],
};
// Initialize an array to store updates
let updatesQueue = [];

// =================================================================   XRM user getting ============================================================
// Ensure the Xrm object is available in your environment
if (typeof Xrm !== "undefined") {
  // Get the user's full name
  const userName = Xrm.Utility.getGlobalContext().userSettings.userName;

  // Log the user details to the console
  console.log("Current User Name:", userName);
} else {
  console.error("Xrm object is not available.");
}

// =================================================================== Drag N Drop Start =====================================================================
$(document).ready(function () {
  // refresh button...
  $("#refresh-all").click(function () {
    fetchDataAndPopulateGallery();
    refreshCalendar();
    updatesQueue = [];
    console.log("Refreshed");
  });

  // fetch image from dataverse and display it on the gallery ......
  fetchDataAndPopulateGallery();

  // ================================================================= Save Updates Button ===================================================================

  $("#update-data").click(function () {
    // Check if there are updates to process
    if (updatesQueue.length === 0) {
      alert("No updates to save.");
      return;
    }

    // Ask for confirmation before proceeding
    const confirmUpdate = confirm(
      "Are you sure to schedule the contents at these time?"
    );
    if (!confirmUpdate) {
      // Exit the function if the user cancels
      return;
    }

    // Track the number of updates
    let updatesProcessed = 0;

    // Process each update in the queue
    updatesQueue.forEach((update) => {
      var record = {
        otel_schedulepostdate: update.newDate,
        otel_postsuccess: update.postSuccess,
      };

      Xrm.WebApi.updateRecord("otel_contentsandmedia", update.id, record).then(
        function success(result) {
          console.log(`Record updated successfully: ${result.id}`);
          // Increment the processed count
          updatesProcessed++;

          // Check if all updates are processed
          if (updatesProcessed === updatesQueue.length) {
            alert("All updates saved successfully!");
            setTimeout(() => {
              refreshCalendar();
            }, 2000);

            fetchDataAndPopulateGallery();
          }
        },
        function error(error) {
          console.error(`Error updating record ${update.id}:`, error.message);
        }
      );
    });

    // Clear the queue after processing
    updatesQueue = [];
    eventData = {
      events: [],
    };
  });

  // ==================================================================== gallery content details pop-up ===========================================

  // Function to fetch data based on the image ID
  function fetchDataByImageId(imageId) {
    Xrm.WebApi.retrieveMultipleRecords(
      "otel_contentsandmedia",
      `?$select=otel_caption,otel_postsuccess,createdon,otel_description,otel_imageurl,otel_languageofcaption,otel_languageofcontent,otel_postedtime,,otel_schedulepostdate&$filter=otel_contentsandmediaid eq ${imageId}`
    ).then(
      function success(results) {
        if (results.entities.length > 0) {
          const result = results.entities[0];

          // Extract data
          var otel_caption = result["otel_caption"];
          var otel_postsuccess =
            result[
              "otel_postsuccess@OData.Community.Display.V1.FormattedValue"
            ];
          var createdon =
            result["createdon@OData.Community.Display.V1.FormattedValue"];
          var otel_description = result["otel_description"];
          var otel_imageurl = result["otel_imageurl"];
          var otel_postedtime =
            result["otel_postedtime@OData.Community.Display.V1.FormattedValue"];
          var otel_languageofcaption = result["otel_languageofcaption"]; // Text
          var otel_languageofcontent = result["otel_languageofcontent"]; // Text
          var otel_schedulepostdate = result["otel_schedulepostdate"]; // Date Time
          var otel_schedulepostdate_formatted =
            result[
              "otel_schedulepostdate@OData.Community.Display.V1.FormattedValue"
            ];

          // Create and display popup
          appendPopupWindow(
            otel_imageurl,
            otel_caption,
            otel_description,
            otel_schedulepostdate,
            createdon,
            otel_postsuccess,
            imageId,
            otel_languageofcaption,
            otel_languageofcontent,
            "gallery"
          );
        }
      },
      function (error) {
        console.log(error.message);
      }
    );
  }

  //=================================================================== Initialize Calendar ======================================================
  $("#calendar").weekCalendar({
    data: eventData,
    date: new Date(),
    timeslotsPerHour: 4,
    allowCalEventOverlap: true,
    overlapEventsSeparate: true,
    totalEventsWidthPercentInOneColumn: 95,
    height: function ($calendar) {
      return $(window).height() - $(".ribbon").outerHeight();
    },

    // Render calendar......
    eventRender: function (calEvent, $event) {
      const titleColorMapping = {
        Posted: "rgb(38, 166, 41)", // green
        "Not Posted": "rgb(255, 44, 44)", //red
        Scheduled: "rgb(0, 140, 255)", // Blue
        Failed: "rgb(255, 44, 44)", //red
      };
      const backgroundColor = titleColorMapping[calEvent.title] || "#cccccc";

      // Apply the background color to the .wc-time element
      $event.find(".wc-time").css("background-color", backgroundColor);
      $event.find(".wc-time").css("border", backgroundColor);

      // Optionally, style the event title text
      $event.find(".wc-title").css("color", "#000"); // Black text

      if (calEvent.title == "Posting Successful") {
        $event.css("backgroundColor", "green");
      }
    },

    //before loading the calander.........
    calendarBeforeLoad: function (calendar) {
      var getStartDate = calendar.weekCalendar("getCurrentFirstDay");
      var getEndDate = calendar.weekCalendar("getCurrentLastDay");
    },

    //After loade the calander ...........
    calendarAfterLoad: function (calendar) {
      // Set the calendar's starting date
      var startDate = calendar.weekCalendar("getCurrentFirstDay");
      var endndDate = calendar.weekCalendar("getCurrentLastDay");
      $("#calendar").data("startDate", startDate);
      console.log("first Date: " + startDate);
      console.log("Last Date: " + endndDate);

      // Fetch data and populate the calendar.....
      fetchDataAndMarkCalendar();
      updatesQueue = [];
    },

    eventNew: function (calEvent, $event) {
      alert("Drop an image onto the calendar to create an event."); // need to move on a dialog box ---
    },

    // ============================================= display details of events on the pop-up window =================================================

    // Fetch data and create popups
    eventClick: function (calEvent, $event) {
      Xrm.WebApi.retrieveRecord(
        "otel_contentsandmedia",
        calEvent.id,
        "?$select=otel_contentsandmediaid,otel_caption,otel_postsuccess,createdon,otel_description,otel_imageurl,otel_languageofcaption,otel_languageofcontent,otel_postedtime,otel_schedulepostdate"
      ).then(
        function success(result) {
          console.log(result);
          // Columns
          var otel_contentsandmediaid = result["otel_contentsandmediaid"]; // Guid
          var otel_caption = result["otel_caption"]; // Text
          var otel_postsuccess = result["otel_postsuccess"]; // Choice
          var otel_postsuccess_formatted =
            result[
              "otel_postsuccess@OData.Community.Display.V1.FormattedValue"
            ];
          var createdon = result["createdon"]; // Date Time
          var createdon_formatted =
            result["createdon@OData.Community.Display.V1.FormattedValue"];
          var otel_description = result["otel_description"]; // Multiline Text
          var otel_imageurl = result["otel_imageurl"]; // Text
          var otel_languageofcaption = result["otel_languageofcaption"]; // Text
          var otel_languageofcontent = result["otel_languageofcontent"]; // Text
          var otel_postedtime = result["otel_postedtime"]; // Date Time
          var otel_postedtime_formatted =
            result["otel_postedtime@OData.Community.Display.V1.FormattedValue"];
          var otel_schedulepostdate = result["otel_schedulepostdate"]; // Date Time
          var otel_schedulepostdate_formatted =
            result[
              "otel_schedulepostdate@OData.Community.Display.V1.FormattedValue"
            ];

          console.log(calEvent);

          // Create popup
          appendPopupWindow(
            otel_imageurl,
            otel_caption,
            otel_description,
            otel_schedulepostdate_formatted,
            createdon_formatted,
            calEvent.title,
            calEvent.id,
            otel_languageofcaption,
            otel_languageofcontent,
            "calander Events"
          );
        },
        function (error) {
          console.log(error.message);
        }
      );
      console.log(calEvent);
    },

    eventDrop: function (calEvent, $event) {
      console.log(calEvent);
      console.log($event);
    },

    afterRender: function () {
      // Enable drag functionality
      $(".wc-cal-event").draggable({
        helper: "original",
        revert: "invalid", 
        zIndex: 100,
        start: function () {
          $(this).css("opacity", 0.5);
        },
        stop: function () {
          $(this).css("opacity", 1);
        },
      });
    },
  });

  // Make images draggable
  $(".draggable-image").draggable({
    opacity: 0.7,
    cursor: "grabbing",
    helper: "clone",
    containment: "",
    cursorAt: { top: 30, left: 30 },
    zIndex: 100,
    revert: "invalid",
    start: function (event, ui) {
      // Set the width of the helper (clone) to 30px
      ui.helper.css("width", "60px");
      ui.helper.css("height", "auto");
    },
  });

  // Make calendar droppable
  $(".wc-day-column-inner").droppable({
    accept: ".draggable-image, .wc-cal-event", // Accept both new and existing events
    drop: function (event, ui) {
      var droppedImage = $(ui.helper);
      var imageUrl = droppedImage.data("url");
      var imageId = droppedImage.data("id");
      var draggedEvent = ui.draggable.data("calEvent");

      // Attempt to retrieve the date from the column
      var timeSlot = $(this);
      var column = timeSlot.closest(".wc-day-column");
      var columnIndex = column.index(); // Index of the column in the calendar
      var startDate = $("#calendar").data("startDate"); // Calendar's starting date

      if (!startDate) {
        alert("Error: Unable to determine the calendar's start date.");
        return;
      }
      // Calculate the column's date based on the index
      var columnDate = new Date(startDate.getTime());
      columnDate.setDate(columnDate.getDate() + columnIndex - 1); // Adjust for days from start date
      // Calculate time based on the vertical drop position
      var topOffset = event.pageY - $(this).offset().top;
      var timeslotHeight = 20; // Adjust this if your timeslotHeight is different
      var timeslotsPerHour = 4;
      //   var minutesFromTop = Math.floor(topOffset / 10) * 8; // Assuming 15-minute timeslots
      var minutesPerTimeslot = 60 / timeslotsPerHour;
      // Calculate the start time from the offset
      var minutesFromTop =
        Math.floor(topOffset / timeslotHeight) * minutesPerTimeslot;
      var start = new Date(columnDate.getTime());
      start.setMinutes(start.getMinutes() + minutesFromTop);

      // ** Date Validation **
      var now = new Date(); // current time
      if (
        start < now &&
        (ui.helper.hasClass("draggable-image", "wc-cal-event") ||
          ui.helper.hasClass("wc-cal-event"))
      ) {
        alert("You cannot schedule a new event in the past.");
        refreshCalendar();
        return false; // prevent the drop action
      }

      var end = new Date(start.getTime());
      end.setMinutes(start.getMinutes() + 15); // Default duration: 10 minutes

      if (ui.helper.hasClass("draggable-image")) {
        // Create new event
        var newEvent = {
          id: imageId, // Unique ID
          start: start,
          end: end,
          title: "Marked",
          image: imageUrl, // Store image URL
        };

        // Queue the update....................
        // Check if the id exists in updatesQueue
        const existingIndex = updatesQueue.findIndex(
          (entry) => entry.id === imageId
        );

        if (existingIndex !== -1) {
          // Update the existing entry
          updatesQueue[existingIndex] = {
            ...updatesQueue[existingIndex],
            newDate: start,
            postSuccess: 164280002,
          };
        } else {
          // Add the new entry
          updatesQueue.push({
            id: imageId,
            newDate: start,
            postSuccess: 164280002,
          });
        }

        console.log(updatesQueue);

        // Add the new event to the calendar
        $("#calendar").weekCalendar("updateEvent", newEvent);
        console.log("New Event Created: ", newEvent);
      } else if (ui.helper.hasClass("wc-cal-event")) {
        // Existing event (reschedule)
        var draggedEvent = ui.helper.data("calEvent"); // Access the dragged event data
        draggedEvent.start = start;
        draggedEvent.end = end;

        // Queue the update ..............................
        // Check if the id exists in updatesQueue
        const existingIndex = updatesQueue.findIndex(
          (entry) => entry.id === draggedEvent.id
        );

        if (existingIndex !== -1) {
          // Update the existing entry
          updatesQueue[existingIndex] = {
            ...updatesQueue[existingIndex],
            newDate: start,
            postSuccess: 164280002,
          };
        } else {
          // Add the new entry
          updatesQueue.push({
            id: draggedEvent.id,
            newDate: start,
            postSuccess: 164280002,
          });
        }

        console.log(updatesQueue);

        // update the exsisting event
        $("#calendar").weekCalendar("updateEvent", draggedEvent);
        console.log("Event Rescheduled:", draggedEvent);
      }

      // ==============================================================

      // Optionally, visually update the calendar with the new schedule
      console.log(
        `Image ID: ${imageId} scheduled for ${start} with status 164280002`
      );

      // =============================================================

      console.log("Column Index:", columnIndex);
      // console.log("Start Date:", startDate);

      console.log("Column Date:", columnDate);
      console.log("Dropped Position Offset (px):", topOffset);
      console.log("Calculated Time:", start, end);
      console.log(eventData);
      console.log(updatesQueue);
    },
  });

  // Log image URLs and times
  $("#log-data").click(function () {
    eventData.events.forEach(function (event) {
      console.log(
        `Image URL: ${event.image}, Date/Time: ${event.start} - ${event.end}`
      );
    });
  });
});

//================================================================ Get Images from Dataverse ==========================================================
function fetchDataAndPopulateGallery() {
  // Fetch data from Dataverse
  Xrm.WebApi.retrieveMultipleRecords(
    "otel_contentsandmedia",
    "?$select=otel_contentsandmediaid,otel_imageurl&$filter=(otel_when eq 164280001 and otel_category eq 5 and otel_postsuccess eq 164280003 )&$orderby=createdon desc"
  ).then(
    function success(results) {
      console.log("Image Data fetched from Dataverse:", results);

      // Clear the existing gallery
      $("#image-gallery").empty();

      // Populate gallery with fetched images
      for (var i = 0; i < results.entities.length; i++) {
        var result = results.entities[i];
        var imageId = result["otel_contentsandmediaid"];
        var imageUrl = result["otel_imageurl"];

        // Create an image element
        var imgElement = $(
          `<img src="${imageUrl}" id="draggingImage" class="draggable-image"  data-id="${imageId}" data-url="${imageUrl}" data-status="marked" >`
        );

        // Append to the gallery
        $("#image-gallery").append(imgElement);
      }

      // Reinitialize drag functionality for new images
      makeImagesDraggable();

      attachImageClickEvent();
    },
    function error(error) {
      console.error("Error fetching data from Dataverse:", error.message);
    }
  );
}

// Function to make images draggable
function makeImagesDraggable() {
  $(".draggable-image").draggable({
    opacity: 0.7,
    cursor: "grabbing",
    helper: "clone",
    containment: "",
    cursorAt: { top: 30, left: 30 },
    zIndex: 100,
    revert: "invalid",
    start: function (event, ui) {
      // Set the width of the helper (clone) to 30px
      ui.helper.css("width", "60px");
      ui.helper.css("height", "auto");
    },
  });
}

// function to add click event listner
function attachImageClickEvent() {
  // Use event delegation for dynamically added images
  $(".draggable-image").click(function () {
    const imageid = $(this).data("id"); // Get the data-url attribute
    console.log(`Clicked on image with id: ${imageid}`);
    dataFetchForGalleryView(imageid);
  });
}

// ========================================================== fetch and mark the calander ============================================================================================
function fetchDataAndMarkCalendar() {
  // Mapping for otel_postsuccess values to meaningful titles
  const postSuccessTitles = {
    164280000: "Posted",
    164280001: "Not Posted",
    164280002: "Scheduled",
    164280003: "Created",
    164280004: "Failed",
  };
  // Get the current calendar's start and end dates
  const calendarStartDate = $("#calendar").weekCalendar("getCurrentFirstDay");
  const calendarEndDate = $("#calendar").weekCalendar("getCurrentLastDay");

  // Adjust dates: Subtract 1 day from the start, add 1 day to the end
  calendarStartDate.setDate(calendarStartDate.getDate() - 1);
  calendarEndDate.setDate(calendarEndDate.getDate() + 1);

  // Format dates to ISO string for the Web API query
  const startDateISO = calendarStartDate.toISOString();
  const endDateISO = calendarEndDate.toISOString();

  console.log("Start Date ISO (1 day earlier):", startDateISO);
  console.log("End Date ISO (1 day later):", endDateISO);

  // Log the adjusted dates
  console.log("Test Date - Start:", calendarStartDate);
  console.log("Test Date - End:", calendarEndDate);

  console.log("Calendar Start Date:", startDateISO);
  console.log("Calendar End Date:", endDateISO);

  // Construct the Web API query dynamically
  const filterQuery = `?$select=otel_contentsandmediaid,otel_postsuccess,otel_imageurl,otel_schedulepostdate&$filter=((otel_postsuccess ne 164280003) and (otel_schedulepostdate gt ${startDateISO} and otel_schedulepostdate lt ${endDateISO}))`;

  // Fetch data from Dataverse
  Xrm.WebApi.retrieveMultipleRecords("otel_contentsandmedia", filterQuery).then(
    function success(results) {
      console.log("Data fetched from Dataverse:", results);

      // Iterate through the fetched results
      results.entities.forEach((result) => {
        // Extract relevant fields
        const scheduleDate = new Date(result["otel_schedulepostdate"]);
        const scheduleDateFormatted =
          result[
            "otel_schedulepostdate@OData.Community.Display.V1.FormattedValue"
          ];
        const imageUrl = result["otel_imageurl"];
        const postId = result["otel_contentsandmediaid"];
        const postSuccess = result["otel_postsuccess"];
        const postSuccessFormatted =
          result["otel_postsuccess@OData.Community.Display.V1.FormattedValue"];

        // Validate the necessary data
        if (!scheduleDate || !imageUrl || postSuccess === undefined) {
          console.warn("Invalid data for result:", result);
          return;
        }

        // Get the title from the mapping
        const title =
          postSuccessTitles[postSuccess] ||
          postSuccessFormatted ||
          "Unknown Status";

        // Define the calendar event
        const calendarEvent = {
          id: postId,
          start: scheduleDate,
          end: new Date(scheduleDate.getTime() + 14 * 60 * 1000),
          title: title, // Dynamic title based on postSuccess
          image: imageUrl, // Store image URL for rendering
        };

        // Log the event for debugging
        console.log("Adding Event to Calendar:", calendarEvent);

        // Add event to the calendar
        $("#calendar").weekCalendar("updateEvent", calendarEvent);
      });
    },
    function error(error) {
      // Log the error
      console.error("Error fetching data from Dataverse:", error.message);
    }
  );
}

// ======================================================================== Calander refresh ===========================================================

function refreshCalendar() {
  // Clear the calendar's events
  $("#calendar").weekCalendar("clear");
  eventData = {
    events: [],
  };
  updatesQueue = [];
  // Fetch updated events and repopulate the calendar
  fetchDataAndMarkCalendar();

  console.log("Calendar refreshed successfully.");
}

// ======================================================================== pop-up window ===============================================================================
function appendPopupWindow(
  imageUrl,
  caption,
  description,
  postedOn,
  createdOn,
  postStatus,
  postId,
  captionLang,
  discriptionLang,
  view
) {
  const popupHtml = `
        <div class="pop-up-window-main-Prince">
            <div class="pop-up-window-Prince">
                <div class="prince-close" id="close-popup">
                    <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
                            fill="#0F0F0F" />
                    </svg>
                </div>
                <div class="prince-popup-container">
                    <div class="prince-inner-container-popup">
                        <div class="prince-inner-top-container-popup">
                            <div class="image-container-popup">
                                <img src="${imageUrl}" alt="Dynamic Image">
                            </div>
                            <div class="text-content-popup">
                                <h5 class="caption">${caption}</h5>
                                <h5 class="discription">${description}</h5>
                            </div>
                        </div>
                        <div class="inner-middle-container-popup">
                            <div class="created-left-container">
                                <h5 class="postedDetails"><span>Posting succeeded on: </span>${postedOn}</h5>
                            </div>
                            <div class="created-right-container">
                                <h5><span>Created on: </span>${createdOn}</h5>
                            </div>
                        </div>
                        <div class="inner-lower-container-popup">
                            <div class="button-container">
                                <button id="postNowButton" class="post-now-button">Post Now</button>
                                <button class="popup-schedule-button">Schedule</button>
                                <button id="deleteButton" class="delete-button">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                        fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                                        <path
                                            d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5.5 0 0 1 6.5 0h3A1.5.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5">
                                        </path>
                                    </svg>
                                </button>
                            </div>
                            <!-- <div class="info-container"> -->
                              <!-- <h5 class="content-status">Posted</h5> -->
                            <!-- </div> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

  const removeButton = `<button id="removecalButton" class="removeButton">Remove from Calendar</button>`;

  // Append the popup to the body
  $("body").append(popupHtml);
  console.log("Pop-up successful");
  console.log("Post status:", postStatus);

  switch (postStatus) {
    case "Posting Successful":
    case "Posted":
      console.log(postStatus);
      $(".inner-lower-container-popup").remove();
      break;

    case "Failed":
      console.log(postStatus);
      $(".postedDetails span").text("Posting failed on: ").css("color", "red");
      break;

    case "Marked":
      console.log(postStatus);
      $("#deleteButton").remove();
      $(".popup-schedule-button").remove();
      $(".button-container").append(removeButton);
      $(".postedDetails").remove();
      break;

    case "Scheduled":
      $(".popup-schedule-button").replaceWith(removeButton);
      $(".postedDetails span")
        .text("Posting Scheduled at: ")
        .css("color", "black");
      break;

    default:
      console.log("Unknown postStatus: " + postStatus);
  }

  if (view == "gallery") {
    $(".postedDetails").remove();
  }

  // Caption language detection
  if (captionLang == "ar") {
    $(".caption").css("text-align", "right");
    console.log(captionLang);
    console.log("post Status" + postStatus);
  }

  if (discriptionLang == "ar") {
    $(".discription").css("text-align", "right");
    console.log(discriptionLang);
  }

  // Add click event to close the popup
  $("#close-popup").click(function () {
    $(".pop-up-window-main-Prince").remove();
    fetchDataAndPopulateGallery();
  });

  // Add click event to delete the content
  $("#deleteButton").click(function () {
    if (confirm("Are you sure you want to delete this?")) {
      removeContent(postId);
    }
  });

  // remove from calander.....
  $("#removecalButton").click(function () {
    console.log(`ID: ${postId}`);

    // Ask for confirmation
    if (confirm("Are you sure to remove the post from scheduling?")) {
      var record = {};
      record.otel_schedulepostdate = null;
      record.otel_postsuccess = 164280003; // Choice

      Xrm.WebApi.updateRecord("otel_contentsandmedia", postId, record).then(
        function success(result) {
          var updatedId = result.id;
          console.log("Record updated successfully. Updated ID: " + updatedId);
          $(".pop-up-window-main-Prince").remove();
          fetchDataAndPopulateGallery();
          refreshCalendar();
        },
        function (error) {
          console.log("Error updating record: " + error.message);
        }
      );
    } else {
      console.log("Update canceled by user.");
    }
  });

  // schedule button click function
  $(".popup-schedule-button").click(function () {
    $(".popup-schedule-button").remove();
    $("#deleteButton").remove();
    $("#postNowButton").remove();
    $(".button-container").html(
      `<h5 class="success-message">Use drag and drop to schedule the post.!</h5>`
    );
  });

  // add post button click function and send request to the automate.
  $("#postNowButton").click(function () {
    //conformation..
    const userConfirmed = confirm("Are you sure you want to post now?");

    if (userConfirmed) {
      $("#postNowButton").attr("disabled", "disabled");
      $("#postNowButton").text("Posting...");
      $("#postNowButton").css("background-color", "rgb(255, 223, 83)");
      $("#postNowButton").css("color", "black");
      // Perform the POST request using fetch
      fetch(
        "https://prod-86.westus.logic.azure.com:443/workflows/c93d5e2daf194b60bff9b27df133a6ca/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=CF6upu9taY5eROWfDwDVxmm2fGKm7lRiTckDEp-OWs0",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId: postId,
            imageUrl: imageUrl,
            description: description,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Response:", data);

          if (data.status === "Success") {
            $("#postNowButton").remove();
            $(".popup-schedule-button").remove();
            $("#deleteButton").remove();
            $(".button-container").html(
              `<h5 class="success-message">Content posted on Instagram</h5>`
            );
          } else {
            alert("Failed to post on instagram. Please retry.");
            $("#postNowButton").text("Retry");
            $("#postNowButton").css("background-color", "rgb(255, 223, 83)");
            $("#postNowButton").css("color", "black");
            $("#postNowButton").removeAttr("disabled");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          console.log("Failed to create the post."); // Show error message to the user
        });
    }
  });
}

// ============================================================ fetch data from the dataverse and push to pop-up window image =========================================================

function dataFetchForGalleryView(imageId) {
  Xrm.WebApi.retrieveRecord(
    "otel_contentsandmedia",
    imageId,
    "?$select=otel_contentsandmediaid,otel_caption,otel_postsuccess,createdon,otel_description,otel_imageurl,otel_languageofcaption,otel_languageofcontent,otel_postedtime,otel_schedulepostdate"
  ).then(
    function success(result) {
      console.log(result);
      // Columns
      var otel_contentsandmediaid = result["otel_contentsandmediaid"]; // Guid
      var otel_caption = result["otel_caption"]; // Text
      var otel_postsuccess = result["otel_postsuccess"]; // Choice
      var otel_postsuccess_formatted =
        result["otel_postsuccess@OData.Community.Display.V1.FormattedValue"];
      var createdon = result["createdon"]; // Date Time
      var createdon_formatted =
        result["createdon@OData.Community.Display.V1.FormattedValue"];
      var otel_description = result["otel_description"]; // Multiline Text
      var otel_imageurl = result["otel_imageurl"]; // Text
      var otel_languageofcaption = result["otel_languageofcaption"]; // Text
      var otel_languageofcontent = result["otel_languageofcontent"]; // Text
      var otel_postedtime = result["otel_postedtime"]; // Date Time
      var otel_postedtime_formatted =
        result["otel_postedtime@OData.Community.Display.V1.FormattedValue"];
      var otel_schedulepostdate = result["otel_schedulepostdate"]; // Date Time
      var otel_schedulepostdate_formatted =
        result[
          "otel_schedulepostdate@OData.Community.Display.V1.FormattedValue"
        ];

      appendPopupWindow(
        otel_imageurl,
        otel_caption,
        otel_description,
        otel_schedulepostdate_formatted,
        createdon_formatted,
        otel_postsuccess,
        otel_contentsandmediaid,
        otel_languageofcaption,
        otel_languageofcontent,
        "gallery"
      );
    },
    function (error) {
      console.log(error.message);
    }
  );
}

// ========================================================= delete content form the table WebAPI ====================================================================================

function removeContent(contentId) {
  Xrm.WebApi.deleteRecord("otel_contentsandmedia", contentId).then(
    function success(result) {
      console.log(result);
      console.log("Delete successfully");
      fetchDataAndPopulateGallery();
      $(".pop-up-window-main-Prince").remove();
    },
    function (error) {
      console.log(error.message);
    }
  );
}

// ==========================================================
