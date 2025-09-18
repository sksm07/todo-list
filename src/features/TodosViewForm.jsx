import { useState, useEffect } from "react";
import styled from "styled-components";

function TodosViewForm ({sortDirection, setSortDirection, 
                        sortField, setSortField, queryString, setQueryString}) {
    function preventRefresh(event){
        event.preventDefault()
    }
    
    const [localQueryString, setLocalQueryString] = useState(queryString);
    
    useEffect(() => {
        const debounce = setTimeout(()=>{
            setQueryString(localQueryString)
        }, 500)
        
        return ()=>{clearTimeout(debounce)}
    },[localQueryString, setQueryString])

    return (
        <StyledForm onSubmit={preventRefresh}>
            <div>
                <label>
                    Search todos
                    <StyledInput 
                        type="text" 
                        value={localQueryString} 
                        onChange={(e)=>{setLocalQueryString(e.target.value)}}
                    ></StyledInput>
                </label>
                <StyledButton type="button" onClick={()=>setLocalQueryString("")}>Clear</StyledButton>
            </div>
            <div>
                <label>
                    Sort by
                    <StyledSelect onChange={(event)=>{setSortField(event.target.value)}} value={sortField}>
                        <option value="title">Title</option>
                        <option value="createdTime">Time added</option>
                    </StyledSelect>
                </label>
                <label>
                    Direction
                    <StyledSelect onChange={(event)=>{setSortDirection(event.target.value)}}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </StyledSelect>
                </label>
            </div>
        </StyledForm>
    )
}

export default TodosViewForm;

const StyledForm = styled.form`
  padding: 0.5rem;  
  display: flex;
  flex-direction: column;
  gap: 0.5rem;      
`;

const StyledInput = styled.input`
  padding: 0.25rem;
`;

const StyledSelect = styled.select`
  padding: 0.25rem;
`;

const StyledButton = styled.button`
  padding: 0.25rem;
`;