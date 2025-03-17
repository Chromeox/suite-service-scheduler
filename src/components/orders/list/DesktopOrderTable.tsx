
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Order, OrderStatus } from "@/components/orders/types";
import OrderItemsList from "./OrderItemsList";
import OrderStatusActions from "./OrderStatusActions";
import OrderSortControls from "./OrderSortControls";

interface DesktopOrderTableProps {
  orders: Order[];
  role?: string;
  handleStatusChange: (orderId: string, newStatus: OrderStatus) => void;
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
  formatDeliveryTime
}: DesktopOrderTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[120px]">
              <div className="flex items-center gap-1">
                Suite ID
                <OrderSortControls 
                  sortDirection={sortDirection}
                  toggleSort={toggleSort}
                />
              </div>
            </TableHead>
            <TableHead className="hidden md:table-cell">Suite Name</TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="hidden md:table-cell">Delivery Time</TableHead>
            <TableHead className="hidden md:table-cell">Type</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-right">Total Before Tax</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4 border-b">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => {
              // Calculate total before tax
              const totalBeforeTax = order.items.reduce((total, item) => {
                return total + (item.price || 0) * item.quantity;
              }, 0);
              
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">Suite {order.suiteId}</TableCell>
                  <TableCell className="hidden md:table-cell">{order.suiteName}</TableCell>
                  <TableCell className="max-w-[240px]">
                    <OrderItemsList items={order.items} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDeliveryTime(order.deliveryTime)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {order.isPreOrder ? (
                      <Badge variant="outline">Pre-Order</Badge>
                    ) : (
                      <Badge variant="secondary">Game Day</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <OrderStatusActions
                      orderId={order.id}
                      status={order.status as OrderStatus}
                      role={role}
                      handleStatusChange={handleStatusChange}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    ${totalBeforeTax.toFixed(2)}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DesktopOrderTable;
