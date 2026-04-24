const express = require('express');
const { protect } = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const { v4: uuidv4 } = require('crypto').randomUUID ? require('crypto') : { v4: () => Math.random().toString(36).substr(2,9) };

const router = express.Router();

// All routes protected
router.use(protect);

// GET /api/transactions — list all for user
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, authMethod } = req.query;
    const filter = { userId: req.user._id };
    if (status) filter.status = status;
    if (authMethod) filter.authMethod = authMethod;

    const total = await Transaction.countDocuments(filter);
    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ transactions, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/transactions/stats — dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user._id;
    const [total, approved, declined, frictionless, challenge] = await Promise.all([
      Transaction.countDocuments({ userId }),
      Transaction.countDocuments({ userId, status: 'approved' }),
      Transaction.countDocuments({ userId, status: 'declined' }),
      Transaction.countDocuments({ userId, authMethod: '3ds2_frictionless' }),
      Transaction.countDocuments({ userId, authMethod: '3ds2_challenge' }),
    ]);

    const totalVolume = await Transaction.aggregate([
      { $match: { userId, status: 'approved' } },
      { $group: { _id: null, sum: { $sum: '$amount' } } },
    ]);

    res.json({
      total, approved, declined,
      approvalRate: total ? ((approved / total) * 100).toFixed(1) : 0,
      frictionless, challenge,
      totalVolume: totalVolume[0]?.sum || 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/transactions/:id
router.get('/:id', async (req, res) => {
  try {
    const tx = await Transaction.findOne({ _id: req.params.id, userId: req.user._id });
    if (!tx) return res.status(404).json({ error: 'Transaction not found' });
    res.json(tx);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/transactions/simulate — mock 3DS flow
router.post('/simulate', async (req, res) => {
  try {
    const {
      amount = 150,
      currency = 'USD',
      cardLast4 = '4242',
      cardBrand = 'Visa',
      authMethod = '3ds2_frictionless',
      merchantName = 'DatMan Store',
    } = req.body;

    // Generate mock 3DS values
    const isFrictionless = authMethod === '3ds2_frictionless';
    const riskScore = isFrictionless ? Math.floor(Math.random() * 30) : Math.floor(30 + Math.random() * 50);

    const steps = [
      { stage: 'Payment Initiated', actor: 'Merchant Frontend', status: 'success', payload: { amount, currency, cardLast4 }, durationMs: 45 },
      { stage: 'Tokenization', actor: 'PSP', status: 'success', payload: { raw: `4***${cardLast4}`, token: `tok_${Math.random().toString(36).substr(2,12)}` }, durationMs: 120 },
      { stage: 'Authorization Request', actor: 'Acquiring Bank → Card Network', status: 'success', payload: { amount, currency, merchantId: 'MERCH_001' }, durationMs: 80 },
      { stage: '3DS Initiation', actor: '3DS Server → Directory Server', status: 'success', payload: { version: '2.2', dsTransId: `DS-${Date.now()}` }, durationMs: 200 },
      { stage: 'ACS Lookup', actor: 'Directory Server → ACS', status: 'success', payload: { acsUrl: 'https://acs.issuerbank.com/auth', threeDSMethodURL: 'https://acs.issuerbank.com/method' }, durationMs: 150 },
      { stage: 'Risk Assessment', actor: 'Issuer ACS Risk Engine', status: 'success', payload: { riskScore, decision: isFrictionless ? 'FRICTIONLESS' : 'CHALLENGE' }, durationMs: 300 },
      ...(isFrictionless ? [] : [
        { stage: 'Challenge Sent', actor: 'ACS → Cardholder', status: 'success', payload: { challengeType: 'OTP', channel: 'SMS' }, durationMs: 2000 },
        { stage: 'Challenge Completed', actor: 'Cardholder → ACS', status: 'success', payload: { otp: '******', verified: true }, durationMs: 8000 },
      ]),
      { stage: 'Authentication Value Generated', actor: 'ACS', status: 'success', payload: { cavv: `CAVV${Date.now()}`, eci: isFrictionless ? '07' : '05' }, durationMs: 100 },
      { stage: 'Authorization Approved', actor: 'Issuer Bank', status: 'success', payload: { authCode: `AUTH${Math.floor(Math.random()*999999)}`, rrn: `RRN${Date.now()}` }, durationMs: 250 },
    ];

    const transaction = await Transaction.create({
      userId: req.user._id,
      cardLast4, cardBrand, amount, currency, merchantName,
      authMethod,
      threeDSVersion: '2.2',
      status: 'approved',
      cavv: `CAVV_${Date.now()}`,
      eci: isFrictionless ? '07' : '05',
      dsTransId: `DS-${Date.now()}`,
      riskScore,
      steps,
      completedAt: new Date(),
    });

    res.status(201).json({ transaction, message: `${isFrictionless ? 'Frictionless' : 'Challenge'} 3DS flow completed successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/transactions/:id
router.delete('/:id', async (req, res) => {
  try {
    const tx = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!tx) return res.status(404).json({ error: 'Transaction not found' });
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

// v2 - improved simulation accuracy