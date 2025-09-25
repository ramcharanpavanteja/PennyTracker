import React, { useEffect, useState } from "react";
import axios from "axios";

function SideNavigation({activePage,setActivePage}) {

  const liBase =
  "px-4 py-8 cursor-pointer transition-colors duration-200 ease-in-out";
  const isActive = (key) =>
    activePage === key
      ? "bg-indigo-300 text-white rounded-b-md"
      : "hover:bg-indigo-100 hover:text-indigo-800";
  return (
    <div className="">
     
      {/* Menu items */}
      <div className="text-gray-500 text-lg text-center font-bold">
        <ul className="font-poppins">
          <li className={`b-b ${liBase} ${isActive("dashboard")}`}
               onClick={() => setActivePage("dashboard")}>Dashboard
          </li>
          <li className={`b-b ${liBase} ${isActive("expense")}`}
             onClick={()=> setActivePage("expense")}>Expense
          </li>
          <li className={`b-b ${liBase} ${isActive("income")}`}
            onClick={()=> setActivePage("income")}>Income
          </li>
        </ul>
      </div>
      
    </div>
    
  );
  
}

export default SideNavigation;



{/* Profile image at the top */}

      {/* <div className="flex flex-col items-center mt-6 ">
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            className="w-30 h-30 rounded-full border-2 border-amber-400 shadow-xl object-contain"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div> */}


        // const [profileImage, setProfileImage] = useState(null);

  // // useEffect(() => {
  // //   const fetchProfileImage = async () => {
  // //     try {
  // //       if (!user || !user._id) {
  // //         console.log("No user found in localStorage");
  // //         return;
  // //       }
  // //       const res = await axios.get(`/api/users/profile-image/${user._id}`, {
  // //         responseType: "blob", // very important
  // //       });

  // //       // convert blob to URL
  // //       const imageUrl = URL.createObjectURL(res.data);
  // //       setProfileImage(imageUrl);
  // //     } catch (err) {
  // //       console.error("Error loading profile image", err);
  // //     }
  // //   };

  // //   fetchProfileImage();
  // // }, [user]);
