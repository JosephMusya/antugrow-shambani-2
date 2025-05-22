import { Card, } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit } from "lucide-react";
import Sidebar from "@/components/shared/Sidenav";
import { useUserContext } from "@/providers/UserAuthProvider";
import { useState } from "react";
import EditProfileDialog from "@/components/shared/EditProfileDialog";
import { formatToReadableDate, getTimeAgoObject } from "@/utils/time/formatter";
import { useFarmContext } from "@/providers/FarmProvider";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export default function ProfilePage() {
    const {authUser, farmerProfile}  = useUserContext();
    const {farms} = useFarmContext();
    const [openEditProfile, setOpenEditProfile] = useState(false);

    const editProfile = () =>{
        console.log("Edit profile");
        setOpenEditProfile(!openEditProfile);
    }


        const StarRating = ({ value }: { value: number }) => {
        const totalStars = 5;
        const fullStars = Math.floor(value);
        const hasHalfStar = value % 1 >= 0.5;
        
        return (
            <div className="flex gap-1 text-yellow-500">
            {Array.from({ length: totalStars }).map((_, i) => {
                if (i < fullStars) {
                return <FaStar key={i} className="w-5 h-5" />;
                } else if (i === fullStars && hasHalfStar) {
                return <FaStarHalfAlt key={i} className="w-5 h-5" />;
                } else {
                return <FaRegStar key={i} className="w-5 h-5" />;
                }
            })}
            </div>
        );
        };

  return (
    <div className="flex">
      <Sidebar/>
      <div className="flex-1 md:ml-64 justify-center">
        <div className="p-6 flex items-center justify-center lg:gap-[328px] sm:gap-[28px] border">
            <p className="text-2xl font-bold text-gray-800">Farmers Profile</p>

            <div className="flex items-center">
                <div className="flex-shrink-0">
                <Avatar>
                    <AvatarImage
                    className="h-10 w-10 rounded-full bg-gray-700"
                    src={
                        `/placeholder.svg?height=40&width=40&text=${authUser?.email?.charAt(0).toUpperCase() || "U"}`
                    }
                    alt="User avatar"
                    width={40}
                    height={40}
                    />
                </Avatar>
                </div>

                <div className="ml-3">
                <p className="text-sm font-medium">
                    {authUser?.email?.split("@")[0] || "User"}
                </p>
                <p className="text-xs text-gray-400">{authUser?.email}</p>
                </div>
            </div>
            </div>

        <div className="p-5 md:py-10 relative">
            <Card style={{overflow:"hidden"}} className="p-0 flex flex-col items-center w-full sm:mx-auto max-w-[800px]">
            {/* Top Section with BG Image and Centered Avatar */}
            <div className="relative w-full h-40 bg-cover bg-center" style={{ backgroundImage: "url('https://miro.medium.com/v2/resize:fit:1400/0*IMK4r0ciK6Sa7k_k')" }}>
                <div className="absolute left-1/2 bottom-[-2.5rem] transform -translate-x-1/2 flex flex-col justify-center">
                <Avatar className="relative w-30 h-30 border-4 border-white shadow-md group">
                    <AvatarImage
                        src="https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTExL3Jhd3BpeGVsX29mZmljZV8zMl9ibGFja19mbGF0X3ZlY3Rvcl9pbGx1c3RyYXRpb25fb2Zfc2V0X29mXzRfc18wZTczNTQ5OC1kMDc1LTQ0Y2EtYTk2My03NGU5YjBmMjA2NGEtbTN3dTd4OWIucG5n.png"
                        alt="Profile Photo"
                    />
                    <AvatarFallback>JD</AvatarFallback>

                    {/* Edit icon visible on hover */}
                    <div className="absolute top-1/2 left-1/2 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit color="gray" />
                    </div>
                    </Avatar>
                    <p className="text-center font-bold">{farmerProfile?.full_name??"---"}</p>
                </div>
            </div>

            {/* Padding below the avatar */}
            <div className="pt-8 px-4 pb-10 flex flex-col items-center">

                
                {/* Centered Metrics */}
            <div className="flex relative justify-between lg:w-[75%] md:w-[80%] sm:w-[95%] gap-6 mb-6">
               <div className="absolute top-[-2.5rem] right-0 cursor-pointer" onClick={editProfile}>
                        <Edit color="gray" />
                    </div>
                <div className="text-center">
                    <h2 className="font-bold text-3xl text-green-400">{farms?.length}</h2>
                    <h1 className="text-gray-600 mt-2">Number of Farms</h1>
                </div>
                <div className="text-center">
                    <h2 className="font-bold text-3xl text-green-400">{farmerProfile?.credit ?? 0}</h2>
                    <h1 className="text-gray-600 mt-2">Credit Score</h1>
                </div>
                <div className="text-center">
                    <h2 className="font-bold text-3xl text-green-400">{getTimeAgoObject(farmerProfile?.created_at as unknown as string).value}</h2>
                    <h1 className="text-gray-600 mt-2">{getTimeAgoObject(farmerProfile?.created_at as unknown as string).type} On Antugrow</h1>
                </div>
                </div>

                {/* Details Section */}
                <div className="flex flex-col items-start text-left mt-4 space-y-2 lg:gap-5 lg:w-[75%] md:w-[80%] sm:w-[95%]">
                <div className="flex justify-between w-full">
                    <h2 className="font-bold">Full Names</h2>
                    <p className="text-gray-600">{farmerProfile?.full_name ?? authUser?.email?.split("@")[0]}</p>
                </div>
                <div className="flex justify-between w-full">
                    <h2 className="font-bold">Email Address</h2>
                    <p className="text-gray-600">{authUser?.email}</p>
                </div>
                <div className="flex justify-between w-full">
                    <h2 className="font-bold">Joined</h2>
                    <p className="text-gray-600">{formatToReadableDate(farmerProfile?.created_at as string)}</p>
                </div>
                <div className="flex justify-between w-full">
                    <h2 className="font-bold">Phone</h2>
                    <p className="text-gray-600">{farmerProfile?.phone ?? "---"}</p>
                </div>
                <div className="flex justify-between w-full">
                <h2 className="font-bold">Credit Score</h2>
                <StarRating value={farmerProfile?.success_rate ?? 0} />
                </div>
                <div className="flex justify-between w-full">
                    <h2 className="font-bold">Year of Experience</h2>
                    <p className="text-gray-600">{farmerProfile?.experience_years ?? 0}</p>
                </div>
                </div>

                {/* Bio Section */}
                <div className="mt-6 lg:w-[75%] md:w-[80%] sm:w-[95%]">
                <h2 className="font-semibold">Farmer's Bio</h2>
                <p className="text-gray-600">
                    {farmerProfile?.bio ?? "Put a brief description about the nature of your farms and activities here. Let us know you more 😊"}
                </p>
                </div>
            </div>
            </Card>
            <EditProfileDialog open={openEditProfile} onOpenChange={setOpenEditProfile} userId={"user?.id"} />
        </div>
      </div>
    </div>
  );
}
