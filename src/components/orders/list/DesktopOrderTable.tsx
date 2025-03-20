
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Order, OrderStatus } from "@/components/orders/types";
import OrderItemsList from "./OrderItemsList";
import OrderStatusActions from "./OrderStatusActions";
import OrderSortControls from "./OrderSortControls";

interface DesktopOrderTableProps {
  orders: Order[];
  role?: string;
  handleStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  sortDirection: "asc" | "desc" | null;
  toggleSort: () => void;
  formatDeliveryTime: (dateString: string) => string;
  setShowGameDayOrderDialog?: (show: boolean) => void;
}

const DesktopOrderTable = ({
  orders,
  role,
  handleStatusChange,
  sortDirection,
  toggleSort,
  formatDeliveryTime,
  setShowGameDayOrderDialog,
}: DesktopOrderTableProps) => {
  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <OrderSortControls
                label="Suite"
                sortDirection={sortDirection}
                toggleSort={toggleSort}
              />
            </TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Delivery</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            return (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="font-medium">Suite {order.suiteId}</div>
                  <div className="text-sm text-muted-foreground">{order.suiteName}</div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <OrderItemsList items={order.items} showPrice={true} />
                  </div>
                </TableCell>
                <TableCell>
                  <OrderStatusActions
                    orderId={order.id}
                    status={order.status as OrderStatus}
                    role={role}
                    handleStatusChange={handleStatusChange}
                    setShowGameDayOrderDialog={setShowGameDayOrderDialog}
                  />
                </TableCell>
                <TableCell>
                  <div className="text-sm">{formatDeliveryTime(order.deliveryTime)}</div>
                  <div className="text-xs text-muted-foreground">
                    {order.isPreOrder ? "Pre-Order" : "Game Day Order"}
                  </div>
                </TableCell>
                <TableCell>
                  {role === "attendant" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowGameDayOrderDialog && setShowGameDayOrderDialog(true)}
                    >
                      Add Gameday
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default DesktopOrderTable;
