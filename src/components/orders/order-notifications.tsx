"use client"

import { Check } from "lucide-react"

type Notification = {
  id: number
  message: string
  time: string
  read: boolean
}

export function OrderNotifications({ notifications }: { notifications: Notification[] }) {
  return (
    <div className="rounded-lg border border-border/10 bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium">Notificaciones</h3>
        <button className="text-xs text-primary hover:underline">Marcar todas como leídas</button>
      </div>

      <div className="space-y-2">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start justify-between rounded-lg border border-border/10 p-3 ${
                notification.read ? "bg-secondary/20" : "bg-secondary/40"
              }`}
            >
              <div>
                <p className={`text-sm ${notification.read ? "text-muted-foreground" : "font-medium text-foreground"}`}>
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground">{notification.time}</p>
              </div>
              <button className="rounded-full p-1 text-muted-foreground hover:bg-secondary/50 hover:text-foreground">
                <Check className="h-4 w-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-border/10 bg-secondary/20 p-4 text-center text-sm text-muted-foreground">
            No hay notificaciones
          </div>
        )}
      </div>
    </div>
  )
}

