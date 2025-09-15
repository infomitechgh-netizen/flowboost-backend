import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"


interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    label: string
  }
  icon: LucideIcon
  variant?: "default" | "success" | "warning" | "destructive"
  className?: string
}

export const StatsCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  variant = "default",
  className 
}: StatsCardProps) => {
  const variants = {
    default: "border-border",
    success: "border-success/20 bg-success/5 ",
    warning: "border-warning/20 bg-warning/5", 
    destructive: "border-destructive/20 bg-destructive/5"
  }

  const iconVariants = {
    default: "text-primary",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive"
  }

  return (
    <Card className={cn(
      "relative overflow-hidden hover-lift glass-card",
      variants[variant],
      className
    )}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {change && (
              <p className={cn(
                "text-xs flex items-center gap-1",
                change.value > 0 ? "text-success" : change.value < 0 ? "text-destructive" : "text-muted-foreground"
              )}>
                <span className={cn(
                  "inline-block w-0 h-0 border-l-[4px] border-r-[4px] border-solid border-transparent",
                  change.value > 0 && "border-b-[6px] border-b-success",
                  change.value < 0 && "border-t-[6px] border-t-destructive"
                )}></span>
                {Math.abs(change.value)}% {change.label}
              </p>
            )}
          </div>
          <div className={cn(
            "h-12 w-12 rounded-full flex items-center justify-center",
            variant === "default" && "bg-primary/10",
            variant === "success" && "bg-success/10", 
            variant === "warning" && "bg-warning/10",
            variant === "destructive" && "bg-destructive/10"
          )}>
            <Icon className={cn("h-6 w-6", iconVariants[variant])} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}