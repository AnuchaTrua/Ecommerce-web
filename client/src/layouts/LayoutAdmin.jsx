import React from 'react'
import { Outlet } from 'react-router-dom'
import SidebarAdmin from '../components/admin/SIdebarAdmin'
import HeaderbarAdmin from '../components/admin/HeaderbarAdmin'

const LayoutAdmin = () => {
  return (
    <div className='flex h-screen'>
      <SidebarAdmin />
      <div className='flex flex-col flex-1'>

      
        <HeaderbarAdmin />
        
        <main className='flex-1 p-6 overflow-y-auto bg-gray-100'>
          <Outlet />
        </main>
        
      </div>
    </div>
  )
}

export default LayoutAdmin
