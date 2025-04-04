const Booking = require("../models/Booking");
const Ride = require("../models/Ride");
const User = require("../models/User");

exports.createBooking = async (req, res) => {
  try {
    const { ride_id, user_id, status, is_approved, created_by, updated_by } = req.body;
    const ride = await Ride.findByPk(ride_id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    const booking_user = await Booking.count({ where: { user_id,ride_id } });

    if (booking_user === 0) {
      const bookingCount = await Booking.count({ where: { ride_id } });

      if (bookingCount >= ride.seat) {  // Fix the logic to properly compare
        return res.status(400).json({ message: "Seats are full. Booking closed" });
      }

      const booking = await Booking.create({
        ride_id,
        user_id,
        status,
        is_approved: is_approved || "pending",
        created_by,
        updated_by,
      });

      return res.status(200).json({ message: "Booking created successfully", booking });
    } else {
      return res.status(400).json({ message: "Already Booked" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating booking", error });
  }
};


exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, is_approved, updated_by } = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await booking.update({
      status,
      is_approved,
      updated_by,
      updated_at: new Date(),
    });

    res.status(200).json({ message: "Booking updated successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Error updating booking", error });
  }
};


exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};


exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findOne({
      where: { id },
      include: [
        {
          model: Ride,
          as: 'Ride', // Use the same alias as defined in the model
          attributes: ['id', 'pickup','drop_point','departure_date','start_time'],
        },
        {
          model: User,
          as: 'User', // Use the same alias as defined in the model
          attributes: ['id', 'name', 'email','phone'],
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    return res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking details:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};



exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await booking.destroy();
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting booking", error });
  }
};

exports.approveBooking = async (req, res) => {
  try {
    
    const { id,status } = req.body; // Expected values: 'approved' or 'reject'
    console.log(req.body)
    // Validate status
    if (req.user.role == "rider" || req.user.role == "admin") {
      if (!["approved", "reject"].includes(status)) {
        return res
          .status(400)
          .json({ error: 'Invalid status. Use "approved" or "reject".' });
      }

      // Find booking by ID
      const booking = await Booking.findByPk(id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Update booking status
      booking.is_approved = status;
      await booking.save();

      return res
        .status(200)
        .json({ message: `Booking ${status} successfully`, booking });
    } else {
      return res
        .status(400)
        .json({ message: 'Access denied.Bad Request'});
    }
  } catch (error) {
    console.error('Error updating booking approval:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
