import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ProtectedRouter = ({ children, isUserLoggedIn }) => {
    const navigate = useNavigate("/admin/login");
    useEffect(() => {
        !isUserLoggedIn && navigate('/admin/login');
    }, [isUserLoggedIn]);
  return (
    <>
        { children }
    </>
  )
}

export default ProtectedRouter