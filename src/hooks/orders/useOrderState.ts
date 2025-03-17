
import { useState } from "react";

// Function to initialize the state values
export const useOrderState = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showGameDayOrderDialog, setShowGameDayOrderDialog] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<string>("all");
  const [gameDayOrder, setGameDayOrder] = useState({
    suiteId: "",
    items: [{ name: "", quantity: 1 }]
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
