/**
 * Security Dashboard Component
 * Provides a UI for monitoring and managing application security
 */
import React, { useState } from 'react';
import { useSecurity } from './SecurityProvider';
import { performSecurityAudit, formatAuditResultsAsHtml } from '@/utils/security-audit';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Shield, ShieldAlert, ShieldCheck, Lock, Key, RefreshCw } from 'lucide-react';

interface SecurityIssue {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  type: string;
  description: string;
  location?: string;
  recommendation: string;
}

export const SecurityDashboard: React.FC = () => {
  const { securityScore, isSecureContext, hasSecureStorage, hasHttpsConnection } = useSecurity();
  const [auditResults, setAuditResults] = useState<{ issues: SecurityIssue[]; score: number; timestamp: string } | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Use our own audit function to avoid type issues
  const runAudit = () => {
    const results = performSecurityAudit();
    return results;
  };

  const handleAudit = () => {
    const results = runAudit();
    setAuditResults(results);
    setActiveTab('audit');
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <ShieldAlert className="h-4 w-4 text-destructive" />;
      case 'medium':
        return <Shield className="h-4 w-4 text-amber-500" />;
      case 'low':
      case 'info':
        return <ShieldCheck className="h-4 w-4 text-green-500" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-amber-500';
    return 'bg-destructive';
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Shield className="mr-2 h-6 w-6" /> Security Dashboard
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="audit">Security Audit</TabsTrigger>
          <TabsTrigger value="settings">Security Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Security Score</CardTitle>
                <CardDescription>Overall security rating</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-4">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center ${getScoreColor(securityScore)} text-white text-2xl font-bold`}>
                    {securityScore}
                  </div>
                </div>
                <Progress value={securityScore} className="h-2 mt-2" />
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" onClick={handleAudit} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" /> Run Security Audit
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Security Status</CardTitle>
                <CardDescription>Current security features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Lock className="mr-2 h-4 w-4" /> Secure Context
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${isSecureContext ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {isSecureContext ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Key className="mr-2 h-4 w-4" /> Secure Storage
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${hasSecureStorage ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {hasSecureStorage ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Shield className="mr-2 h-4 w-4" /> HTTPS Connection
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${hasHttpsConnection ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {hasHttpsConnection ? 'Secure' : 'Insecure'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Security Recommendations</CardTitle>
                <CardDescription>Top security improvements</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {!hasHttpsConnection && (
                    <li className="flex items-start">
                      <ShieldAlert className="mr-2 h-4 w-4 text-destructive mt-0.5" />
                      <span>Enable HTTPS for all connections</span>
                    </li>
                  )}
                  {!hasSecureStorage && (
                    <li className="flex items-start">
                      <ShieldAlert className="mr-2 h-4 w-4 text-destructive mt-0.5" />
                      <span>Configure secure storage for sensitive data</span>
                    </li>
                  )}
                  <li className="flex items-start">
                    <Shield className="mr-2 h-4 w-4 text-amber-500 mt-0.5" />
                    <span>Implement Content Security Policy (CSP)</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="mr-2 h-4 w-4 text-amber-500 mt-0.5" />
                    <span>Enable multi-factor authentication</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span>Keep dependencies updated regularly</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Audit Results</CardTitle>
              <CardDescription>
                {auditResults ? `Last audit: ${new Date(auditResults.timestamp).toLocaleString()}` : 'Run an audit to see results'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {auditResults ? (
                <div>
                  <div className="flex items-center mb-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getScoreColor(auditResults.score)} text-white text-xl font-bold mr-4`}>
                      {auditResults.score}
                    </div>
                    <div>
                      <h3 className="font-medium">Security Score</h3>
                      <p className="text-sm text-muted-foreground">
                        {auditResults.score >= 90
                          ? 'Good'
                          : auditResults.score >= 70
                          ? 'Needs Improvement'
                          : 'Critical Issues'}
                      </p>
                    </div>
                  </div>

                  <h3 className="font-medium mb-2">Issues Found: {auditResults.issues.length}</h3>
                  
                  {auditResults.issues.length === 0 ? (
                    <Alert className="bg-green-50 border-green-200">
                      <ShieldCheck className="h-4 w-4 text-green-500" />
                      <AlertTitle>No security issues found!</AlertTitle>
                      <AlertDescription>
                        Your application appears to be secure. Continue to monitor for new vulnerabilities.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="text-left p-2 text-sm font-medium">Severity</th>
                            <th className="text-left p-2 text-sm font-medium">Type</th>
                            <th className="text-left p-2 text-sm font-medium">Description</th>
                            <th className="text-left p-2 text-sm font-medium">Recommendation</th>
                          </tr>
                        </thead>
                        <tbody>
                          {auditResults.issues.map((issue, index) => (
                            <tr key={index} className="border-t">
                              <td className="p-2 text-sm">
                                <div className="flex items-center">
                                  {getSeverityIcon(issue.severity)}
                                  <span className="ml-1 capitalize">{issue.severity}</span>
                                </div>
                              </td>
                              <td className="p-2 text-sm">{issue.type}</td>
                              <td className="p-2 text-sm">{issue.description}</td>
                              <td className="p-2 text-sm">{issue.recommendation}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Audit Results</h3>
                  <p className="text-muted-foreground mb-4">
                    Run a security audit to identify potential vulnerabilities in your application.
                  </p>
                  <Button onClick={handleAudit}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Run Security Audit
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security features for your application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Content Security Policy</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    CSP helps prevent XSS attacks by controlling which resources can be loaded.
                  </p>
                  <div className="flex items-center">
                    <Button variant="outline" size="sm" className="mr-2">
                      Configure CSP
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      Current status: {isSecureContext ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">API Key Management</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Manage and rotate API keys used by the application.
                  </p>
                  <Button variant="outline" size="sm">
                    Manage API Keys
                  </Button>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Security Headers</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Configure HTTP security headers to protect against common web vulnerabilities.
                  </p>
                  <Button variant="outline" size="sm">
                    Configure Headers
                  </Button>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">CORS Settings</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Control which domains can access your API resources.
                  </p>
                  <Button variant="outline" size="sm">
                    Configure CORS
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
