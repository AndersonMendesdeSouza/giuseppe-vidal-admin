import type { CSSProperties } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar/Sidebar";
import styles from "./DashboardLayout.module.css";
import Colors from "../../themes/Colors";

export function DashboardLayout() {
  const colorVars = {
    "--bg-primary": Colors.Background.primary,
    "--surface": Colors.Background.surface,
    "--text-primary": Colors.Texts.primary,
    "--text-secondary": Colors.Texts.secondary,
  } as CSSProperties;

  return (
    <div className={styles.container} style={colorVars}>
      <Sidebar />

      <div className={styles.main}>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
