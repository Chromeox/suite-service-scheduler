
import { MenuItem } from "../../types/menuTypes";

// SALADS category
export const salads: MenuItem[] = [
  {
    id: "salad-1",
    name: "Classic Caesar",
    price: 65,
    description: "parmesan, lemon, focaccia croutons",
    category: "Salads",
    dietaryInfo: {
      vegetarian: true
    },
    servingSize: "Serves 8"
  }
];

// SUSHI PLATTERS category
export const sushiPlatters: MenuItem[] = [
  {
    id: "sushi-1",
    name: "Assorted Sushi Platter",
    price: 185,
    description: "aburi salmon oshi, aburi ebi (shrimp) oshi, sable aburi, salmon nigiri, hamachi (yellowtail tuna) nigiri, ebi nigiri, tuna nigiri, california roll, avocado roll",
    category: "Sushi Platters",
    dietaryInfo: {
      oceanwise: true
    },
    servingSize: "36 Pieces"
  },
  {
    id: "sushi-2",
    name: "Deluxe Sushi Platter",
    price: 195,
    description: "aburi salmon oshi, aburi ebi (shrimp) oshi, sable aburi, california roll, crimson tide roll, avocado roll",
    category: "Sushi Platters",
    dietaryInfo: {
      oceanwise: true
    },
    servingSize: "36 Pieces"
  },
  {
    id: "sushi-3",
    name: "Premium Sushi Platter",
    price: 205,
    description: "aburi salmon oshi, aburi ebi (shrimp) oshi, sable aburi, aburi hotate (scallop) oshi, premium bincho (tuna nigiri), premium salmon nigiri, california roll, spicy tuna roll, avocado roll",
    category: "Sushi Platters",
    dietaryInfo: {
      oceanwise: true
    },
    servingSize: "36 Pieces"
  },
  {
    id: "sushi-4",
    name: "Aburi Salmon Oshi",
    price: 205,
    description: "rice pressed into traditional boxed sushi, torched atlantic salmon, japanese mayo",
    category: "Sushi Platters",
    dietaryInfo: {
      oceanwise: true
    },
    servingSize: "36 Pieces"
  }
];
