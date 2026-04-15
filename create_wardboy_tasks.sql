-- 10. WardBoyTasks Table
CREATE TABLE WardBoyTasks (
    TaskId SERIAL PRIMARY KEY,
    WardBid INT REFERENCES WardBoy(WardBid),
    AssignedByRole VARCHAR(50),
    AssignedByName VARCHAR(100),
    TaskDescription TEXT NOT NULL,
    Status VARCHAR(50) DEFAULT 'Pending',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
