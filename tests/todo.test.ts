import request from "supertest";
import app from "../src/app";
import { Todo } from "../src/models/todo";
import { userOneID, userTwoID, userOne, userTwo, todoOne, todoTwo, todoThree, setupDb, closeDb} from "./util/db";

beforeEach(setupDb);
afterAll(closeDb);

describe('POST /todos (create todo)', function(): void {
	test('Should create new todo for user', async function(): Promise<void> {
		const response = await request(app)
			.post('/todos')
			.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
			.send({
				title: 'From the test suite'
			})
			.expect(201);
		const todo = await Todo.findById(response.body._id);
		if (!todo) throw new Error('No todo found');
		expect(todo).not.toBeNull();
		expect(todo.completed).toEqual(false)
	});

	test('Should error if creating a new todo and not logged in', async function(): Promise<void> {
		await request(app)
			.post('/todos')
			.send()
			.expect(401)
	});

	test('Should error if creating a new todo with invalid fields', async function(): Promise<void> {
		await request(app)
			.post('/todos')
			.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
			.send({
				completed: 3
			})
			.expect(400)
	})
});

describe('GET /todos (view todos)', function(): void {
	test('Should fetch user todos', async function(): Promise<void> {
		const response = await request(app)
			.get('/todos')
			.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
			.send()
			.expect(200);
		expect(response.body.length).toEqual(2)
	});
});

describe('DELETE /todos/:id (deletes one todo)', function(): void {
	test('Should delete a single user todo', async function(): Promise<void> {
		await request(app)
			.delete('/todos/' + todoThree._id)
			.set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
			.send()
			.expect(200);
		const todo = await Todo.findById({_id: todoThree._id});
		expect(todo).toBeNull()
	});

	test("Should fail to delete another user's todo", async function(): Promise<void> {
		await request(app)
			.delete('/todos/' + todoTwo._id)
			.set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
			.send()
			.expect(404);
		const todo = await Todo.findById({_id: todoTwo._id});
		expect(todo).not.toBeNull()
	})
});

describe('PATCH /todos/:id (updates one todo)', function(): void {
	test('Should update a single user todo', async function(): Promise<void> {
		await request(app)
			.patch('/todos/' + todoThree._id)
			.set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
			.send({
				title: 'Third todo now updated'
			})
			.expect(200);
		const todo = await Todo.findById({_id: todoThree._id});
		if (!todo) throw new Error('No todo found');
		expect(todo.title).toBe('Third todo now updated')
	});

	test("Should fail to patch another user's todo", async function(): Promise<void> {
		await request(app)
			.patch('/todos/' + todoTwo._id)
			.set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
			.send()
			.expect(404);
		const todo = await Todo.findById({_id: todoTwo._id});
		expect(todo).not.toBeNull()
	})
});