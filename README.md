# Todo API [![Build Status](https://travis-ci.com/brady-miller/todo-api.svg?branch=master)](https://travis-ci.com/brady-miller/todo-api) [![dependencies Status](https://david-dm.org/brady-miller/todo-api/status.svg)](https://david-dm.org/brady-miller/todo-api)

Todo API is a simple task managing web app using a REST API.

## Installation

Clone the github repo using git clone

```bash
git clone https://github.com/brady-miller/todo-api.git
```

Then run npm install to install all needed dependencies

```bash
npm install
```

## Usage

* Compiling code - `npm run build`
* Runs local server with hot reloading - `npm run dev`
* Starts the server in production mode - `npm run start`
* Runs all tests - `npm run test`

## Routes

| Method | Route            | Description                 | Auth Required |
| ------ | ---------------- | --------------------------- | ------------- |
| POST   | /users           | Creates a user (Signup)     | No            |
| POST   | /users/login     | Log into a user (Login)     | Yes           |
| POST   | /users/logout    | Logs out of user (Logout)   | Yes           |
| POST   | /users/logoutAll | Log out all users (Logout)  | Yes           |
| GET    | /users/me        | Gets user info (Profile)    | Yes           |
| PATCH  | /users/me        | Changes user info (Edit)    | Yes           |
| DELETE | /users/me        | Deletes user/todos (Delete) | Yes           |
| POST   | /todos           | Creates a new todo (Create) | Yes           |
| GET    | /todos           | Gets all user todos (View)  | Yes           |
| GET    | /todos/:id       | Gets a specific todo (View) | Yes           |
| PATCH  | /todos/:id       | Edit a specific todo (Edit) | Yes           |
| DELETE | /todos/:id       | Delete a user todo (Delete) | Yes           |
| DELETE | /todos/all       | Delete all todos (Delete)   | Yes           |

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[Apache-2.0](https://choosealicense.com/licenses/apache-2.0/)
