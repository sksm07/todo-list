import TodoListItem from "./TodoListItem"

function TodoList({loadingStatus, todos, onCompleteTodo, onUpdateTodo}) {

   const filteredTodoList = todos.filter(todo=> !todo.isCompleted);
    
    return (
        <>
          {filteredTodoList.length === 0 ? 
             loadingStatus ? <p>Todo list loading...</p> : <p>Add todo above to get started</p>
              : 
             <ul>
               {filteredTodoList.map(todo => 
                  <TodoListItem 
                      key={todo.id} 
                      todo={todo} 
                      onCompleteTodo={onCompleteTodo} 
                      onUpdateTodo={onUpdateTodo} />)
                }
             </ul>
          }
        </>
    )
}

export default TodoList