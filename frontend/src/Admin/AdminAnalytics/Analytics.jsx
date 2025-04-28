import React from 'react'
import Analyticsliveuser from './Analyticsliveuser'
import AnalyticsVisitor from './AnalyticsVisitor'
import Analyticspageviews from './Analyticspageviews'

const Analytics = () => {
  return (
    <div>
       <div className="overflow-hidden flex flex-col lg:flex-row gap-2 px-4 md:px-4 lg:px-4 py-5 w-full ml-1">
        {/* Chart Section */}
        <div className="w-full lg:w-[48%]">
        <Analyticsliveuser />
        </div>

        <div className="w-full lg:w-[48%]">

        <AnalyticsVisitor />
        </div>
    </div>

    <div className="!overflow-hidden flex flex-col lg:flex-row gap-2 px-2 md:px-2 lg:px-2 py-2 w-full ml-1 ">
    <div className="w-full lg:w-[55%]">
      <Analyticspageviews />

    </div>

    <div className="w-full lg:w-[38%]">
    </div>


    </div>
    </div>

  )
}

export default Analytics