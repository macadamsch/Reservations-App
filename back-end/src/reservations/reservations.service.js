const { select } = require("../db/connection");
const knex = require("../db/connection");

function list(){
    return knex("reservations")
        .select("*")
        .orderBy("reservations.reservation_date");
};

function create(reservation) {
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((newRes) => newRes[0]);
}

function listByDate(reservation_date) {
    return knex("reservations")
        .select("*")
        .where({ reservation_date })
        .whereNotIn("status", ["finished", "cancelled"])
        .orderBy("reservations.reservation_time");
};

function read(reservation_id) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id })
        .first();
}

function update(reservation_id, status) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id })
        .update({ status })
        .returning("*")
        .then((updated) => updated[0]);
};

function finish(reservation_id) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id })
        .update({ status: "finished" });
}

function search(mobile_number) {
    return knex("reservations")
        .whereRaw(
            "translate(mobile_number, '() -', '') like ?", 
            `%${mobile_number.replace(/\D/g, "")}%`
        )
        .orderBy("reservation_date");
}

function modify(reservation_id, reservation) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id })
        .update(reservation, "*")
        .returning("*")
        .then((updatedRes) => updatedRes[0]);
}

module.exports = {
    list,
    create,
    listByDate,
    read,
    finish,
    update,
    search,
    modify,
}