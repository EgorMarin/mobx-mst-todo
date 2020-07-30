import React, { useContext, useState } from "react";
import { Context } from "./index";
import { observer } from "mobx-react";

const App = () => {
  const store = useContext(Context)
  const [title, setTitle] = useState('')
  const [toggle, setToggle] = useState(false)
  const [changedTitle, setChangedTitle] = useState('')
  const [changedTodoId, setChangedTodoId] = useState(null)

  const addTodoHandler = () => {
    if(title) {store.addTodo({id: Date.now(), title, completed: false})}
    setTitle('')
  }
  const onComplete = (id) => store.onComplete(id)
  const onDelete = (id) => store.onDelete(id)
  const onKeyEnterAdd = (e) => {if(e.key === 'Enter') {addTodoHandler()}} 
  const getUncompletedTasks = () => store.unCompletedTasks(false)
  const saveTodos = () => {
    store.saveTodos(store.todos)
    alert('Ваши данные сохранены')
  }
  const getTodos = () => store.getTodos()

  return (
    <div className='todo'>
      <div className='todo-header'>
        <h3>Count of tasks: {store.countTasks}</h3>
        <h3>Completed: {store.completedTasks}</h3>
        <h3>Uncompleted: {getUncompletedTasks()}</h3>
      </div>

      <div className='todo-list'>
        {store.isLoading 
        ? <h2>...loading</h2>
        : <ul>
          {store.todos.map(todo => {
            const cls = []
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
              <li key={todo.id}>
                <div className={cls}>
                  <input 
                    id={todo.id}
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onComplete(todo.id)}
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
                  <i onClick={() => onDelete(todo.id)} style={{color: 'red'}}>X</i>
                </div>
              </li>
            )   
          })}
        </ul>}
      </div>

      <div className="todo-input">
        <input 
          type="text"
          placeholder="Название TODO"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={(e) => onKeyEnterAdd(e)}
        />
        <div className="todo-input-buttons">
          <button onClick={addTodoHandler}>Добавить</button>
          <div>
            <button onClick={() => saveTodos()}>Сохранить TODO</button>
            <button onClick={() => getTodos()}>Загрузить TODO</button>
          </div>
          <button onClick={() => store.fetchFakeTodos()}>Загрузить fake todo</button>
        </div>
      </div>  
    </div>
  );
}

export default observer(App)