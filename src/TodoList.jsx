import TodoListItem from "./TodoListItem"

function TodoList({todos, onCompleteTodo}) {

   const filteredTodoList = todos.filter(todo=> !todo.isCompleted);
    
    return (
        <>
          {filteredTodoList.length === 0 ? 
           <p>Add todo above to get started</p> : 
           <ul>{filteredTodoList.map(todo => <TodoListItem todo={todo} key={todo.id} onCompleteTodo={onCompleteTodo} />)}</ul>
          }
        </>
    )
}

export default TodoList