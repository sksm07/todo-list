import React, {useEffect, useState} from "react"
import { NavLink, useLocation } from "react-router"
import styles from "./Header.module.css"
function Header() {
    const location = useLocation();
    const [title, setTitle] = useState("");

    useEffect(() => {
        if (location.pathname === "/") {
        setTitle("Todo List");
        } else if (location.pathname === "/about") {
        setTitle("About");
        } else {
        setTitle("Not Found");
        }
    }, [location]);
    
    return (
        <header className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
            <nav className={styles.nav}>
                <NavLink 
                    to="/"
                    className={({isActive})=> (isActive? styles.active : styles.inactive)}
                >Home</NavLink>
                <NavLink
                    to="/about"
                    className={({isActive})=>(isActive? styles.active: styles.inactive)}
                >
                    About
                </NavLink>
            </nav>
        </header>
    )
}

export default Header;