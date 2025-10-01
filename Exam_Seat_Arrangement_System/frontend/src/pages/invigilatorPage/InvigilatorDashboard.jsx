import React from 'react'
import InvDashboardStatus from '../../component/invigilator/InvDashboardStatus'

const InvigilatorDashboard = () => {
  return (
    <>
    <div className="h-full w-full border border-gray-300 bg-gray-100 p-6">
      <div className="w-full ">
        <InvDashboardStatus />
      </div>
    </div>
    </>
  )
}

export default InvigilatorDashboard