import React from "react";
import { Navbar, Nav } from 'react-bootstrap';
import "./CSS/bootstrap.css";

function NavBar() {
    return (
        <Navbar bg="light" variant="light" expand="lg" fixed="top">
            <Navbar.Brand href="/">Youtube Trends</Navbar.Brand>
            <Nav className="ml-auto">
                <Nav.Link href="/videos">Videos</Nav.Link>
                <Nav.Link href="/playlist">Playlist</Nav.Link>
            </Nav>
        </Navbar>
    );
}

export default NavBar;
