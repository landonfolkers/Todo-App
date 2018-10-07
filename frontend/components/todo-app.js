import React from 'react';
import FetchApi from '../fetch-api';
import '../App.css';

const ENTER_KEY_CODE = 13;

export default class TodoApp extends React.Component {
	state = {
		todos: [],
		newText: '',
		finished: []
	};

	constructor(props) {
		super(props);
		this.getTodos();
	}

	getTodos = () => {
		return FetchApi
			.get('/todo')
			.then(todos => {
				let ongoing = []
				let done = []
					todos.map(todo => {
					if (todo.finished === false) {
						ongoing.push(todo)
						this.setState({
							todos: ongoing
						})
					} else if (todo.finished === true) {
						done.push(todo)
						this.setState({
							finished: done
						})
					}
				})
			})
			.catch(() => alert('There was an error getting todos'));
	};

	createTodo = () => {
		FetchApi
			.post('/todo', {
				text: this.state.newText
			})
			.then((newTodo) => {
				const newTodos = Array.from(this.state.todos);
				newTodos.push(newTodo);
				this.setState({
					todos: newTodos,
					newText: ''
				});
			})
			.catch(() => alert('There was an error creating the todo'));
	};

	updateTodo = (id) => {
		FetchApi
			.put(`/todo/${id}`, { 
				finished: true 
			})
			.then(() => {
				const updatedTodos = Array.from(this.state.todos);
				const todoIndex = updatedTodos.findIndex(todo => todo.id.toString() === id.toString());
				updatedTodos.splice(todoIndex, 1);
				this.setState({
					todos: updatedTodos
				});
				this.getTodos()
			})
			.catch(() => alert('There was an error updating the todo'));
	};

	handleDeleteRequest = (id) => {
		FetchApi
			.delete(`/todo/${id}`)
			.then(() => {
				const newTodos = Array.from(this.state.todos);
				const todoIndex = newTodos.findIndex(todo => todo.id.toString() === id.toString());
				newTodos.splice(todoIndex, 1);
				this.setState({
					todos: newTodos
				});
			})
			.catch(() => alert('Error removing todo'));
	};

	handleChange = e => {
		this.setState({
			newText: e.target.value
		});
	};

	handleKeyDown = e => {
		if (e.keyCode !== ENTER_KEY_CODE) return;
		this.createTodo();
	};

	render() {
		return ( 
			<div>
				<div className = "todo" >
					<div>
						<div>
							<h1>Todos</h1> 
							<h3>Add New Task</h3>
							<input type="text" autoFocus onChange = {
							this.handleChange
						}
							onKeyDown = {
							this.handleKeyDown
						}
							placeholder = ""
							value = {
							this.state.newText
						}
						/> 
						</div>
						<div className="list">
						<h3>Unfinished Tasks</h3>
						<ul> {
							this.state.todos.map(todo => (<li key = {
							todo.id
						} >
						<div className = "view" >
							<label > {
							todo.text
						} </label> 
						<button className='delete' onClick = {
							() => this.handleDeleteRequest(todo.id)
						} > Remove Todo </button> 
						<button className='update' onClick = {
							() => this.updateTodo(todo.id)
						} > Mark Finished </button> 
						</div> 
							</li>
						))
						} </ul> 
						</div>
					</div>
					<div>
						<h2>Finished</h2> 
						<ul> {
							this.state.finished.map(done => (<li key = {
							done.id
						} >
						<div className = "view" >
							<label > {
							done.text
							} </label>
						</div> 
						</li>
						))
					} </ul> 
					</div>
				</div>
				<div className="image">
					<img src='./assets/logo.png' />
				</div>
			</div>
		);
	}
}