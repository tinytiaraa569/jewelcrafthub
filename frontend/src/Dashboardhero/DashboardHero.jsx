import React from 'react';
import Dashboardherosec1 from './Dashboardherosec1';
import Dashboardherosec2 from './Dahboardherosec2';
import Dashboardherosec3 from './Dashboardherosec3';
import Dashboardherosec4 from './Dashboardherosec4';
import Dashboarduploadsshort from './Dashboarduploadsshort';
import Dashboardwithdrawal from './Dashboardwithdrawal';

const DashboardHero = () => {
  return (
    <div className="bg-background">
      <Dashboardherosec1 />

      <div className="flex flex-col lg:flex-row gap-6 px-4 w-full lg:ml-2 !overflow-hidden">
        <div className="w-[98%] xl:w-1/2">
          <Dashboardherosec2 />
        </div>
        <div className="w-[98%] xl:w-1/2">
          <Dashboardherosec3 />
        </div>
      </div>


      <div className='px-4 my-5 lg:ml-2'>
        <Dashboardherosec4 />
      </div>


      <div className="flex flex-col lg:flex-row gap-6 px-4 w-full lg:ml-2 !overflow-hidden">
      <div className="w-[98%] xl:w-1/2">
          <Dashboarduploadsshort />
        </div>

        <div className="w-[98%] xl:w-1/2">
          <Dashboardwithdrawal />
        </div>

      </div>


    </div>
  );
};

export default DashboardHero;
