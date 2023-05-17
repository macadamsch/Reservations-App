import React, { useEffect, useState } from "react";
import ReservationTable from "./reservationTable/ReservationTable";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, next } from "../utils/date-time"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import TableList from "./TableList/TableList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory();

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .then(listTables)
      .then(setTables)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function handleToday() {
    history.push(`/dashboard`);
  }

  function handlePrevious() {
    const newDate = previous(date);
    history.push(`/dashboard?date=${newDate}`)
  };

  function handleNext() {
    history.push(`/dashboard?date=${next(date)}`)
  };

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
        <button className="btn btn-primary mr-1" onClick={handleToday}>
          Today
        </button>
        <button className="btn btn-primary mr=1" onClick={handlePrevious}>
          Previous
        </button>
        <button className="btn btn-primary" onClick={handleNext}>
          Next
        </button>
      </div>
      <ErrorAlert error={reservationsError} />
      <ReservationTable
        reservations={reservations}
        setReservations={setReservations}
        setError={setReservationsError} />
      <div>
        <TableList
          tables={tables}
          loadDashboard={loadDashboard} />
      </div>
    </main>
  );
}

export default Dashboard;
