const supertest = require('supertest');
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const application = require('../src/application');
const database = require('../src/database');
const messages = require('../src/models/messages.model');

const request = supertest(application)
let message;

beforeAll(async () => {
  await database.connect();
  await messages.deleteMany();
  message = await messages.create({ content: 'What"s your name?' });
});

afterAll(async () => {
  await database.disconnect();
});

describe('messages routes', () => {
  it('/messages [GET] return all messages with status code [200 - OK]', async () => {
    const response = await request.get('/messages');
    expect(response.status).toEqual(StatusCodes.OK);
    expect(response.body.length).toBe(1);
  });
  it(
    '/messages [POST] failed to create a message with status code [400 - BAD REQUEST]',
    async () => {
      const response = await request.post('/messages').send({});
      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toMatchObject({
        error: getReasonPhrase(StatusCodes.BAD_REQUEST)
      });
    }
  );
  it(
    '/messages [POST] success to create a message with status code [201 - CREATED]',
    async () => {
      const data = { content: 'hello world!' };
      const response = await request.post('/messages').send(data);
      expect(response.status).toEqual(StatusCodes.CREATED);
      expect(response.body).toMatchObject({
        content: 'hello world!'
      });
    }
  );
  it('/messages/:id [GET] return a message with status code [200 - OK]', async () => {
    const response = await request.get(`/messages/${message._id}`);
    expect(response.status).toEqual(StatusCodes.OK);
    expect(response.body).toMatchObject({
      content: 'What"s your name?'
    });
  });
  it(
    '/messages/:id [PUT] failed to update a message with status code [400 - BAD REQUEST]',
    async () => {
      const response = await request.put('/messages/1').send({});
      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toMatchObject({
        error: getReasonPhrase(StatusCodes.BAD_REQUEST)
      });
    }
  );
  it(
    '/messages/:id [PUT] success to update a message with status code [200 - OK]',
    async () => {
      const response = await request.put('/messages/1').send({ content: 'welcome' });
      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toMatchObject({
        content: 'welcome'
      });
    }
  );
  it(
    '/messages/:id [DELETE] success to delete a message with statusCode [204 - NOT CONTENT]',
    async () => {
      const response = await request.delete('/messages/1');
      expect(response.status).toEqual(StatusCodes.NO_CONTENT);
    }
  );
});

