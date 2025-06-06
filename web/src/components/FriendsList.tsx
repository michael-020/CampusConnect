import { useFriendsStore } from "@/stores/FriendsStore/useFriendsStore";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { MessageSquare, UserMinus, MoreHorizontal, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { IUser } from "@/lib/utils"; 
import { useChatStore } from "@/stores/chatStore/useChatStore";

interface FriendsListProps {
  searchTerm: string;
}

const FriendsList = ({ searchTerm }: FriendsListProps) => {
  const { 
    friends, 
    loading, 
    removeFriend, 
  } = useFriendsStore();
  const { setSelectedUser, addUserToContacts } = useChatStore()
  
  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((part: string) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleRemove = async (e: React.MouseEvent, userId: string) => {
    e.preventDefault();
    e.stopPropagation();
    await removeFriend(userId);
  };

  const filteredFriends = friends.filter(friend => {
    const search = searchTerm.toLowerCase();
    return (
      friend.name.toLowerCase().includes(search) ||
      friend.username.toLowerCase().includes(search)
    );
  });

  const sortedFriends = [...filteredFriends].sort((a: IUser, b: IUser) => {
    if (!a.name) return 1;
    if (!b.name) return -1;
    return a.name.localeCompare(b.name);
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-40 bg-gray-200 dark:bg-neutral-700" />
          <Skeleton className="h-6 w-32 bg-gray-200 dark:bg-neutral-700 rounded-full" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="flex items-center justify-between p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-100 dark:border-neutral-600"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full bg-gray-200 dark:bg-neutral-700" />
                <div>
                  <Skeleton className="h-5 w-28 mb-2 bg-gray-200 dark:bg-neutral-700" />
                  <Skeleton className="h-4 w-20 bg-gray-200 dark:bg-neutral-700" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-full bg-gray-200 dark:bg-neutral-700" />
                <Skeleton className="h-8 w-8 rounded-full bg-gray-200 dark:bg-neutral-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6" />
          My Friends
        </h2>
        <Badge variant="outline" className="px-3 py-1 text-sm flex items-center gap-1 bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
          <Users className="h-4 w-4" />
          {friends.length} Friends
        </Badge>
      </div>

      {friends.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-700">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">No friends yet</h3>
          <p className="text-gray-500 mt-1">Start connecting with others to build your network</p>
        </div>
      ) : filteredFriends.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-700">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">No matches found</h3>
          <p className="text-gray-500 mt-1">Try a different search term</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 pb-16 lg:pb-4">
          {sortedFriends.map((friend: IUser) => (
            <div 
              key={friend._id} 
              className="flex items-center justify-between p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-100 dark:border-neutral-600 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <Link to={`/profile/${friend._id}`}>
                  <Avatar className="h-12 w-12 border border-gray-200 dark:border-gray-600">
                    <AvatarImage src={friend.profilePicture || "avatar.jpeg" } alt={friend.name} />
                    <AvatarFallback>{getInitials(friend.name)}</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link to={`/profile/${friend._id}`} className="hover:underline">
                    <h3 className="font-semibold">{friend.name}</h3>
                  </Link>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    {friend.department && (
                      <span className="max-w-[120px] truncate text-xs">{friend.department}</span>
                    )}
                    {friend.department && friend.graduationYear && <span className="text-xs">•</span>}
                    {friend.graduationYear && <span className="text-xs">{friend.graduationYear}</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="icon" 
                  variant="ghost"
                  className="h-8 w-8 rounded-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  asChild
                  onClick={() => {
                    setSelectedUser(friend)
                    addUserToContacts(friend)
                  }}
                >
                  <Link to={`/message`}>
                    <MessageSquare className="h-4 w-4" />
                  </Link>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to={`/profile/${friend._id}`}>
                        View Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        className="text-red-600 focus:text-red-600 cursor-pointer flex items-center gap-2"
                        onClick={(e) => handleRemove(e, friend._id)}
                      >
                        <UserMinus className="h-4 w-4" /> 
                        Remove Friend
                      </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsList;