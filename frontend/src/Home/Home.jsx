import React, { useEffect } from 'react'
import Homesec1 from './Homesec1'
import Homesec2 from './Homesec2'
import Homesec3 from './Homesec3'
import Homesec4 from './Homesec4'
import Homesec5 from './Homesec5'

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div >
      <Homesec1 />
      <Homesec2 />
      <Homesec3 />
      <Homesec4 />
      <Homesec5 />
       
    </div>
    
  )
}

export default Home