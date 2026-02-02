import getSession from "@/actions/get-session";
import EditableProfilePhoto from "@/components/editable-profile-photo";
import { GrLocation } from "react-icons/gr";
import ProfileForm from "../_components/profile-form";

export default async function SellerProfile() {
  const session = await getSession();
  if (!session) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-primary font-semibold">Profile</h2>
      <div className="py-2 px-4 flex items-center gap-6 border shadow rounded-3xl md:min-w-[600px]">
        <EditableProfilePhoto />
        <div>
          <h3> {session.firstName + " " + session.lastName} </h3>
          <div className="text-gray-500 flex items-center gap-1">
            <GrLocation /> <span>{session.location}</span>
          </div>
        </div>
      </div>
      <ProfileForm />
    </div>
  );
}
