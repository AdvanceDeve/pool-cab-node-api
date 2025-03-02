const db = require("../config/database");

class Ride {
    static async getAllRides() {
        const [rows] = await db.query("SELECT * FROM rides");
        return rows;
    }

    static async getRideById(id) {
        const [rows] = await db.query("SELECT * FROM rides WHERE id = ?", [id]);
        return rows[0];
    }

    static async createRide(rideData) {
        const sql = `INSERT INTO rides 
        (user_id, pickup, drop_point, start_time, is_free, price, seat, vehicle_type, vehicle_number, note, status, created_by, updated_by) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            rideData.user_id, rideData.pickup, rideData.drop_point, rideData.start_time,
            rideData.is_free, rideData.price, rideData.seat, rideData.vehicle_type,
            rideData.vehicle_number, rideData.note, rideData.status,
            rideData.created_by, rideData.updated_by
        ];

        try {
            const [result] = await db.query(sql, values);
            return result.insertId;
        } catch (error) {
            console.error("SQL Error:", error);
            throw error;
        }
    }


    static async updateRide(id, rideData) {
        const sql = `UPDATE rides SET user_id=?, pickup=?, drop_point=?, start_time=?, is_free=?, price=?, seat=?, vehicle_type=?, vehicle_number=?, note=?, status=?, updated_by=? WHERE id=?`;
        const values = [
            rideData.user_id, rideData.pickup, rideData.drop_point, rideData.start_time,
            rideData.is_free, rideData.price, rideData.seat, rideData.vehicle_type,
            rideData.vehicle_number, rideData.note, rideData.status, rideData.updated_by, id
        ];
        const [result] = await db.query(sql, values);
        return result.affectedRows;
    }

    static async deleteRide(id) {
        const [result] = await db.query("DELETE FROM rides WHERE id = ?", [id]);
        return result.affectedRows;
    }
}

module.exports = Ride;
