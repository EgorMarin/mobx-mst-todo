import {types, onSnapshot, getSnapshot, flow, applySnapshot} from 'mobx-state-tree'
import axios from 'axios'

//Model
const TodoModel = types.model('Todo', {
  id: types.number,
  title: types.string,
  completed: types.boolean
})
.actions(self => ({
  editTodo(title) {
    applySnapshot(self, {...self, title})
  }
}))

const StoreModel = types.model('Store', {
  todos: types.array(TodoModel),
  isLoading: types.boolean
})
.actions(self => ({
  addTodo(todo) {
    self.todos.push(todo)
  },
  onComplete(todoId) {
    self.todos.map(todo => {
      if(todo.id === todoId) {
        todo.completed = !todo.completed
      }
      return todo
    })
  },
  onDelete(todoId) {
    self.todos = self.todos.filter(todo => todo.id !== todoId)
  },
  fetchFakeTodos: flow(function* fetchFakeTodos() {
    self.isLoading = true
    const {data} = yield axios.get('https://jsonplaceholder.typicode.com/todos')
    self.todos = data 
    self.isLoading = false   
  }),
  saveTodos(todos) {
    localStorage.setItem('todos', JSON.stringify(todos))
  },
  getTodos() {
    self.todos = JSON.parse(localStorage.getItem('todos'))
  }
}))
.views(self => ({
  get countTasks() {
    return self.todos.length
  },
  get completedTasks() {
    return self.todos.filter(todo => todo.completed).length
  },
  //теряется мемоизация при передаче пар-ров => rerender
  unCompletedTasks(boolValue) {
    return self.todos.filter(todo => todo.completed === boolValue).length
  }
}))


//Instance
export const store = StoreModel.create({
  todos: [{id: 0, title: 'Прыгнуть с парашюта в Дубаи', completed: false}],
  isLoading: false
})

//делает снимок store при каждом его изменении
onSnapshot(store, (snapshot) => {
  console.log('snapshot', snapshot);
})

//вызывается один раз и показывает снимок store
const currentStore = getSnapshot(store)
console.log('currentStore', currentStore);