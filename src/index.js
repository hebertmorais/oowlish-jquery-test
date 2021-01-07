import "./index.css";

const API_URL = "http://localhost:3030/doctors";

let doctors = [];
let searchInput;

/**
 * Calls all functions needed at the start
 */
const onInit = () => {
  getDoctors();
  updateAvailability();
  createSearchInput();
  createListeners();
  insertSearchInput();
};

/**
 * Get doctors from API, if availability is given it will add filter to url
 * @param {*} availability 
 */
const getDoctors = (availability = undefined) => {
  const availabilityParam = availability ? `/available${availability}` : "";
  $.ajax({
    method: "GET",
    url: `${API_URL}${availabilityParam}`,
    success: (data) => {
      doctors = data;
    },
    async: false,
  });
};

/**
 * Updates all doctor rows with availability from database
 */
const updateAvailability = () => {
  doctors.forEach((doctor, _) => {
    updateDoctorRowFromUPIN(doctor);
  });
};
/**
 * Creates listener for availability filter, set availability button and search
 * inputs
 */
const createListeners = () => {
  $("#availabilityFilterSelect").on("change", (event) => {
    const filterValue = $(event.currentTarget).val();
    handleFilterChange(filterValue);
  });

  $(".button").on("click", (event) => {
    const upin = $(event.currentTarget).parent().parent().attr("data-upin");
    let doctorWithUPIN = doctors.filter((doctor) => {
      return doctor.upin == upin;
    })[0];

    doctorWithUPIN.available = !doctorWithUPIN.available;
    changeDoctorAvailability(doctorWithUPIN);
  });

  searchInput.on("input", (event) => {
    const searchValue = $(event.currentTarget).val();
    handleSearchInputChange(searchValue);
  });
};

/**
 * Handles value from availability filter
 * @param {*} value 
 */
const handleFilterChange = (value) => {
  doctors.forEach((doctor, _) => {
    let item = getDoctorRowFromUPIN(doctor.upin);
    if (value == "available" && !doctor.available) {
      item.addClass("hidden");
    } else if (value == "all") {
      item.removeClass("hidden");
    }
  });
};

/**
 * Updates given doctor in API
 * @param {*} availability 
 */
const changeDoctorAvailability = (doctor) => {
  $.ajax({
    method: "PUT",
    contentType: "application/json",
    url: `${API_URL}/${doctor.upin}`,
    data: JSON.stringify(doctor),
    success: (updatedDoctor) => {
      updateDoctorRowFromUPIN(updatedDoctor);
    },
  });
};

/**
 * Updates row with indicator color and button text
 * @param {*} doctor 
 */
const updateDoctorRowFromUPIN = (doctor) => {
  const doctorRow = getDoctorRowFromUPIN(doctor.upin);
  const buttonText = `Mark as ${doctor.available ? "Una" : "A"}vailable`;

  doctorRow.find(".button").html(buttonText);

  if (doctor.available) {
    doctorRow.addClass("available");
  } else {
    if (doctorRow.hasClass("available")) doctorRow.removeClass("available");
  }
};

/**
 * Returns jQuery object with tr element for given doctor UPIN
 * @param {*} upin 
 */
const getDoctorRowFromUPIN = (upin) => {
  return $(`[data-upin='${upin}']`).first();
};

/**
 * Creates html element form search input
 */
const createSearchInput = () => {
  searchInput = $("<input/>", {
    type: "text",
    id: "searchInput",
    placeholder: "Filter by UPIN",
  });
};

/**
 * Insert search input into search container
 */
const insertSearchInput = () => {
  $("#searchContainer").html(searchInput);
};

/**
 * Handles input from search. Checks for every doctor item if it includes
 * either the name or UPIN.
 * @param {*} searchInput 
 */
const handleSearchInputChange = (searchInput) => {
  doctors.forEach((doctor, _) => {
    const item = getDoctorRowFromUPIN(doctor.upin);
    const input = searchInput.toLowerCase().trim();
    if (
      doctor.name.toLowerCase().includes(input) ||
      (doctor.upin.toString()).includes(input)
    ) {
      if (item.hasClass("hidden")) {
        item.removeClass("hidden");
      }
    } else {
      if (!item.hasClass("hidden")) {
        item.addClass("hidden");
      }
    }
  });
};

/**
 * Calls init when document is loaded
 */
$(document).ready(() => {
  onInit();
});
