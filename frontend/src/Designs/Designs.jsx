import React, { useEffect } from 'react'
import Designsec1 from './Designsec1'
import Designsec2 from './Designsec2'
import DesignsFaq from './DesignsFaq'
import Homesec5 from '@/Home/Homesec5'

const Designs = () => {
   useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  return (
    <div>
      <Designsec1 />
      <Designsec2 />
      <DesignsFaq />
      <Homesec5 />
    </div>
  )
}

export default Designs