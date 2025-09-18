import { useRef, useState } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";
import styled from "styled-components";

function TodoForm({onAddTodo, isSaving}) {

    const todoTitleInput = useRef("");
    const [workingTodoTitle, setWorkingTodoTitle] = useState("");

    function handleAddTodo(event) {
        event.preventDefault();
        onAddTodo(workingTodoTitle);
        setWorkingTodoTitle("");
        todoTitleInput.current.focus();
    }

    return (

        <StyledForm onSubmit={handleAddTodo}>
            <TextInputWithLabel                
                elementId="todoTitle"
                labelText="Todo"
                ref={todoTitleInput} 
                value={workingTodoTitle} 
                onChange={(event)=>setWorkingTodoTitle(event.target.value)}
            />
            <StyledButton type="submit" disabled={workingTodoTitle==="" ? true:false}>
                {isSaving ? "Saving..." : "Add Todo"}
            </StyledButton>
        </StyledForm>
    )
}

export default TodoForm

const StyledForm = styled.form`
  display: flex;
  gap: 0.6rem;      
  padding: 0.6rem; 
`;

const StyledButton = styled.button`
  padding: 0.5em 1em;
  border-radius: 6px;
  border: none;
  cursor: pointer;

  &:disabled {
    font-style: italic; 
    cursor: not-allowed;
  }
`;