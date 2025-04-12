import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import platformUtils from '@/utils/platform-utils';
import { Smartphone, ArrowLeft, QrCode } from 'lucide-react';

// QR Code Dialog Component
const QRCodeDialog = ({ isOpen, onClose, qrCodeUrl }: { isOpen: boolean; onClose: () => void; qrCodeUrl: string }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
          <DialogDescription>
            Scan this QR code with your mobile device to open SuiteSync Mobile
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6">
          {qrCodeUrl ? (
            <div className="border border-muted p-2 rounded-md">
              <img src={qrCodeUrl} alt="QR Code for SuiteSync Mobile" width={200} height={200} />
            </div>
          ) : (
            <div className="h-[200px] w-[200px] bg-muted flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Loading QR code...</p>
            </div>
          )}
          <p className="mt-4 text-sm text-muted-foreground text-center">
            Point your camera at the QR code to open SuiteSync Mobile on your device
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const MobileAppEntry = () => {
  const navigate = useNavigate();
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  // Detect if the app is running on a mobile device
  useEffect(() => {
    const isMobile = platformUtils.isIOS || platformUtils.isAndroid;
    if (isMobile) {
      // If on a mobile device, automatically redirect to the mobile interface
      navigate('/mobile');
    }
  }, [navigate]);

  // Generate QR code URL when needed
  useEffect(() => {
    if (qrDialogOpen) {
      // Get the current origin (protocol + hostname + port)
      const origin = window.location.origin;
      const mobileUrl = `${origin}/mobile`;
      
      // Generate QR code URL using environment variable for the API URL
      // This enhances security by avoiding hardcoded API endpoints
      const qrCodeApiBase = import.meta.env.VITE_QR_CODE_API_URL || 'https://api.qrserver.com/v1/create-qr-code/';
      const qrApiUrl = `${qrCodeApiBase}?size=200x200&data=${encodeURIComponent(mobileUrl)}`;
      setQrCodeUrl(qrApiUrl);
    }
  }, [qrDialogOpen]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-2xl font-bold text-center">
              SuiteSync Mobile
            </CardTitle>
            <div className="w-8"></div> {/* Empty div for alignment */}
          </div>
          <CardDescription className="text-center">
            Access the mobile version of SuiteSync
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Smartphone className="h-24 w-24 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Choose how to access:</h3>
            
            <div className="space-y-4">
              <Button 
                onClick={() => navigate('/mobile')}
                className="w-full"
                size="lg"
              >
                Open Mobile Interface
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted"></span>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>
              
              <Button 
                variant="outline"
                className="w-full"
                size="lg"
                onClick={() => setQrDialogOpen(true)}
              >
                <QrCode className="mr-2 h-4 w-4" />
                Scan QR Code to Open on Phone
              </Button>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground text-center">
            The mobile interface is optimized for smaller screens and touch interactions.
          </p>
        </CardFooter>
      </Card>
      
      {/* QR Code Dialog */}
      <QRCodeDialog 
        isOpen={qrDialogOpen} 
        onClose={() => setQrDialogOpen(false)} 
        qrCodeUrl={qrCodeUrl} 
      />
    </div>
  );
};



export default MobileAppEntry;
