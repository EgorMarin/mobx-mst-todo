import {types, flow, applySnapshot, Instance, cast} from 'mobx-state-tree'
import axios from 'axios'

export interface ITodo {
  id: number
  title: string
  completed: boolean
}

//Model
const TodoModel = types.model('Todo', {
  id: types.number,
  title: types.string,
  completed: types.boolean
})
.actions(self => ({
  editTodo(title: string) {
    applySnapshot(self, {...self, title})
  }
}))

export const StoreModel = types.model('Store', {
  todos: types.array(TodoModel),
  isLoading: types.boolean
})
.actions(self => ({
  addTodo(todo: ITodo) {
    self.todos.push(todo)
  },
  onComplete(todoId: number) {
    self.todos.map(todo => {
      if(todo.id === todoId) {
        todo.completed = !todo.completed
      }
      return todo
    })
  },
  onDelete(todoId: number) {
    self.todos = cast(self.todos.filter(todo => todo.id !== todoId))
  },
  fetchFakeTodos: flow(function* fetchFakeTodos() {
    self.isLoading = true
    const {data} = yield axios.get('https://jsonplaceholder.typicode.com/todos')
    self.todos = data 
    self.isLoading = false   
  }),
  saveTodos(todos: ITodo[]) {
    localStorage.setItem('todos', JSON.stringify(todos))
  },
  getTodos() {
    self.todos = JSON.parse(localStorage.getItem('todos')!)
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
  unCompletedTasks(boolValue: boolean) {
    return self.todos.filter(todo => todo.completed === boolValue).length
  }
}))


//Instance
export const store = StoreModel.create({
  todos: [{id: 0, title: 'Прыгнуть с парашюта в Дубаи', completed: false}],
  isLoading: false
})

export type StoreInstance = Instance<typeof StoreModel>
