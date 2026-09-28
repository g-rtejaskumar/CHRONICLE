import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

export default function Protected({children, authentication = true}) {

    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector(state => state.auth.status)

    useEffect(() => {
        if(authentication && authStatus !== authentication){
            navigate("/login")
        } else if(!authentication && authStatus !== authentication){
            navigate("/")
        }
        setLoader(false)
    }, [authStatus, navigate, authentication])

  return loader ? (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="relative flex h-14 w-14 items-center justify-center">
        <span className="pulse-ring absolute h-14 w-14 rounded-full border border-violet-400/60" />
        <span className="h-3.5 w-3.5 animate-ping rounded-full bg-gradient-to-br from-violet-400 to-cyan-300" />
      </div>
    </div>
  ) : (
    <>{children}</>
  );
}
