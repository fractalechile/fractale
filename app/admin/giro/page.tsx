import { redirect } from "next/navigation";

// El panel del Giro del Lago pasó a /admin/visitas, que sirve para cualquier evento.
export default function PanelGiro() {
  redirect("/admin/visitas?evento=giro-del-lago-2026");
}
