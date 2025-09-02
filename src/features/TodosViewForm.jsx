function TodosViewForm ({sortDirection, setSortDirection, 
                        sortField, setSortField, queryString, setQueryString}) {
    function preventRefresh(){
        event.preventDefault()
    }
    return (
        <form onSubmit={preventRefresh}>
            <div>
                <label>
                    Search todos
                    <input type="text" value={queryString} 
                        onChange={(e)=>{setQueryString(e.target.value)}}
                    ></input>
                </label>
                <button type="button" onClick={()=>setQueryString("")}>Clear</button>
            </div>
            <div>
                <label>
                    Sort by
                    <select onChange={(event)=>{setSortField(event.target.value)}} value={sortField}>
                        <option value="title">Title</option>
                        <option value="createdTime">Time added</option>
                    </select>
                </label>
                <label>
                    Direction
                    <select onChange={(event)=>{setSortDirection(event.target.value)}}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </label>
            </div>
        </form>
    )
}

export default TodosViewForm;