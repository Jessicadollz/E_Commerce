import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const PublicRouter = ({ children, isUserLoggedIn }) => {
    const navigate = useNavigate();
    useEffect(() => {
        isUserLoggedIn && navigate('/admin/dashboard');
    }, [isUserLoggedIn]);
  return (
    <>
        { children }
    </>
  )
}

export default PublicRouter