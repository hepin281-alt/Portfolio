import React from 'react';

function Header({ name, title, themeColor }) {
  return (
    <header className="header" style={themeColor ? { background: themeColor } : {}}>
      <h1>{name}</h1>
      <p>{title}</p>
    </header>
  );
}

export default Header;
