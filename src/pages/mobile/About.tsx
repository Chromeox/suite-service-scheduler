import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MobileLayout from '@/components/mobile/MobileLayout';

const About = () => {
  return (
    <MobileLayout title="About SuiteSync">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">About SuiteSync</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              SuiteSync is a comprehensive service scheduling solution designed to streamline
              appointment management for service-based businesses.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To provide businesses with an intuitive and powerful scheduling tool that enhances
              productivity and improves customer satisfaction.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
              <li>Smart scheduling algorithms</li>
              <li>Real-time availability updates</li>
              <li>Automated notifications</li>
              <li>Customer management</li>
              <li>Analytics and reporting</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Version</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">1.0.0</p>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default About;
