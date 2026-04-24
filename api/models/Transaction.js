const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
  stage: { type: String, required: true },
  actor: { type: String },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'processing', 'success', 'failed'], default: 'success' },
  payload: { type: mongoose.Schema.Types.Mixed },
  response: { type: mongoose.Schema.Types.Mixed },
  durationMs: { type: Number },
}, { _id: false });

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Card details (masked)
  cardLast4: { type: String, required: true },
  cardBrand: { type: String, enum: ['Visa', 'Mastercard', 'Amex', 'Discover'], default: 'Visa' },
  cardholderName: { type: String, default: 'John Doe' },
  // Transaction details
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  merchantName: { type: String, default: 'DatMan Store' },
  merchantCategory: { type: String, default: 'E-Commerce' },
  // 3DS details
  authMethod: {
    type: String,
    enum: ['3ds2_frictionless', '3ds2_challenge', '3ds1_redirect', 'non_3ds'],
    required: true,
  },
  threeDSVersion: { type: String, enum: ['1.0', '2.1', '2.2'], default: '2.2' },
  status: {
    type: String,
    enum: ['approved', 'declined', 'pending', 'timeout', 'error'],
    default: 'pending',
  },
  // 3DS Cryptographic values
  cavv: { type: String },
  eci: { type: String },
  dsTransId: { type: String },
  acsUrl: { type: String },
  authenticationValue: { type: String },
  // Flow steps log
  steps: [stepSchema],
  // Metadata
  ipAddress: { type: String, default: '192.168.1.1' },
  deviceFingerprint: { type: String },
  riskScore: { type: Number, min: 0, max: 100 },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

module.exports = mongoose.model('Transaction', transactionSchema);
