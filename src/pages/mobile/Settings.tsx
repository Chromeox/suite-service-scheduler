import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import MobileLayout from '@/components/mobile/MobileLayout';

const Settings = () => {
  return (
    <MobileLayout title="Settings">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Notifications</CardTitle>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="pushNotifications" className="text-base">Push Notifications</Label>
              <Switch id="pushNotifications" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotifications" className="text-base">Email Notifications</Label>
              <Switch id="emailNotifications" defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Appearance</CardTitle>
            <CardDescription>Customize your app experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode" className="text-base">Dark Mode</Label>
              <Switch id="darkMode" />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="compactView" className="text-base">Compact View</Label>
              <Switch id="compactView" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Privacy & Data</CardTitle>
            <CardDescription>Manage your data and privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="locationServices" className="text-base">Location Services</Label>
              <Switch id="locationServices" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="dataSync" className="text-base">Background Data Sync</Label>
              <Switch id="dataSync" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics" className="text-base">Usage Analytics</Label>
              <Switch id="analytics" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default Settings;
