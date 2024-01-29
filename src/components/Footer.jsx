import React from 'react';
import '../styles/Footer.scss';

export default function Footer() {

  var date = new Date().getFullYear();
  return (
    <footer>
      <div>
        <p> Created by Software Eng. Noami Costa </p>
        <p> All rights reserved ({date}) </p>
      </div>
    </footer>
  )
}
