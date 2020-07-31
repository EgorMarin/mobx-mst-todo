import React, { useContext } from "react";
import { Context } from "./index";
import { observer } from "mobx-react";
import {Instance} from 'mobx-state-tree'
import TodoInput from "./components/TodoInput";
import { StoreModel } from "./Store";
import TodoList from "./components/TodoList";

const App = () => {
  const store = useContext<Instance<typeof StoreModel>>(Context)

  return (
    <div className='todo'>
      <div className='todo-header'>
        <h3>Count of tasks: {store.countTasks}</h3>
        <h3>Completed: {store.completedTasks}</h3>
        <h3>Uncompleted: {store.unCompletedTasks(false)}</h3>
      </div>

      <div className='todo-list'>
        {store.isLoading 
        ? <h2>...loading</h2>
        : <ul>
          {store.todos.map(todo => (
            <TodoList todo={todo} store={store}/>  
          ))}
        </ul>}
      </div>

      <TodoInput 
        store={store} 
      />
    </div>
  );
}

export default observer(App)