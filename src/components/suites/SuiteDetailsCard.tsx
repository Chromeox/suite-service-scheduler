
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCircle, Building, DollarSign } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface SuiteDetailsCardProps {
  suiteData: {
    number: string;
    capacity: number;
    level: string;
    hosts: string;
    owner: string;
    notes: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  totalBeforeTax: number;
}

const SuiteDetailsCard: React.FC<SuiteDetailsCardProps> = ({
  suiteData,
  handleInputChange,
  totalBeforeTax,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Suite {suiteData.number}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <div className="text-sm font-medium">Suite Details</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground" htmlFor="level">Level</label>
              <input 
                type="text" 
                id="level" 
                name="level"
                value={suiteData.level} 
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground" htmlFor="capacity">Capacity</label>
              <input 
                type="number" 
                id="capacity" 
                name="capacity"
                value={suiteData.capacity} 
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Additional Information</div>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground flex items-center gap-2" htmlFor="hosts">
                <UserCircle className="h-4 w-4" />
                Host(s)
              </label>
              <input 
                type="text" 
                id="hosts" 
                name="hosts"
                value={suiteData.hosts} 
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground flex items-center gap-2" htmlFor="owner">
                <Building className="h-4 w-4" />
                Owner
              </label>
              <input 
                type="text" 
                id="owner" 
                name="owner"
                value={suiteData.owner} 
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Total Before Tax:</span>
              <span>${totalBeforeTax.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="notes">Notes</label>
          <Textarea
            id="notes"
            name="notes"
            value={suiteData.notes}
            onChange={handleInputChange}
            placeholder="Add notes about this suite..."
            className="min-h-[100px]"
          />
        </div>
        
        <Button className="w-full">
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
};

export default SuiteDetailsCard;
