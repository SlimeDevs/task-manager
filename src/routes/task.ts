import express, { Response } from "express";
import { Task, ITaskModel} from "../models/task";
import { IUserRequest } from "../interfaces/IUserRequest";
import { auth } from "../middlewares/auth";

const router = express.Router();

router.post('/tasks', auth, async function(req: IUserRequest, res: Response): Promise<void> {
	if (!req.user) {
		throw new Error('User is not logged in.')
	}

	const task: ITaskModel = new Task({
		...req.body,
		author: req.user._id
	});

	try {
		await task.save()
		res.status(201).send(task)
	} catch(error) {
		res.status(400).send(error)
	}
});

router.get('/tasks', auth, async function(req: IUserRequest, res: Response) {
	try {
		if (!req.user) {
			throw new Error('User is not logged in.')
		}
		const tasks = await Task.find({author: req.user._id})
		res.send(tasks)
	} catch(error) {
		res.status(500).send()
	}
})

router.get('/tasks/:id', auth, async function(req: IUserRequest, res: Response): Promise<any> {
	const _id: string = req.params.id

	try {
		if (!req.user) {
			throw new Error('User is not logged in.')
		}
		const task: ITaskModel | null = await Task.findOne({_id, author: req.user._id})
		if (!task) {
			return res.status(404).send()
		}
		res.send(task)
	} catch(error) {
		res.status(500).send()
	}
})

router.patch('/tasks/:id', auth, async function(req: IUserRequest, res: Response): Promise<any> {
	const updates: string[] = Object.keys(req.body)
	const allowedUpdates: string[] = ['description', 'completed']
	const isValidUpdate: boolean = updates.every((update) => allowedUpdates.includes(update))

	if (!isValidUpdate) {
		return res.status(400).send({ error: 'Invalid update' })
	}

	try {
		if (!req.user) {
			throw new Error('User is not logged in.')
		}
		const task: ITaskModel | null | any = await Task.findOne({ _id: req.params.id, author: req.user._id})
		if (!task) {
			return res.status(404).send()
        }
        
		updates.forEach((update) => task[update] = req.body[update])
        await task.save()
		res.send(task)
	} catch(error) {
		res.status(400).send(error)
	}
});

router.delete('/tasks/:id', auth, async function(req: IUserRequest, res: Response): Promise<any> {
	try {
		if (!req.user) {
			throw new Error('User is not logged in.')
		}
		const task: ITaskModel | null = await Task.findOneAndDelete({ _id: req.params.id, author: req.user._id})

		if (!task) {
			return res.status(404).send()
		}

		res.send(task)
	} catch(error) {
		res.status(401).send()
	}
})

export default router;