import { useRef, useState } from "react";

function TodoForm({onAddTodo}) {

    const todoTitleInput = useRef("");
    const [workingTodoTitle, setWorkingTodoTitle] = useState("");

    function handleAddTodo(event) {
        event.preventDefault();
        onAddTodo(workingTodoTitle);
        setWorkingTodoTitle("");
        todoTitleInput.current.focus();
    }

    return (

        <form onSubmit={handleAddTodo}>
            <label htmlFor="todoTitle">Todo</label>
            <input 
              id="todoTitle" 
              name="title" ref={todoTitleInput} 
              value={workingTodoTitle} type="text"
              onChange={(event)=>setWorkingTodoTitle(event.target.value)}
            />
            <button type="submit" disabled={workingTodoTitle==="" ? true:false}>Add Todo</button>
        </form>
    )
}

export default TodoForm