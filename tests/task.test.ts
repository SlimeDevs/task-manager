import request from "supertest";
import app from "../src/app";
import { Task } from "../src/models/task";
import { userOneID, userTwoID, userOne, userTwo, taskOne, taskTwo, taskThree, setupDb, closeDb} from "./util/db";

beforeEach(setupDb);
afterAll(closeDb);

describe('POST /tasks (create task)', function(): void {
	test('Should create new task for user', async function(): Promise<void> {
		const response = await request(app)
			.post('/tasks')
			.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
			.send({
				description: 'From the test suite'
			})
			.expect(201);
		const task = await Task.findById(response.body._id);
		if (!task) throw new Error('No task found');
		expect(task).not.toBeNull();
		expect(task.completed).toEqual(false)
	});

	test('Should error if creating a new task and not logged in', async function(): Promise<void> {
		await request(app)
			.post('/tasks')
			.send()
			.expect(401)
	});

	test('Should error if creating a new task with invalid fields', async function(): Promise<void> {
		await request(app)
			.post('/tasks')
			.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
			.send({
				description: "none",
				completed: 3
			})
			.expect(400)
	})
});

describe('GET /tasks (view tasks)', function(): void {
	test('Should fetch user tasks', async function(): Promise<void> {
		const response = await request(app)
			.get('/tasks')
			.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
			.send()
			.expect(200);
		expect(response.body.length).toEqual(2)
	});
});

describe('DELETE /tasks/:id (deletes one task)', function(): void {
	test('Should delete a single user task', async function(): Promise<void> {
		await request(app)
			.delete('/tasks/' + taskThree._id)
			.set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
			.send()
			.expect(200);
		const task = await Task.findById({_id: taskThree._id});
		expect(task).toBeNull()
	});

	test("Should fail to delete another user's task", async function(): Promise<void> {
		await request(app)
			.delete('/tasks/' + taskTwo._id)
			.set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
			.send()
			.expect(404);
		const task = await Task.findById({_id: taskTwo._id});
		expect(task).not.toBeNull()
	})
});

describe('PATCH /tasks/:id (updates one task)', function(): void {
	test('Should update a single user task', async function(): Promise<void> {
		await request(app)
			.patch('/tasks/' + taskThree._id)
			.set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
			.send({
				description: 'Third task now updated'
			})
			.expect(200);
		const task = await Task.findById({_id: taskThree._id});
		if (!task) throw new Error('No task found');
		expect(task.description).toBe('Third task now updated')
	});

	test("Should fail to patch another user's task", async function(): Promise<void> {
		await request(app)
			.patch('/tasks/' + taskTwo._id)
			.set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
			.send()
			.expect(404);
		const task = await Task.findById({_id: taskTwo._id});
		expect(task).not.toBeNull()
	})
});