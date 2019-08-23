import express, { Response } from "express";
import { Todo, ITodoModel} from "../models/todo";
import { IUserRequest } from "../interfaces/IUserRequest";
import { auth } from "../middlewares/auth";

const router = express.Router();

router.post('/todos', auth, async function(req: IUserRequest, res: Response): Promise<void> {
	if (!req.user) {
		throw new Error('User is not logged in.')
	}

	const todo: ITodoModel = new Todo({
		...req.body,
		author: req.user._id
	});

	try {
		await todo.save()
		res.status(201).send(todo)
	} catch(error) {
		res.status(400).send(error)
	}
});

router.get('/todos', auth, async function(req: IUserRequest, res: Response) {
	try {
		if (!req.user) {
			throw new Error('User is not logged in.')
		}
		const todos = await Todo.find({author: req.user._id})
		res.send(todos)
	} catch(error) {
		res.status(500).send()
	}
})

router.get('/todos/:id', auth, async function(req: IUserRequest, res: Response): Promise<any> {
	const _id: string = req.params.id

	try {
		if (!req.user) {
			throw new Error('User is not logged in.')
		}
		const todo: ITodoModel | null = await Todo.findOne({_id, author: req.user._id})
		if (!todo) {
			return res.status(404).send()
		}
		res.send(todo)
	} catch(error) {
		res.status(500).send()
	}
})

router.patch('/todos/:id', auth, async function(req: IUserRequest, res: Response): Promise<any> {
	const updates: string[] = Object.keys(req.body)
	const allowedUpdates: string[] = ['title', 'description', 'completed', 'priority', 'due']
	const isValidUpdate: boolean = updates.every((update) => allowedUpdates.includes(update))

	if (!isValidUpdate) {
		return res.status(400).send({ error: 'Invalid update' })
	}

	try {
		if (!req.user) {
			throw new Error('User is not logged in.')
		}
		const todo: ITodoModel | null | any = await Todo.findOne({ _id: req.params.id, author: req.user._id})
		if (!todo) {
			return res.status(404).send()
        }
        
		updates.forEach((update) => todo[update] = req.body[update])
        await todo.save()
		res.send(todo)
	} catch(error) {
		res.status(400).send(error)
	}
});

router.delete('/todos/:id', auth, async function(req: IUserRequest, res: Response): Promise<any> {
	try {
		if (!req.user) {
			throw new Error('User is not logged in.')
		}
		const todo: ITodoModel | null = await Todo.findOneAndDelete({ _id: req.params.id, author: req.user._id})

		if (!todo) {
			return res.status(404).send()
		}

		res.send(todo)
	} catch(error) {
		res.status(401).send()
	}
})

export default router;