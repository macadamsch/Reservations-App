const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");

const VALID_RESERVATION_FIELDS = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
];

//middleware validation functions
function validateTime(str) {
  const [hour, minute] = str.split(":");
  if (hour.length > 2 || minute.length > 2) {
    return false;
  }
  if (hour < 1 || hour > 23) {
    return false;
  }
  if (minute < 0 || minute > 59) {
    return false;
  }
  return true;
}

function validateReservation(req, res, next) {
  const reservation = req.body.data;
  if (!reservation) {
    return next({
      status: 400,
      message: `Must have data property.`
    });
  };
  VALID_RESERVATION_FIELDS.forEach((field) => {
    if (!reservation[field]) {
      return next({
        status: 400,
        message: `${field} field required.`
      });
    }
    if (field === "people" && typeof reservation[field] !== "number") {
      return next({
        status: 400,
        message: `${reservation[field]} is not a number type for people field.`
      });
    }
    if (field === "reservation_date" && !Date.parse(reservation[field])) {
      return next({
        status: 400,
        message: `${field} is not a valid date.`
      });
    }
    if (field === "reservation_time") {
      if (!validateTime(reservation[field])) {
        return next({
          status: 400,
          message: `${field} is not a valid time.`
        });
      }
    }
  })
  next();
};

function isNotTuesday(req, res, next) {
  const { reservation_date } = req.body.data;
  const [year, month, day] = reservation_date.split("-");
  const date = new Date(`${month} ${day}, ${year}`);
  res.locals.date = date;
  if (date.getDay() === 2) {
    return next({
      status: 400,
      message: "Location is closed on Tuesdays."
    });
  }
  next();
};

function isNotPast(req, res, next) {
  const date = res.locals.date;
  const today = new Date();
  if (date < today) {
    return next({
      status: 400,
      message: "Must be a future date."
    });
  }
  next();
}

function validateHours(req, res, next) {
  const reservation = req.body.data;
  const [hour, minute] = reservation.reservation_time.split(":");
  if (hour < 10 || hour > 21) {
    return next({
      status: 400,
      message: "Reservation must be made within business hours",
    });
  }
  if ((hour < 11 && minute < 30) || (hour > 20 && minute > 30)) {
    return next({
      status: 400,
      message: "Reservation must be made within business hours",
    });
  }
  next();
};

function hasBookedStatus(req, res, next) {
  const { status } = res.locals.reservation
    ? res.locals.reservation
    : req.body.data;
  if (status === "seated" || status === "finished" || status === "cancelled") {
    return next({
      status: 400,
      message: `New reservation cannot have ${status} status.`
    });
  }
  next();
}

function validateStatus(req, res, next) {
  const VALID_STATUSES = ["booked", "seated", "finished", "cancelled"];
  const { status } = req.body.data;
  if (!VALID_STATUSES.includes(status)) {
    return next({
      status: 400,
      message: `New reservation cannot have ${status} status.`
    });
  }
  next();
}

function isFinished(req, res, next) {
  const { status } = res.locals.reservation;
  if (status === "finished") {
    return next({
      status: 400,
      message: "Cannot change a reservation that has already finished."
    });
  }
  next();
}

const reservationExists = async (req, res, next) => {
  const { reservation_Id } = req.params;
  const reservation = await service.read(reservation_Id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation id ${reservation_Id} does not exist.`
  });
}

//CRUD functions
async function list(req, res) {
  const { date, mobile_number } = req.query;
  let reservations;
  if (mobile_number) {
    reservations = await service.search(mobile_number);
  } else {
    reservations = date ? await service.listByDate(date) : await service.list();
  }
  res.json({ data: reservations })
}

async function create(req, res) {
  const reservation = req.body.data;
  const { reservation_id } = await service.create(reservation);
  reservation.reservation_id = reservation_id;
  res.status(201).json({ data: reservation });
}

async function read(req, res) {
  const reservation = res.locals.reservation;
  res.json({ data: reservation });
}

async function update(req, res, next) {
  const { reservation_Id } = req.params;
  const { status } = req.body.data;
  const reservation = await service.update(reservation_Id, status);
  res.json({ data: reservation });
}

async function modify(req, res, next) {
  const { reservation_Id } = req.params;
  const reservation = req.body.data;
  const data = await service.modify(reservation_Id, reservation);
  reservation.reservation_id = data.reservation_id;
  res.json({ data: reeservation });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(validateReservation),
    isNotTuesday,
    isNotPast,
    validateHours,
    hasBookedStatus,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(reservationExists),
    validateStatus,
    isFinished,
    asyncErrorBoundary(update),
  ],
  modify: [
    validateReservation,
    isNotTuesday,
    isNotPast,
    validateHours,
    asyncErrorBoundary(reservationExists),
    hasBookedStatus,
    asyncErrorBoundary(modify),
  ],
};
