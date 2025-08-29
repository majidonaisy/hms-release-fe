import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Skeleton } from "@/components/atoms/Skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Organisms/Card";
import { Dialog, DialogContent, DialogHeader } from "@/components/Organisms/Dialog";
import { changePassword, getProfile } from "@/services/Auth";
import { getRoleBId } from "@/services/Role";
import { GetProfileResponse } from "@/validation";
import { Role } from "@/validation/schemas/Roles";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Profile = () => {
    const [profile, setProfile] = useState<GetProfileResponse['data'] | null>(null);
    const [role, setRole] = useState<Role | null>(null);
    const [changePasswordDialog, setChangePasswordDialog] = useState(false);
    const [changePasswordData, setChangePasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
    });
    const [loading, setLoading] = useState(false);
    const [getLoading, setGetLoading] = useState(false);

    const handleGetProfile = async () => {
        setGetLoading(true);
        try {
            const response = await getProfile();
            setProfile(response.data);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        } finally {
            setGetLoading(false);
        }
    };

    const handleGetRole = async (roleId: string) => {
        setGetLoading(true);
        try {
            const response = await getRoleBId(roleId);
            setRole(response.data);
        } catch (error) {
            console.error("Failed to fetch role:", error);
        } finally {
            setGetLoading(false);
        }
    };

    const handleChangePassword = async () => {
        setLoading(true);
        try {
            await changePassword({
                currentPassword: changePasswordData.currentPassword,
                newPassword: changePasswordData.newPassword,
                confirmPassword: changePasswordData.confirmPassword
            });
            toast.success("Password changed successfully");
            setChangePasswordDialog(false);
            setChangePasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setShowPasswords({
                currentPassword: false,
                newPassword: false,
                confirmPassword: false
            });
        } catch (error: any) {
            const errorMessage = error.userMessage || "Failed to change password";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    useEffect(() => {
        handleGetProfile();
        handleGetRole(profile?.roleId || '');
    }, [profile?.roleId]);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold">Profile</h1>
            <div className="p-6 flex items-center gap-3">
                <div className="h-32 w-32">
                    <Avatar className="w-full h-full">
                        <AvatarImage></AvatarImage>
                        <AvatarFallback className="text-4xl">{profile?.firstName.charAt(0)}{profile?.lastName.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>
                <div>
                    {getLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-5 w-32" />
                        </div>
                    ) : (
                        <>
                            <p className="text-xl font-bold">{profile?.firstName} {profile?.lastName}</p>
                            <p className="text-lg">{role?.name}</p>
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-row gap-2 mt-10">
                <Card className="w-full p-3 gap-2">
                    <CardHeader className="p-0">
                        <CardTitle className="text-xl font-bold border-b p-0 pb-2">Profile Info</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                        {getLoading ? (
                            <>
                                <span className="flex justify-between">
                                    <Skeleton className="h-5 w-40" />
                                    <Skeleton className="h-5 w-32" />
                                </span>
                                <span className="flex justify-between">
                                    <Skeleton className="h-5 w-40" />
                                    <Skeleton className="h-5 w-32" />
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="flex justify-between">
                                    <p className="font-semibold">Email:</p>
                                    <p>{profile?.email}</p>
                                </span>
                                <span className="flex justify-between">
                                    <p className="font-semibold">Department:</p>
                                    <p>{profile?.department.name}</p>
                                </span>
                            </>
                        )}

                    </CardContent>
                </Card >

                <Card className="w-full p-3 gap-2">
                    <CardHeader className="p-0">
                        <CardTitle className="text-xl font-bold border-b p-0 pb-2">Account Info</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                        {getLoading ? (
                            <>
                                <span className="flex justify-between">
                                    <Skeleton className="h-5 w-40" />
                                    <Skeleton className="h-5 w-32" />
                                </span>
                                <span className="flex justify-end mt-5">
                                    <Skeleton className="h-5 w-40" />
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="flex justify-between">
                                    <p className="font-semibold">Username:</p>
                                    <p>{profile?.username}</p>
                                </span>
                                <span className="flex justify-end mt-5">
                                    <Button onClick={() => setChangePasswordDialog(true)} className="h-7">Change Password</Button>
                                </span>
                            </>
                        )}
                    </CardContent>
                </Card >
            </div >

            <Dialog open={changePasswordDialog} onOpenChange={setChangePasswordDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">
                            Change Password
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-5">
                        <span className="space-y-2">
                            <p className="font-semibold">Current Password</p>
                            <div className="relative">
                                <Input
                                    type={showPasswords.currentPassword ? "text" : "password"}
                                    placeholder="Enter current password"
                                    className="border border-gray-300 pr-10"
                                    value={changePasswordData.currentPassword}
                                    onChange={(e) => setChangePasswordData({ ...changePasswordData, currentPassword: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    onClick={() => togglePasswordVisibility('currentPassword')}
                                >
                                    {showPasswords.currentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </span>
                        <span className="space-y-2">
                            <p className="font-semibold">New Password</p>
                            <div className="relative">
                                <Input
                                    type={showPasswords.newPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    className="border border-gray-300 pr-10"
                                    value={changePasswordData.newPassword}
                                    onChange={(e) => setChangePasswordData({ ...changePasswordData, newPassword: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    onClick={() => togglePasswordVisibility('newPassword')}
                                >
                                    {showPasswords.newPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </span>
                        <span className="space-y-2">
                            <p className="font-semibold">Confirm New Password</p>
                            <div className="relative">
                                <Input
                                    type={showPasswords.confirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    className="border border-gray-300 pr-10"
                                    value={changePasswordData.confirmPassword}
                                    onChange={(e) => setChangePasswordData({ ...changePasswordData, confirmPassword: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    onClick={() => togglePasswordVisibility('confirmPassword')}
                                >
                                    {showPasswords.confirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </span>
                    </div>
                    <Button className="mt-5" onClick={handleChangePassword} disabled={loading}>{loading ? "Changing..." : "Change Password"}</Button>
                </DialogContent>
            </Dialog>
        </div >
    );
};

export default Profile;