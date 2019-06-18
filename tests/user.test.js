const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');

const { userOneId, userOne, setupDatabase } = require('./fixtures/db'); 

beforeEach(setupDatabase);

test('Should sign up a user', async () => {
    const res = await request(app).post('/users').send({
        name: 'Jeff',
        email: 'jeff@gmail.com',
        password: 'jj123123'
    }).expect(201);

    // Assert that the database was changed correctly
    const user = await User.findById(res.body.user._id);
    expect(user).not.toBeNull();

    // Assertuibs about the response
    expect(res.body).toMatchObject({
        user: {
            name: 'Jeff',
            email: 'jeff@gmail.com'
        },
        token: user.tokens[0].token
    });
    expect(user.password).not.toBe('123123123');
});

test('Should login existing user', async () => {
    const res = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);
    
    expect(res.body.token).not.toBeNull();
    const user = await User.findById(res.body.user._id);
    expect(user).not.toBeNull();
    expect(user.tokens[1].token).toBe(res.body.token);
});

test('Should not login nonexisting user', async () => {
    await request(app).post('/users/login').send({
        email: 'test@tt.com',
        password: '123123'
    }).expect(400);
});

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401);
});

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user).toBeNull();
});

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401);
});

test('should upload the avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar','tests/fixtures/profile-pic.jpg')
        .expect(200);
    
        const user = await User.findById(userOneId);
        expect(user.avatar).toEqual(expect.any(Buffer));

});

test('should update valid user fields', async () => {
    const res = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Mike'
        }).expect(200);

    const user = await User.findById(res.body._id);
    expect(user).not.toBeNull();
    expect(user.name).toEqual('Mike');
});

test('should not update the invalid fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Taipei'
        }).expect(400);
});