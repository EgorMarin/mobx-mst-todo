import React, { useState } from 'react'
import {ITodo} from '../Store'
import { StoreInstance } from '../Store'

interface ITodoList extends ITodo {
  editTodo: (changedTitle: string) => void
}

interface TodoListProps {
  todo: ITodoList
  store: StoreInstance
}

const TodoList: React.FC<TodoListProps> = ({todo, store}) => {
  const [toggle, setToggle] = useState<boolean>(false)
  const [changedTitle, setChangedTitle] = useState<string>('')
  const [changedTodoId, setChangedTodoId] = useState<number | null>(null)

  const cls: any = []
  if (todo.completed) {cls.push('completed')}

  const onEditTodo = () => {
    setToggle(!toggle)
    setChangedTodoId(todo.id)
    if(changedTitle) {
      todo.editTodo(changedTitle)
    }
    setChangedTitle('')
  }

  return (
    <li key={todo.title}>
      <div className={cls.join('')}>
        <input 
          type="checkbox"
          checked={todo.completed}
          onChange={() => store.onComplete(todo.id)}
        />
        {toggle && changedTodoId === todo.id
          ? <input 
            value={changedTitle} 
            onChange={e => setChangedTitle(e.target.value)} 
            placeholder={todo.title}
            />
          : <span>{todo.title}</span>
        }    
      </div>
      <div>
        <i onClick={onEditTodo}>Edit</i>
        <i onClick={() => store.onDelete(todo.id)} style={{color: 'red'}}>X</i>
      </div>
    </li>
  ) 
}

export default TodoList
