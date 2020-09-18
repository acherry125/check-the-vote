import React from 'react';
import NavigationLink from "./NavitgationLink";


export const Navegation = () => {





  return (
      <nav>
        <h1 className="logo"><a className="logo-link"href="#">Check The Vote</a></h1>
        <ul className="nav-list">
          < NavigationLink link="#" name="Senate"/>
          < NavigationLink link="#" name="House"/>
          < NavigationLink link="#" name="About"/>
        </ul>
      </nav>
  );
};

export default Navegation;
