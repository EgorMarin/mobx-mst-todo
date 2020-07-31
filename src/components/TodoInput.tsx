import React, { useState } from 'react'
import { StoreInstance } from '../Store'

interface TodoInputProps {
  store: StoreInstance
}

const TodoInput: React.FC<TodoInputProps> = ({store}) => {
  const [title, setTitle] = useState<string>('')

  const onAdd = () => {
    if(title) {
      store.addTodo({id: Date.now(), title, completed: false})
      setTitle('')
    }
  }

  const onKeyPressHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') onAdd()
  }

  const saveTodos = () => {
    store.saveTodos(store.todos)
    alert('Ваши данные сохранены')
  }
  const getTodos = () => store.getTodos()
  const fetchFakeTodos = () => store.fetchFakeTodos()

  return (
    <div className="todo-input">
      <input 
        type="text"
        placeholder="Название TODO"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyPress={(e) => onKeyPressHandler(e)}
      />
      <div className="todo-input-buttons">
        <button onClick={onAdd}>Добавить</button>
        <div>
          <button onClick={saveTodos}>Сохранить todo</button>
          <button onClick={getTodos}>Загрузить todo</button>
        </div>
        <button onClick={fetchFakeTodos}>Загрузить fake todos</button>
      </div>
    </div>
  )
}

export default TodoInput
