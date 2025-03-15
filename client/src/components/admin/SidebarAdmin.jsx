import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard } from 'lucide-react';

const SidebarAdmin = () => {
  return (
    <div className='flex flex-col h-screen text-white bg-gray-800 w-60'>
      <div className='flex items-center justify-center h-20 font-bold bg-black text-2x1'>
        Admin Panel
      </div>

      <nav className='flex-1 px-4 py-2 space-y-2'>
        {/* first nav menu */}
        <NavLink 
        to={'/admin'}
        end
        className={({isActive})=> isActive ? "bg-gray-900 text-white hover:bg-gray-700 flex items-center px-4 py-2 rounded" : "text-grey-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"}>
            <LayoutDashboard className='mr-2'/>
            
            Dashboard
        </NavLink>
        
        {/* second nav menu */}
        <NavLink 
        to={'manage'}
        className={({isActive})=> isActive ? "bg-gray-900 text-white hover:bg-gray-700 flex items-center px-4 py-2 rounded" : "text-grey-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"}>
            <LayoutDashboard className='mr-2'/>
            
            manage
        </NavLink>

        {/* third nav menu */}
        <NavLink 
        to={'category'}
        className={({isActive})=> isActive ? "bg-gray-900 text-white hover:bg-gray-700 flex items-center px-4 py-2 rounded" : "text-grey-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"}>
            <LayoutDashboard className='mr-2'/>
            
            Category
        </NavLink>

        {/* fourth nav menu */}
        <NavLink 
        to={'product'}
        className={({isActive})=> isActive ? "bg-gray-900 text-white hover:bg-gray-700 flex items-center px-4 py-2 rounded" : "text-grey-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"}>
            <LayoutDashboard className='mr-2'/>
            
            Product
        </NavLink>

        
      </nav>

      <div>
      <NavLink 
        
        className={({isActive})=> isActive ? "bg-gray-900 text-white hover:bg-gray-700 flex items-center px-4 py-2 rounded" : "text-grey-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"}>
            <LayoutDashboard className='mr-2'/>
            
            Log out
        </NavLink>
      </div>
    </div>
  )
}

export default SidebarAdmin
