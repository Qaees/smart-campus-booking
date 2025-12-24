/**
 * Smart Campus Booking API
 * Entry point of backend service
 */

const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(express.json());

// PostgreSQL connection (LOCAL for now)
const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "postgres",
  database: "smart_campus_booking"
});

/**
 * Health check endpoint
 * Used to verify API is running
 */
app.get("/health", (req, res) => {
  res.json({ status: "API is running" });
});

/**
 * Create booking (without conflict logic yet)
 * Next step we will add concurrency prevention
 */
app.post("/bookings", async (req, res) => {
  const { facility_id, user_id, start_ts, end_ts, title } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO bookings (facility_id, user_id, start_ts, end_ts, title, status)
      VALUES ($1, $2, $3, $4, $5, 'PENDING')
      RETURNING booking_id
      `,
      [facility_id, user_id, start_ts, end_ts, title]
    );

    res.status(201).json({
      message: "Booking created",
      booking_id: result.rows[0].booking_id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Booking failed" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
