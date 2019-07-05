import express, { Request, Response } from "express";
import { User, IUserModel} from "../models/user";
import { IUserRequest } from "../interfaces/IUserRequest";
import { auth } from "../middlewares/auth";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post('/users', async function(req: Request, res: Response): Promise<void> {
    const user: IUserModel = new User(req.body)

    try {
		const token: string = await user.generateAuthToken(); // User is saved in this function
        res.status(201).send({ user: user, token})
    } catch(error) {
        res.status(400).send(error)
    }
});

router.post('/users/login', async function(req: IUserRequest, res: Response): Promise<void> {
    try {
		const user: IUserModel | null = await User.findOne({email: req.body.email})
        if (!user) {
            throw new Error('Either the email or password provided was incorrect')
        }
		const isMatch: boolean = await bcrypt.compare(req.body.password, user.password)

		if (isMatch) {
			const token = await user.generateAuthToken()
			res.send({ user, token })
		} else {
			throw new Error('Either the email or password provided was incorrect')
		}
    } catch(error) {
        res.status(400).send(error)
    }
});

router.post('/users/logout', auth, async function(req: IUserRequest, res: Response): Promise<void> {
	try {
        // req.user and req.token is provided by auth middleware
        if (!req.user || !req.user.tokens) {
            throw new Error('User is not logged in')
        }
        
		req.user.tokens = req.user.tokens.filter((token: any) => {
			return token.token !== req.token
		})
		await req.user.save()

		res.send()
	} catch(error) {
		res.status(500).send()
	}
});

router.post('/users/logoutAll', auth, async function(req: IUserRequest, res: Response): Promise<void> {
	try {
        if (!req.user) {
            throw new Error('User is not logged in')
        }

		req.user.tokens = []
		await req.user.save()

		res.send()
	} catch(error) {
		res.status(500).send()
	}
});

router.get('/users/me', auth, async function(req: IUserRequest, res: Response): Promise<any> {
	try {
		res.send(req.user)
	} catch(error) {
		res.status(401).send()
	}
});	

// router.get('/users/:id', async function(req: Request, res: Response): Promise<any> {
// 	const _id: string = req.params.id

// 	try {
// 		const user = await User.findById(_id)
// 		if (!user) {
// 			return res.status(404).send()
// 		}
// 		res.send(user)
// 	} catch(error) {
// 		res.status(500).send()
// 	}
// });

router.patch('/users/me', auth, async function(req: IUserRequest, res: Response): Promise<any> {
	const updates: string[] = Object.keys(req.body)
	const allowedUpdates: string[] = ['firstName', 'lastName', 'email', 'password', 'age']
	const isValidUpdate: boolean = updates.every((update: string) => allowedUpdates.includes(update))

	if (!isValidUpdate) {
		return res.status(400).send({ error: 'Invalid update' })
	}

	try {
		const user: IUserModel | undefined | any = req.user // Try and fix errors when any is removed later
		if (!user) {
			return res.status(404).send()
		}
		updates.forEach(function(updateValue: string) {
			user[updateValue] = req.body[updateValue]
		})

		await user.save()
		res.send(user)
	} catch(error) {
		res.status(400).send(error)
	}
});

router.delete('/users/me', auth, async function(req: IUserRequest, res: Response): Promise<any> {
	try {
		if (!req.user) {
			return res.status(400).send('No user found')
		}

		await req.user.remove()
		res.send(req.user)
	} catch(error) {
		res.status(500).send()
	}
});

export default router;