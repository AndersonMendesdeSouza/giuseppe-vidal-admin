import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar/Sidebar";
import { Header } from "../Header/Header";
import styles from "./DashboardLayout.module.css";

export function DashboardLayout() {
  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.main}>
        <Header title="Dashboard de Pedidos" />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
