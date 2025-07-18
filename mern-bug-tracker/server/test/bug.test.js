const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index'); // Ensure this exports only the app (not app.listen)
const Bug = require('../models/Bug');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // ✅ Disconnect any existing connections (avoids "openUri on active connection" error)
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  await mongoose.connect(uri);
});

afterEach(async () => {
  await Bug.deleteMany(); // ✅ Clean up between tests
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('🐞 BUG API', () => {
  const validBug = {
    title: 'Bug A',
    description: 'This is a valid description of at least 10 characters.',
    severity: 'medium',
    status: 'open',
    reportedBy: 'Alice'
  };

  it('GET /api/bugs - should return all bugs', async () => {
    await Bug.create(validBug);
    const res = await request(app).get('/api/bugs');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe('Bug A');
  });

  it('POST /api/bugs - should create a new bug with valid data', async () => {
    const res = await request(app).post('/api/bugs').send(validBug);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(validBug.title);
  });

  it('POST /api/bugs - should fail with invalid data', async () => {
    const invalidBug = {
      title: '',                            // ❌ required
      description: 'short',                 // ❌ too short
      severity: 'extreme',                  // ❌ not in enum
      status: 'unknown',                    // ❌ not in enum
      reportedBy: ''                        // ❌ required
    };

    const res = await request(app).post('/api/bugs').send(invalidBug);

    expect(res.statusCode).toBe(400);       // ✅ Assumes your validation handles this properly
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();  // ✅ Optional: check error details
  });

  it('PUT /api/bugs/:id - should update a bug', async () => {
    const created = await Bug.create(validBug);
    const res = await request(app)
      .put(`/api/bugs/${created._id}`)
      .send({ ...validBug, status: 'closed' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('closed');
  });

  it('DELETE /api/bugs/:id - should delete a bug', async () => {
    const created = await Bug.create(validBug);
    const res = await request(app).delete(`/api/bugs/${created._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const found = await Bug.findById(created._id);
    expect(found).toBeNull(); // ✅ Confirm deletion
  });
});
