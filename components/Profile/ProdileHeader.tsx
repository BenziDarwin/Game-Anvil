import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  VerifiedIcon,
  Users,
  Calendar,
  MapPin,
  LinkIcon,
  Edit,
} from "lucide-react";
import Link from "next/link";
import { User } from "@/lib/types/user";

export default function ProfileHeader({ user }: { user: User }) {
  return (
    <div className="bg-orange-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <Avatar className="w-40 h-40 border-4 border-white rounded-full overflow-hidden">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </Avatar>
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-4xl font-bold">{user.name}</h1>
              {user.verified && (
                <VerifiedIcon className="h-6 w-6 text-yellow-300" />
              )}
            </div>
            <p className="text-lg opacity-90 mb-4">{user.bio}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>{user.followers} followers</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>Joined {user.joinedDate}</span>
              </div>
              {user.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{user.location}</span>
                </div>
              )}
              {user.website && (
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {new URL(user.website).hostname}
                  </a>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Link href={`/profile/edit`} passHref>
              <Button
                variant="secondary"
                className="bg-white text-orange-500 hover:bg-orange-50"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
