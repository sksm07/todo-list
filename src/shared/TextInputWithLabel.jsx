function TextInputWithLabel({
    elementId, 
    labelText,
    ref,
    value,
    onChange,
}) {
    return (
        <>
            <label htmlFor={elementId}>{labelText}</label>
            <input 
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