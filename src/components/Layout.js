import React, { useState } from 'react';
import NavBar from './NavBar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const [search, setSearch] = useState('');

  return (
    <>
      <NavBar search={search} setSearch={setSearch} />
      <Outlet context={{ search, setSearch }} />
    </>
  );
};

export default Layout;
