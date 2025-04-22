import React, { useEffect } from 'react'
import Contactsec1 from './Contactsec1'
import Contactsec2 from './Contactsec2';
import Homesec5 from '@/Home/Homesec5';

const Contact = () => {
    useEffect(() => {
          window.scrollTo(0, 0);
        }, []);
  return (
    <div>
        <Contactsec1 />
        <Contactsec2 />

        <Homesec5 />

    </div>
  )
}

export default Contact