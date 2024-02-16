let allTodos = [
	{
		id: 1,
		title: 'Todo title 1',
		description: 'Todo description 1',
		completed: false,
	},
	{
		id: 2,
		title: 'Todo title 2',
		description: 'Todo description 2',
		completed: true,
	},
];

const localSavedTodos = JSON.parse(localStorage.getItem('todos'));

if (!localSavedTodos) {
	localStorage.setItem('todos', JSON.stringify(allTodos));
} else {
	allTodos = localSavedTodos;
}

function saveTodosInLocalStorage(todos) {
	localStorage.setItem('todos', JSON.stringify(todos));
}

function getIdFromButton(btnId) {
	return Number(btnId.match(/\d+/).join(''));
}

let filterType = 'all';
let mode = 'add';

const todosContainer = document.querySelector('.all-todos_container');
const headerActions = document.querySelector('.header-actions');

function renderScreen(todos) {
	todosContainer.innerHTML = '';

	for (let todo of todos) {
		todosContainer.innerHTML += `<div class="todo">
                                        <div class="todo-text">
                                            <input
												id='${todo.id}'
											   	type="checkbox"
												onchange='handleTodoUpdate(this)' 
											   	${todo.completed && 'checked'} 
											/>
                                            <label 
												class="todo-text_content" 
												for="${todo.id}">
													${todo.title}
													<span>${todo.description}</span>
											</label>
                                        </div>
                                        <div class="todo-actions">
                                            <button>
												<iconify-icon 
													id='delete${todo.id}' 
													icon="ph:trash" 
													width="24" 
													height="24" 
													style="color: red">
												</iconify-icon>
											</button>
                                            <button>
												<iconify-icon 
													id='edit${todo.id}' 
													icon="fa-regular:edit" 
													width="20" 
													height="20">
												</iconify-icon>
											</button>
                                            <button>
												<iconify-icon 
													id="show${todo.id}"
													icon="tabler:eye" 
													width="24" 
													height="24"  
													style="color: #062c9d">
												</iconify-icon>
											</button>
                                        </div>
                                    </div>`;
	}
}

renderScreen(allTodos);

headerActions.addEventListener('click', function (event) {
	if (event.target.tagName === 'LABEL') {
		const currentFilterBtn = event.target;
		filterType = currentFilterBtn.getAttribute('data-type');

		if (filterType === 'all') {
			renderScreen(allTodos);
		} else if (filterType === 'active') {
			const filteredTodos = allTodos.filter((todo) => !todo.completed);
			renderScreen(filteredTodos);
		} else {
			const filteredTodos = allTodos.filter((todo) => todo.completed);
			renderScreen(filteredTodos);
		}
	}
});

function handleTodoUpdate(input) {
	const currentTodo = allTodos.find((todo) => todo.id.toString() === input.id);
	currentTodo.completed = input.checked;
	saveTodosInLocalStorage(allTodos);
}

const allTodosContainer = document.querySelector('.all-todos_container');
const modal = document.querySelector('.modal');
const modalTodo = document.querySelector('.modal-todo_content');
let id;

allTodosContainer.addEventListener('click', function (event) {
	if (event.target.id.includes('delete')) {
		id = getIdFromButton(event.target.id);
		allTodos = allTodos.filter((todo) => todo.id !== id);
		renderScreen(allTodos);
		saveTodosInLocalStorage(allTodos);
	} else if (event.target.id.includes('edit')) {
		id = getIdFromButton(event.target.id);
		const currentTodo = allTodos.find((todo) => todo.id === id);
		const titleInput = document.querySelector('#title');
		const descriptionInput = document.querySelector('#description');

		titleInput.value = currentTodo.title;
		descriptionInput.value = currentTodo.description;
		mode = 'edit';
		modal.showModal();
	} else if (event.target.id.includes('show')) {
		id = getIdFromButton(event.target.id);
		modalTodo.showModal();
		const currentTodo = allTodos.find((todo) => todo.id === id);
		modalTodo.children[0].children[0].innerHTML = currentTodo.title;
		modalTodo.children[1].innerHTML = currentTodo.description;
	}
});

const addTodoBtn = document.querySelector('.add-todo-btn');

addTodoBtn.addEventListener('click', function () {
	modal.showModal();
	mode = 'add';
});

function handleFormSubmit(form, e) {
	const data = new FormData(form);

	if (mode === 'add') {
		const newTodo = {
			id: localSavedTodos.length ? localSavedTodos.at(-1).id + 1 : 1,
			title: data.get('title-input'),
			description: data.get('description-input'),
			completed: false,
		};

		allTodos.push(newTodo);

		renderScreen(allTodos);
		saveTodosInLocalStorage(allTodos);
		modal.closeModal();
	} else if (mode === 'edit') {
		const currentTodo = allTodos.find((todo) => todo.id === id);
		currentTodo.title = data.get('title-input');
		currentTodo.description = data.get('description-input');

		renderScreen(allTodos);
		saveTodosInLocalStorage(allTodos);
		modal.closeModal();
	}
}
