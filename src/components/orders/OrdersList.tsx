
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrdersListProps } from "./types";
import { ArrowUpDown, ArrowDown, ArrowUp, ChevronDown, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const OrdersList = ({ orders, role, handleStatusChange }: OrdersListProps) => {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [expandedOrderIds, setExpandedOrderIds] = useState<string[]>([]);
  const isMobile = useIsMobile();

  // Function to format time to show only hour and minutes
  const formatDeliveryTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Sort orders based on suiteId
  const sortedOrders = [...orders].sort((a, b) => {
    if (sortDirection === null) return 0;
    if (sortDirection === 'asc') {
      return a.suiteId.localeCompare(b.suiteId, undefined, { numeric: true });
    } else {
      return b.suiteId.localeCompare(a.suiteId, undefined, { numeric: true });
    }
  });

  const toggleSort = (direction: 'asc' | 'desc') => {
    if (sortDirection === direction) {
      setSortDirection(null); // Reset sorting
    } else {
      setSortDirection(direction);
    }
  };

  const toggleOrderExpand = (orderId: string) => {
    if (expandedOrderIds.includes(orderId)) {
      setExpandedOrderIds(expandedOrderIds.filter(id => id !== orderId));
    } else {
      setExpandedOrderIds([...expandedOrderIds, orderId]);
    }
  };

  const isOrderExpanded = (orderId: string) => {
    return expandedOrderIds.includes(orderId);
  };

  // Mobile card view
  const renderMobileView = () => {
    return (
      <div className="space-y-3">
        {sortedOrders.length === 0 ? (
          <div className="text-center py-4 bg-muted/20 rounded-md">
            No orders found
          </div>
        ) : (
          sortedOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-3 border-b flex justify-between items-center" onClick={() => toggleOrderExpand(order.id)}>
                  <div>
                    <div className="font-medium">{order.suiteId}</div>
                    <div className="text-xs text-muted-foreground">{order.location}</div>
                  </div>
                  <div className="flex items-center space-x-2">
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
                    {isOrderExpanded(order.id) ? 
                      <ChevronDown className="h-4 w-4 text-muted-foreground" /> : 
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    }
                  </div>
                </div>
                
                {isOrderExpanded(order.id) && (
                  <div className="p-3 space-y-3">
                    <div>
                      <div className="text-sm font-medium mb-1">Items:</div>
                      <div className="space-y-1 ml-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-sm">
                            {item.name} x{item.quantity}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium">Delivery:</div>
                        <div className="text-sm">{formatDeliveryTime(order.deliveryTime)}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {order.isPreOrder ? "Pre-Order" : "Game Day Order"}
                        </div>
                      </div>
                      
                      <div>
                        {role === "runner" && order.status !== "completed" && (
                          <div className="space-y-2">
                            {order.status === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(order.id, "in-progress")}
                                className="w-full"
                              >
                                Start
                              </Button>
                            )}
                            {order.status === "in-progress" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(order.id, "ready")}
                                className="w-full"
                              >
                                Ready
                              </Button>
                            )}
                            {order.status === "ready" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(order.id, "completed")}
                                className="w-full"
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
                            Delivered
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    );
  };

  // Desktop table view
  const renderDesktopView = () => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <div className="flex items-center justify-between">
                Suite No.
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => toggleSort('asc')} 
                    className={sortDirection === 'asc' ? 'bg-muted' : ''}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => toggleSort('desc')} 
                    className={sortDirection === 'desc' ? 'bg-muted' : ''}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead>Delivery Time</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedOrders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            sortedOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {order.suiteId}
                  <div className="text-xs text-muted-foreground">{order.location}</div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span>{item.name} x{item.quantity}</span>
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
    );
  };

  return (
    <Card>
      <CardContent className="p-0">
        {isMobile ? renderMobileView() : renderDesktopView()}
      </CardContent>
    </Card>
  );
};

export default OrdersList;
