import React from 'react';

import './Header.css';
import Logo from './logo.jpeg'

const Header = () => {
    return (
      <header>
        <img src={Logo} alt="fancy logo"/><h1>Foto<span>box</span></h1>
      </header>
    )
}

export default Header;
