const mongoose = require('mongoose');

const RequestLogSchema = new mongoose.Schema({
  timestamp: String,
  method: String,
  path: String,
  sessionId: String,
  user_prompt: String
});

const RequestLog = mongoose.model('RequestLog', RequestLogSchema);

const ErrorLogSchema = new mongoose.Schema({
  timestamp: String,
  apiname: String,
  where: String,
  message: String,
  stacktrace: String
});

const ErrorLog = mongoose.model('ErrorLog', ErrorLogSchema);

/**
 * Lazy-load MongoDB connection. 
 */
const ensureDbConnection = async () => {
  if (mongoose.connection.readyState === 1) return;
  console.log('Connecting to MongoDB...');
  return mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });
};

const logService = {
  /**
   * Create and save a new request log.
   */
  createLog: async (logData) => {
    try {
      await ensureDbConnection();
      return await RequestLog.create(logData);
    } catch (err) {
      console.error('Failed to save log to DB:', err);
    }
  },

  /**
   * Log an error if the database connection is open.
   */
  createErrorLog: async (errorData) => {
    // Check if connection is open (1 = connected)
    if (mongoose.connection.readyState !== 1) {
      console.warn('Database not connected. Skipping error log to DB.');
      return;
    }

    try {
      return await ErrorLog.create(errorData);
    } catch (err) {
      console.error('Failed to save error log to DB:', err);
    }
  },

  /**
   * Retrieve all request logs, sorted by timestamp descending.
   */
  getAllLogs: async () => {
    await ensureDbConnection();
    return await RequestLog.find().sort({ timestamp: -1 });
  },

  /**
   * Find a specific log by its ID.
   */
  getLogById: async (id) => {
    await ensureDbConnection();
    return await RequestLog.findById(id);
  },

  /**
   * Update an existing log by its ID.
   */
  updateLog: async (id, updateData) => {
    await ensureDbConnection();
    return await RequestLog.findByIdAndUpdate(id, updateData, { new: true });
  },

  /**
   * Delete a log by its ID.
   */
  deleteLog: async (id) => {
    await ensureDbConnection();
    return await RequestLog.findByIdAndDelete(id);
  }
};

module.exports = logService;
