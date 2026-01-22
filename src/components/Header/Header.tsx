import styles from "./Header.module.css";
import { FiSearch, FiBell } from "react-icons/fi";

type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.search}>
        <FiSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Buscar pedido ou cliente..."
          className={styles.searchInput}
        />
      </div>

      <div className={styles.right}>
        <button className={styles.notification}>
          <FiBell />
        </button>

        <div className={styles.status}>
          <span>Status da Loja:</span>
          <span className={styles.badge}>ABERTA</span>
        </div>
      </div>
    </header>
  );
}
