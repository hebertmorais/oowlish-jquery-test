import "./index.css";

const API_URL = "http://localhost:3030/doctors";

let doctors = [];
let searchInput;

const onInit = () => {
  getDoctors();
  addAvailabilityIndicator();
  createSearchInput();
  createListeners();
  insertSearchInput();
};

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

const addAvailabilityIndicator = () => {
  doctors.forEach((doctor, _) => {
    updateDoctorRowFromUPIN(doctor);
  });
};

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

const getDoctorRowFromUPIN = (upin) => {
  return $(`[data-upin='${upin}']`).first();
};

const createSearchInput = () => {
  searchInput = $("<input/>", {
    type: "text",
    id: "searchInput",
    placeholder: "Filter by UPIN",
  });
};

const insertSearchInput = () => {
  $("#searchContainer").html(searchInput);
};

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

$(document).ready(() => {
  onInit();
});
