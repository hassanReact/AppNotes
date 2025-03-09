// ProfileInfo.jsx
import React from "react"
import { getInitials } from "../../utils/helper"

const ProfileInfo = ({ onLogout, userInfo, isMobile }) => {
  return (
    <div className={`p-1 border rounded-[100px] flex items-center gap-2 sm:gap-3 ${isMobile ? 'w-full' : ''}`}>
      <div className="w-8 h-8 sm:w-10 md:w-12 sm:h-10 md:h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100 flex-shrink-0">
        {getInitials(userInfo?.username)}
      </div>

      <div className={isMobile ? 'flex-1' : ''}>
        <p className="text-xs sm:text-sm font-medium mr-1 sm:mr-3 truncate">
          {userInfo?.username}
        </p>
        {isMobile && userInfo?.email && (
          <p className="text-xs text-gray-500 truncate mr-3">
            {userInfo?.email}
          </p>
        )}
      </div>
    </div>
  )
}

export default ProfileInfo