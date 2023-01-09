import React from 'react';
import { Outlet } from 'react-router-dom';
import '../public/components/app.scss';
import { Navbar } from 'react-bootstrap';

export default function App() {
  return (
    <>
      <Navbar
        bg="dark"
        expand="lg"
        variant="dark"
        className="justify-content-center"
      >
        <Navbar.Brand href="/">Conferences</Navbar.Brand>
      </Navbar>
      <main>
        <Outlet />
      </main>
    </>
  );
}
