import { Badge } from '@/components/ui/badge';

type BadgePosition = "top-right" | "top-left" | "bottom-right" | "bottom-left" | "center";
type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

interface NotificationBadgeProps {
  /** The count to display in the badge */
  count: number;
  /** Maximum count to display before showing a "+" suffix @default 99 */
  maxCount?: number;
  /** Optional additional CSS classes */
  className?: string;
  /** Badge variant @default "destructive" */
  variant?: BadgeVariant;
  /** Position of the badge @default "top-right" */
  position?: BadgePosition;
}

// Position class mapping for better reusability
const POSITION_CLASSES: Record<BadgePosition, string> = {
  "top-right": "absolute -top-1 -right-1",
  "top-left": "absolute -top-1 -left-1",
  "bottom-right": "absolute -bottom-1 -right-1",
  "bottom-left": "absolute -bottom-1 -left-1",
  "center": "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
};

/**
 * A reusable notification badge component that displays a count
 * and handles visibility based on the count value
 */
export function NotificationBadge({ 
  count, 
  maxCount = 99,
  className = "",
  variant = "destructive",
  position = "top-right"
}: NotificationBadgeProps) {
  // Don't render anything if count is zero or negative
  if (count <= 0) return null;
  
  // Format the display count with a "+" suffix if it exceeds maxCount
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();
  
  return (
    <Badge 
      variant={variant}
      className={`${POSITION_CLASSES[position]} px-1 min-w-5 h-5 flex items-center justify-center ${className}`}
    >
      {displayCount}
    </Badge>
  );
}
