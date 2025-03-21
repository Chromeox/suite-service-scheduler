
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRound, Save, Bell, Settings2, Moon, Sun, Laptop, Clock, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuthState, UserProfile } from "@/hooks/chat/useAuthState";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/hooks/use-theme.ts";
import { useNetworkStatus } from "@/hooks/use-network.tsx";

const Settings = () => {
  const { role } = useParams<{ role: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, userProfile, isLoading } = useAuthState();
  const { theme, setTheme } = useTheme();
  const { isOnline } = useNetworkStatus();
  
  // Profile settings
  const [displayName, setDisplayName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  // Notification settings
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [statusNotifications, setStatusNotifications] = useState(true);
  
  // App preferences
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState("60");
  const [defaultView, setDefaultView] = useState("list");
  const [confirmActions, setConfirmActions] = useState(true);

  useEffect(() => {
    if (userProfile?.display_name) {
      setDisplayName(userProfile.display_name);
    } else if (userProfile?.first_name && userProfile?.last_name) {
      setDisplayName(`${userProfile.first_name} ${userProfile.last_name}`);
    }
  }, [userProfile]);

  // Load user preferences from database
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("user_preferences")
          .select("*")
          .eq("user_id", user.id)
          .single();
          
        if (error && error.code !== "PGRST116") {
          // PGRST116 is the error code for no rows returned
          console.error("Error loading preferences:", error);
          return;
        }
        
        if (data) {
          // Set notification preferences
          setEnableNotifications(data.enable_notifications ?? true);
          setOrderNotifications(data.order_notifications ?? true);
          setMessageNotifications(data.message_notifications ?? true);
          setStatusNotifications(data.status_notifications ?? true);
          
          // Set app preferences
          setAutoRefresh(data.auto_refresh ?? true);
          setRefreshInterval(data.refresh_interval?.toString() ?? "60");
          setDefaultView(data.default_view ?? "list");
          setConfirmActions(data.confirm_actions ?? true);
        }
      } catch (error) {
        console.error("Error loading user preferences:", error);
      }
    };
    
    loadUserPreferences();
  }, [user]);

  const handleSaveDisplayName = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to update your profile",
        variant: "destructive",
      });
      return;
    }

    if (!displayName.trim()) {
      toast({
        title: "Display name required",
        description: "Please enter a display name",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ display_name: displayName })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your display name has been updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSaveNotificationSettings = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to update your preferences",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from("user_preferences")
        .upsert({
          user_id: user.id,
          enable_notifications: enableNotifications,
          order_notifications: orderNotifications,
          message_notifications: messageNotifications,
          status_notifications: statusNotifications,
        } as any, { onConflict: "user_id" });

      if (error) throw error;

      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved",
      });
    } catch (error: any) {
      console.error("Error updating notification settings:", error);
      toast({
        title: "Error updating settings",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const handleSaveAppPreferences = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to update your preferences",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from("user_preferences")
        .upsert({
          user_id: user.id,
          auto_refresh: autoRefresh,
          refresh_interval: parseInt(refreshInterval),
          default_view: defaultView,
          confirm_actions: confirmActions,
        } as any, { onConflict: "user_id" });

      if (error) throw error;

      toast({
        title: "Preferences updated",
        description: "Your application preferences have been saved",
      });
    } catch (error: any) {
      console.error("Error updating app preferences:", error);
      toast({
        title: "Error updating preferences",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Separator />

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <UserRound className="h-5 w-5" />
                    <CardTitle>Profile</CardTitle>
                  </div>
                  <CardDescription>
                    Update your personal information displayed in the application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-1/3" />
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <p className="text-sm text-muted-foreground">
                          This name will be visible to others in chats and communications
                        </p>
                        <Input
                          id="displayName"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Enter your display name"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={handleSaveDisplayName}
                          disabled={isSaving || !displayName.trim() || displayName === userProfile?.display_name}
                        >
                          {isSaving ? "Saving..." : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/dashboard/${role}/communications`)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Your account details and status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                      
                      <div>
                        <p className="font-medium">Name</p>
                        <p className="text-sm text-muted-foreground">
                          {userProfile?.first_name} {userProfile?.last_name}
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-medium">Role</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {userProfile?.role || role || "Not assigned"}
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-medium">Status</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <p className="text-sm text-muted-foreground">
                            {isOnline ? 'Online' : 'Offline'}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  <CardTitle>Notification Settings</CardTitle>
                </div>
                <CardDescription>
                  Manage how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Turn all notifications on or off
                    </p>
                  </div>
                  <Switch
                    checked={enableNotifications}
                    onCheckedChange={setEnableNotifications}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order Updates</p>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when orders are updated
                      </p>
                    </div>
                    <Switch
                      checked={orderNotifications && enableNotifications}
                      onCheckedChange={setOrderNotifications}
                      disabled={!enableNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Messages</p>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications for new messages
                      </p>
                    </div>
                    <Switch
                      checked={messageNotifications && enableNotifications}
                      onCheckedChange={setMessageNotifications}
                      disabled={!enableNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Status Changes</p>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when user statuses change
                      </p>
                    </div>
                    <Switch
                      checked={statusNotifications && enableNotifications}
                      onCheckedChange={setStatusNotifications}
                      disabled={!enableNotifications}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5" />
                  <CardTitle>Appearance</CardTitle>
                </div>
                <CardDescription>
                  Customize the look and feel of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <div className="flex gap-4">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      className="flex items-center gap-2 w-1/3"
                      onClick={() => setTheme("light")}
                    >
                      <Sun className="h-4 w-4" />
                      Light
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      className="flex items-center gap-2 w-1/3"
                      onClick={() => setTheme("dark")}
                    >
                      <Moon className="h-4 w-4" />
                      Dark
                    </Button>
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      className="flex items-center gap-2 w-1/3"
                      onClick={() => setTheme("system")}
                    >
                      <Laptop className="h-4 w-4" />
                      System
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5" />
                  <CardTitle>Application Preferences</CardTitle>
                </div>
                <CardDescription>
                  Customize how the application works for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-refresh Data</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically refresh data at regular intervals
                    </p>
                  </div>
                  <Switch
                    checked={autoRefresh}
                    onCheckedChange={setAutoRefresh}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="refreshInterval">Refresh Interval</Label>
                  <div className="flex items-center gap-2">
                    <Select
                      value={refreshInterval}
                      onValueChange={setRefreshInterval}
                      disabled={!autoRefresh}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 seconds</SelectItem>
                        <SelectItem value="60">1 minute</SelectItem>
                        <SelectItem value="300">5 minutes</SelectItem>
                        <SelectItem value="600">10 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      className="flex-shrink-0"
                      title="Refresh now"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="defaultView">Default View</Label>
                  <Select
                    value={defaultView}
                    onValueChange={setDefaultView}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select default view" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="list">List View</SelectItem>
                      <SelectItem value="grid">Grid View</SelectItem>
                      <SelectItem value="calendar">Calendar View</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Confirm Actions</p>
                    <p className="text-sm text-muted-foreground">
                      Show confirmation dialogs before important actions
                    </p>
                  </div>
                  <Switch
                    checked={confirmActions}
                    onCheckedChange={setConfirmActions}
                  />
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button onClick={handleSaveAppPreferences}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Preferences
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="suiteRanges">Valid Suite Ranges</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Range 1</p>
                      <div className="flex items-center gap-2">
                        <Input value="200" disabled className="w-20" />
                        <span>-</span>
                        <Input value="260" disabled className="w-20" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Range 2</p>
                      <div className="flex items-center gap-2">
                        <Input value="500" disabled className="w-20" />
                        <span>-</span>
                        <Input value="545" disabled className="w-20" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
