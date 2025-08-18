import { useRef, useState } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";

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
            <TextInputWithLabel
                type="text"
                elementId="todoTitle"
                labelText="Todo"
                ref={todoTitleInput} 
                value={workingTodoTitle} 
                onChange={(event)=>setWorkingTodoTitle(event.target.value)}
            />
            <button type="submit" disabled={workingTodoTitle==="" ? true:false}>Add Todo</button>
        </form>
    )
}

export default TodoForm