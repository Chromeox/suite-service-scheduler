
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Order } from "@/components/orders/types";
import OrderSortControls from "./OrderSortControls";
import OrderItemsList from "./OrderItemsList";
import OrderStatusActions from "./OrderStatusActions";

interface DesktopOrderTableProps {
  orders: Order[];
  role?: string;
  handleStatusChange: (orderId: string, newStatus: string) => void;
  sortDirection: 'asc' | 'desc' | null;
  toggleSort: (direction: 'asc' | 'desc') => void;
  formatDeliveryTime: (dateString: string) => string;
}

const DesktopOrderTable = ({
  orders,
  role,
  handleStatusChange,
  sortDirection,
  toggleSort,
  formatDeliveryTime,
}: DesktopOrderTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <div className="flex items-center justify-between">
              Suite No.
              <OrderSortControls sortDirection={sortDirection} toggleSort={toggleSort} />
            </div>
          </TableHead>
          <TableHead>Items</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead>Delivery Time</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4">
              No orders found
            </TableCell>
          </TableRow>
        ) : (
          orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">
                {order.suiteId}
                <div className="text-xs text-muted-foreground">{order.location}</div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <OrderItemsList items={order.items} />
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex flex-col items-center justify-center">
                  {order.status === "completed" && (
                    <Badge variant="default">completed</Badge>
                  )}
                  <div className="text-xs text-muted-foreground mt-1">
                    {order.isPreOrder ? "Pre-Order" : "Game Day Order"}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {formatDeliveryTime(order.deliveryTime)}
              </TableCell>
              <TableCell>
                <OrderStatusActions 
                  orderId={order.id} 
                  status={order.status} 
                  role={role} 
                  handleStatusChange={handleStatusChange} 
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default DesktopOrderTable;
