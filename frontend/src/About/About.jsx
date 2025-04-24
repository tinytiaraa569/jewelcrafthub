import React, { useEffect } from 'react'
import Aboutsec1 from './Aboutsec1'
import Aboutsec2 from './Aboutsec2'
import Aboutsec3 from './Aboutsec3'
import Aboutsec4 from './Aboutsec4'
import Homesec5 from '@/Home/Homesec5'

const About = () => {
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  return (
    <div >
       <Aboutsec1 />
       <Aboutsec2 />
       <div className="bg-[#ecf3f2] bg-gradient-to-br from-[#ecf3f2] via-white to-[#ecf3f2]">
       <Aboutsec3 />
       </div>
       
       <Aboutsec4 />

       <Homesec5 />

    </div>
  )
}

export default About