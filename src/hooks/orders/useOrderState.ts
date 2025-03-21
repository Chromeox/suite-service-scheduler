
import { useState } from "react";

// Function to initialize the state values
export const useOrderState = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showGameDayOrderDialog, setShowGameDayOrderDialog] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<string>("all");
  // Create default delivery time (2:00 PM today)
  const createDefaultDeliveryTime = () => {
    const today = new Date();
    today.setHours(14, 0, 0, 0); // 2:00 PM
    return today.toISOString();
  };

  const [gameDayOrder, setGameDayOrder] = useState({
    suiteId: "",
    items: [{ name: "", quantity: 1 }],
    deliveryTime: createDefaultDeliveryTime()
  });

  return {
    activeTab, 
    setActiveTab,
    searchQuery, 
    setSearchQuery,
    showGameDayOrderDialog, 
    setShowGameDayOrderDialog,
    selectedFloor, 
    setSelectedFloor,
    gameDayOrder, 
    setGameDayOrder
  };
};
