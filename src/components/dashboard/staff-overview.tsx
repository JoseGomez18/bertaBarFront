export function StaffOverview() {
  const staff = [
    { name: "Ana García", role: "Bartender", status: "active" },
    { name: "Carlos López", role: "Mesero", status: "active" },
    { name: "María Rodríguez", role: "Bartender", status: "break" },
  ]

  return (
    <div className="glass-effect rounded-xl p-6">
      <h3 className="text-lg font-semibold">Personal en Turno</h3>
      <div className="mt-4 space-y-4">
        {staff.map((member) => (
          <div
            key={member.name}
            className="flex items-center justify-between rounded-lg border border-border/10 bg-secondary/30 p-4"
          >
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
            <StatusBadge status={member.status} />
          </div>
        ))}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusStyles = {
    active: "bg-green-500/20 text-green-500",
    break: "bg-yellow-500/20 text-yellow-500",
    offline: "bg-gray-500/20 text-gray-500",
  }

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}>
      {status === "active" ? "Activo" : status === "break" ? "Descanso" : "Ausente"}
    </span>
  )
}

