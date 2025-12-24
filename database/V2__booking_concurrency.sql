-- Add tstzrange column for conflict detection
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS period tstzrange
GENERATED ALWAYS AS (tstzrange(start_ts, end_ts)) STORED;

-- Index for overlap detection
CREATE INDEX IF NOT EXISTS idx_bookings_period_gist
ON bookings USING GIST (period);

-- Partial index for active bookings only
CREATE INDEX IF NOT EXISTS idx_bookings_active
ON bookings (facility_id)
WHERE status IN ('PENDING', 'CONFIRMED');
