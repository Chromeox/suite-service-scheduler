
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrdersListProps } from "./types";

const OrdersList = ({ orders, role, handleStatusChange }: OrdersListProps) => {
  // Function to format time to show only hour and minutes
  const formatDeliveryTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Suite No.</TableHead>
              <TableHead>Suite</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead>Delivery Time</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.suiteId}</TableCell>
                  <TableCell>
                    {order.suiteName}
                    <div className="text-xs text-muted-foreground">{order.location}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <Badge variant="outline" className="ml-2">
                            {item.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Badge
                        variant={
                          order.status === "completed" ? "default" :
                          order.status === "ready" ? "outline" :
                          order.status === "in-progress" ? "secondary" :
                          "destructive"
                        }
                      >
                        {order.status}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {order.isPreOrder ? "Pre-Order" : "Game Day Order"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDeliveryTime(order.deliveryTime)}
                  </TableCell>
                  <TableCell>
                    {role === "runner" && order.status !== "completed" && (
                      <div className="flex space-x-2">
                        {order.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(order.id, "in-progress")}
                          >
                            Start
                          </Button>
                        )}
                        {order.status === "in-progress" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(order.id, "ready")}
                          >
                            Mark Ready
                          </Button>
                        )}
                        {order.status === "ready" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(order.id, "completed")}
                          >
                            Deliver
                          </Button>
                        )}
                      </div>
                    )}
                    {role === "attendant" && order.status === "ready" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(order.id, "completed")}
                      >
                        Mark Delivered
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OrdersList;
