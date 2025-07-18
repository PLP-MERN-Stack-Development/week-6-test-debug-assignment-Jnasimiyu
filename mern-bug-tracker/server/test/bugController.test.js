const request = require('supertest');

const app = require('../index');


describe('GET /api/bugs', () => {
  it('should return all bugs', async () => {
    const res = await request(app).get('/api/bugs');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
