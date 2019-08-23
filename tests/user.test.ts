import request from "supertest";
import app from "../src/app";
import { User } from "../src/models/user";
import { userOneID, userOne, setupDb, closeDb} from "./util/db";

beforeEach(setupDb)

afterAll(closeDb)

describe('GET /users/me route (profile)', function(): void {
	test('Should get profile for user', async function(): Promise<void> {
		await request(app)
			.get('/users/me')
			.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
			.send()
			.expect(200)
	});
	
	test('Should not get profile for unauthenticated user', async function(): Promise<void> {
		await request(app)
			.get('/users/me')
			.send()
			.expect(401)
	});
});

describe('POST /users route (signup)', function(): void {
	test('Should signup a new user', async function(): Promise<void> {
		const response = await request(app).post('/users').send({
			username: 'Jeff6',
			email: 'Jeff6@example.org',
			password: 'jeffpass123'
		}).expect(201);
		const user = await User.findById(response.body.user._id)
		if (!user) throw new Error('No user found')

		expect(user).not.toBeNull()
		expect(response.body).toMatchObject({
			user: {
				username: 'Jeff6',
				email: 'Jeff6@example.org',
			},
			token: user.tokens[0].token
		})
		expect(user.password).not.toBe('mikeTHE123Best')
	});
});

describe('POST /users/login route (login)', function(): void {
	test('Should login existing user', async function(): Promise<void> {
		const response = await request(app).post('/users/login').send({
			username: userOne.username,
			password: userOne.password
		}).expect(200);

		const user = await User.findById(response.body.user._id)
		if (!user) throw new Error('No user found')
		expect(response.body.token).toBe(user.tokens[1].token)
	});
	
	test('Should not login nonexistent user', async function(): Promise<void> {
		const response = await request(app).post('/users/login').send({
			username: userOne.username,
			password: 'asdhjofpgijsdfiosj'
		})
		expect(response.status).toBe(401);
	});
});

describe('DELETE /users/me', function(): void {
	test('Should delete account for user', async function(): Promise<void> {
		const response = await request(app)
			.delete('/users/me')
			.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
			.send()
			.expect(200)

		const user = await User.findById(userOneID)
		expect(user).toBe(null)
	});

	test('Should not delete account for unauthenticated user', async function(): Promise<void> {
		await request(app)
			.get('/users/me')
			.send()
			.expect(401)
	});
});

describe('PATCH /users/me', function(): void {
	test('Should update valid user fields', async function() {
		await request(app)
			.patch('/users/me')
			.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
			.send({
				username: 'Jess'
			})
			.expect(200)
		const user = await User.findById(userOneID)
		if (!user) throw new Error('No user found')
		expect(user.username).toEqual('Jess')
	});

	test('Should not update invalid user fields', async function() {
		await request(app)
			.patch('/users/me')
			.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
			.send({
				invalidfield: 'This field is not allowed'
			})
			.expect(400)
	});
});
