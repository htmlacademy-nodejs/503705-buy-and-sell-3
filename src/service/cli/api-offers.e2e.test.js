'use strict';

const request = require(`supertest`);
const server = require(`./server.e2e.js`);

describe(`Offers API end-points`, () => {
  test(`When get offers status code should be 200`, async () => {
    const res = await request(server).get(`/api/offers`);
    expect(res.statusCode).toBe(200);
  });

  test(`When post offers with no-one field status code should be 400`, async () => {
    const res = await request(server)
      .post(`/api/offers`)
      .send({});
    expect(res.statusCode).toBe(400);
  });

  test(`when post offers with not all fields status code shoul be 400`, async () => {
    const res = await request(server)
      .post(`/api/offers`)
      .send({
        title: `Sale beautiful sofa`,
        type: `sale`,
      });
    expect(res.statusCode).toBe(400);
  })

  test(`When post offers with all fields status code should be 200`, async () => {
    const res = await request(server)
      .post(`/api/offers`)
      .send({title: `Sale beautiful sofa`,
              type: `sale`,
              sum: `3434`,
              category: `sofa, furniture`,
              picture: `item.jpg`,
            });
    expect(res.statusCode).toBe(200);
  });

  test(`When get offer with correct id status code should be 200`, async () => {
    const res = await request(server).get(`/api/offers/fq10DY`);
    expect(res.statusCode).toBe(200);
  });

  test(`When get offer with incorrect id status code should be 404`, async () => {
    const res = await request(server).get(`/api/offers/iflfk`);
    expect(res.statusCode).toBe(404);
  })

  test(`When put offer with not all fileds status code should be 400`, async () => {
    const res = await request(server)
      .put(`/api/offers/fq10DY`)
      .send({
        title: `Buy a used smartphone`,
        sum: `8585`,
      });
    expect(res.statusCode).toBe(400);
  });
  
  test(`For an empty query status code should be 400`, async () => {
    const res = await request(server).get(`/api/search?query=`);
    expect(res.statusCode).toBe(400);
  });

  test(`If nothing is found status code should be 404`, async () => {
    const res = await request(server).get(`/api/search?query=start`);
    expect(res.statusCode).toBe(404);
  });
});