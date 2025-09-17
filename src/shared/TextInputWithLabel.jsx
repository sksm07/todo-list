import styled from "styled-components";

function TextInputWithLabel({
    elementId, 
    labelText,
    ref,
    value,
    onChange,
}) {
    return (
        <>
            <StyledLabel htmlFor={elementId}>{labelText}</StyledLabel>
            <StyledInput 
                type="text"
                id={elementId}
                ref={ref}
                value={value}
                onChange={onChange}
            />
        </>
    )
}

export default TextInputWithLabel;

const StyledLabel = styled.label`
  margin-right: 0.5rem; 
`;

const StyledInput = styled.input`
  padding: 0.25rem;  
  margin-bottom: 0.5rem;`;