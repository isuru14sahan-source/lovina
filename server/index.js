const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// Helper function to read database
function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = { orders: [], reviews: [] };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
      return initial;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database:', err);
    return { orders: [], reviews: [] };
  }
}

// Helper function to write database
function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing database:', err);
  }
}

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', name: 'Lovina Live Cloud REST API', timestamp: new Date().toISOString() });
});

// GET all orders
app.get('/api/orders', (req, res) => {
  const db = readDB();
  res.json(db.orders || []);
});

// POST submit new order
app.post('/api/orders', (req, res) => {
  const db = readDB();
  const newOrder = req.body;
  
  if (!newOrder || !newOrder.items) {
    return res.status(400).json({ error: 'Invalid order payload' });
  }

  const generatedOrderNum = 'LV-' + Math.floor(10000 + Math.random() * 90000);
  const trackingNum = 'TRK-SL-' + Math.floor(100000 + Math.random() * 900000);

  const orderRecord = {
    id: 'ord-' + Date.now(),
    orderNumber: generatedOrderNum,
    date: new Date().toISOString().split('T')[0],
    items: newOrder.items,
    shippingAddress: newOrder.shippingAddress,
    paymentMethod: newOrder.paymentMethod,
    totalAmountLKR: newOrder.totalAmountLKR,
    status: 'Processing',
    trackingNumber: trackingNum
  };

  db.orders.unshift(orderRecord);
  writeDB(db);

  console.log(`Saved new order #${generatedOrderNum} to Cloud Database!`);
  res.status(201).json({ success: true, order: orderRecord });
});

// GET track order by Order Number or Tracking ID
app.get('/api/orders/track/:id', (req, res) => {
  const db = readDB();
  const q = req.params.id.trim().toLowerCase();

  const found = db.orders.find(
    (o) => o.orderNumber.toLowerCase() === q || (o.trackingNumber && o.trackingNumber.toLowerCase() === q)
  );

  if (found) {
    res.json({ success: true, order: found });
  } else {
    res.status(404).json({ success: false, message: 'Order not found' });
  }
});

// POST submit review
app.post('/api/reviews', (req, res) => {
  const db = readDB();
  const { productId, review } = req.body;

  if (!productId || !review) {
    return res.status(400).json({ error: 'Invalid review payload' });
  }

  const record = { id: 'rev-' + Date.now(), productId, ...review };
  if (!db.reviews) db.reviews = [];
  db.reviews.unshift(record);
  writeDB(db);

  res.status(201).json({ success: true, review: record });
});

const crypto = require('crypto');

// POST Admin Password Auth
app.post('/api/auth/admin', (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }

  const passHash = crypto.createHash('sha256').update(password.trim()).digest('hex');
  const validHashes = [
    'eb9cd01c89db2a147be70df37e22bb812ad44b0ddf8c5a9e93789b95fcf91276',
    'a090afb8ed81cb2667de7ce2b0bc8c325949918843b403911743b4aa87c3280f',
    '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
  ];

  if (validHashes.includes(passHash) || (process.env.ADMIN_PASSWORD && password.trim() === process.env.ADMIN_PASSWORD)) {
    res.json({ success: true, token: 'admin-sec-token-' + Date.now() });
  } else {
    res.status(401).json({ success: false, message: 'Invalid Admin Security Clearance Password' });
  }
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Lovina Live Cloud REST API Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`⚠️ Port ${PORT} is already running an active Lovina server instance!`);
    console.log(`💡 Your server is ALREADY ONLINE & listening at http://localhost:${PORT}`);
  } else {
    console.error('Server error:', err);
  }
});

