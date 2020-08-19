import React from 'react';
import NavigationLink from "./NavitgationLink";


export const Navegation = () => {





  return (
      <nav>
        <h1>Check The Vote</h1>
        <ul className="nav-list">
          < NavigationLink link="#" name="Senate"/>
          < NavigationLink link="#" name="House"/>
          < NavigationLink link="#" name="About"/>
        </ul>
      </nav>
  );
};

export default Navegation;
