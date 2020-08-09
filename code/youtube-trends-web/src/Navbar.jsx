import React, { useEffect, useState } from "react";
import { Navbar, Nav } from 'react-bootstrap';
import "./CSS/bootstrap.css";
import Cookies from "universal-cookie";
import { url } from "./App.jsx"

function NavBar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        let cookies = new Cookies()

        if (cookies.get('user_name') && cookies.get('user_id')) {
            setIsAuthenticated(true)
        }
    })

    return (
        <Navbar bg="light" variant="light" expand="lg" fixed="top">
            <Navbar.Brand href="/">Youtube Trends</Navbar.Brand>
            <Nav className="ml-auto">
                <Nav.Link href="/videos">Videos</Nav.Link>
                <Nav.Link href="/playlist">Playlist</Nav.Link>
                {!isAuthenticated && <Nav.Link href={url + "/login"}>Login</Nav.Link>}
            </Nav>
        </Navbar>
    );
}

export default NavBar;
