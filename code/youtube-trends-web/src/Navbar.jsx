import React from "react";
import { Navbar, Nav } from 'react-bootstrap';
import "./CSS/bootstrap.css";
import axios from 'axios';
import Cookies from 'universal-cookie';

const url = "http://127.0.0.1:5000"
const cookies = new Cookies();

function setLoginCookie(response) {
    cookies.set('login_user_id', response.user_id, { path: '/', expires: 86400 });
    cookies.set('login_family_name', response.family_name, { path: '/', expires: 86400 });
}

function NavBar() {
    function login() {
        axios.get(url + "/login")
            .then(response => setLoginCookie(response.data))
            .catch(err => console.error(err))
    }

    return (
        <Navbar bg="light" variant="light" expand="lg" fixed="top">
            <Navbar.Brand href="/">Youtube Trends</Navbar.Brand>
            <Nav className="ml-auto">
                <Nav.Link href="/videos">Videos</Nav.Link>
                <Nav.Link href="/playlist">Playlist</Nav.Link>
                <Nav.Link onClick={() => login()}>Login</Nav.Link>
            </Nav>
        </Navbar>
    );
}

export default NavBar;
