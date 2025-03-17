
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
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">
              <div className="flex items-center justify-between">
                Suite No.
                <OrderSortControls sortDirection={sortDirection} toggleSort={toggleSort} />
              </div>
            </TableHead>
            <TableHead className="min-w-[200px] max-w-[300px]">Items</TableHead>
            <TableHead className="w-[120px] text-center">Status</TableHead>
            <TableHead className="w-[120px]">Delivery Time</TableHead>
            <TableHead className="w-[120px]">Actions</TableHead>
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
                  <div className="text-xs text-muted-foreground truncate">{order.location}</div>
                </TableCell>
                <TableCell className="max-w-[300px]">
                  <div className="space-y-1">
                    <OrderItemsList items={order.items} />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center justify-center">
                    {order.status === "completed" && (
                      <Badge variant="default">completed</Badge>
                    )}
                    <div className="text-xs text-muted-foreground mt-1 whitespace-nowrap">
                      {order.isPreOrder ? "Pre-Order" : "Game Day Order"}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
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
    </div>
  );
};

export default DesktopOrderTable;
