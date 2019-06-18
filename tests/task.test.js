const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');

const {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    setupDatabase, 
    taskOne,
    taskTwo,
    taskThree
} = require('./fixtures/db'); 

beforeEach(setupDatabase);


test('should create task for users', async () => {
    const res = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'Test'
        })
        .expect(201);

    const task = await Task.findById(res.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false);
});

test('should get tasks for users', async () => {
    const req = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    expect(req.body.length).toEqual(2);
});

test('should not delete the task for the user doesn\'t own it' , async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    
        const task = await Task.findById(taskOne._id);
        expect(task).not.toBeNull();
});

//
// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated

//
// Task Test Ideas
//
// Should not create task with invalid description/completed
// Should not update task with invalid description/completed
// Should delete user task
// Should not delete task if unauthenticated
// Should not update other users task
// Should fetch user task by id
// Should not fetch user task by id if unauthenticated
// Should not fetch other users task by id
// Should fetch only completed tasks
// Should fetch only incomplete tasks
// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks