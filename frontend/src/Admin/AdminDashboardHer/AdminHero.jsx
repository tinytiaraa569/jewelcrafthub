import React from 'react';
import { HeroSec1 } from './Herosec1';
import Adminhero2 from './Adminhero2';
import Adminrecentsupload from './Adminrecentsupload';
import AdminuserTracking from './AdminuserTracking';
import AdminAlldesignreport from './AdminAlldesignreport';
import Adminwithdrawalreport from './Adminwithdrawalreport';

const AdminHero = () => {

  return (
    <div className="bg-background w-full overflow-x-hidden">
      <HeroSec1 />

      <div className="flex flex-col lg:flex-row gap-2 px-4 md:px-4 lg:px-4 py-4 w-full">
        {/* Chart Section */}
        <div className="w-full lg:w-[60%]">
          <Adminhero2 />
        </div>

        {/* Side Section */}
        <div className="w-full lg:w-[39%]">
          <Adminrecentsupload />
        </div>
      </div>


      <div className='flex flex-col lg:flex-row gap-2 px-4 md:px-4 lg:px-4 py-4 w-full'>
      <div className="w-full lg:w-[100%]">
      <AdminuserTracking />
      </div>
      </div>


      <div className="flex flex-col lg:flex-row gap-2 px-4 md:px-4 lg:px-4 py-2 w-full ml-1">
        {/* Chart Section */}
        <div className="w-full lg:w-[48%]">
          <AdminAlldesignreport />
        </div>

        {/* Side Section */}
        <div className="w-full lg:w-[48%]">
          <Adminwithdrawalreport />
        </div>
      </div>


      
      
    </div>
  );
};

export default AdminHero;
