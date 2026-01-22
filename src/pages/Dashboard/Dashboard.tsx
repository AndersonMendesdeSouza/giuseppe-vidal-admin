import styles from "./Dashboard.module.css";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { FiDownload, FiCalendar, FiEye } from "react-icons/fi";

type MetricCard = {
  label: string;
  value: string;
  badge: string;
  icon: "money" | "orders" | "ticket" | "top";
  sub?: string;
};

type RecentSale = {
  id: string;
  date: string;
  time: string;
  client: { initials: string };
  clientName: string;
  products: string;
  total: string;
  status: "CONCLUIDO" | "CANCELADO";
};

const METRICS: MetricCard[] = [
  { label: "FATURAMENTO TOTAL", value: "R$ 12.450,00", badge: "+12.5%", icon: "money" },
  { label: "NÚMERO DE PEDIDOS", value: "432", badge: "+5.2%", icon: "orders" },
  { label: "TICKET MÉDIO", value: "R$ 28,82", badge: "+2.1%", icon: "ticket" },
  {
    label: "PRODUTO MAIS VENDIDO",
    value: "Bacon Deluxe",
    sub: "85 unidades este mês",
    badge: "Top 1",
    icon: "top",
  },
];

const CHART_DATA = [
  { name: "SEG", value: 48 },
  { name: "TER", value: 64 },
  { name: "QUA", value: 58 },
  { name: "QUI", value: 92 },
  { name: "SEX", value: 24 },
  { name: "SÁB", value: 96 },
  { name: "DOM", value: 86 },
];

const RECENT: RecentSale[] = [
  {
    id: "#88421",
    date: "12 Out",
    time: "19:42",
    client: { initials: "RM" },
    clientName: "Ricardo Mendes",
    products: "1x Bacon Deluxe, 1x Batata M",
    total: "R$ 54,90",
    status: "CONCLUIDO",
  },
  {
    id: "#88428",
    date: "12 Out",
    time: "19:30",
    client: { initials: "AS" },
    clientName: "Amanda Silva",
    products: "2x Cheese Burger, 2x Coca-Cola",
    total: "R$ 82,00",
    status: "CONCLUIDO",
  },
  {
    id: "#88419",
    date: "12 Out",
    time: "19:25",
    client: { initials: "JO" },
    clientName: "João Oliveira",
    products: "1x Smash Onion, 1x Suco Natural",
    total: "R$ 42,50",
    status: "CANCELADO",
  },
  {
    id: "#88418",
    date: "12 Out",
    time: "19:10",
    client: { initials: "CP" },
    clientName: "Carla P.",
    products: "3x Combo Kids",
    total: "R$ 115,00",
    status: "CONCLUIDO",
  },
];

function MetricIcon({ kind }: { kind: MetricCard["icon"] }) {
  if (kind === "money") return <span className={styles.metricIcon}>💰</span>;
  if (kind === "orders") return <span className={styles.metricIcon}>🛒</span>;
  if (kind === "ticket") return <span className={styles.metricIcon}>🎟️</span>;
  return <span className={styles.metricIcon}>🏆</span>;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipTitle}>{label}</div>
      <div className={styles.tooltipValue}>R$ {Number(payload[0].value * 13).toFixed(2)}</div>
    </div>
  );
}

export function Dashboard() {
  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <div>
          <h1 className={styles.title}>Relatórios de Vendas</h1>
          <p className={styles.subtitle}>
            Acompanhe o desempenho comercial da sua hamburgueria em tempo real.
          </p>
        </div>

        <div className={styles.actions}>
          <button className={styles.btnGhost} type="button">
            <FiDownload />
            Exportar CSV
          </button>
          <button className={styles.btnPrimary} type="button">
            <FiDownload />
            Exportar PDF
          </button>
        </div>
      </div>

      <div className={styles.metrics}>
        {METRICS.map((m) => (
          <div key={m.label} className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <MetricIcon kind={m.icon} />
              <span className={styles.metricBadge}>{m.badge}</span>
            </div>

            <div className={styles.metricLabel}>{m.label}</div>

            {m.sub ? (
              <>
                <div className={styles.metricValueSmall}>{m.value}</div>
                <div className={styles.metricSub}>{m.sub}</div>
              </>
            ) : (
              <div className={styles.metricValue}>{m.value}</div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <div className={styles.panelTitle}>Desempenho de Vendas</div>
            <div className={styles.panelSub}>
              Volume de vendas diário no período selecionado
            </div>
          </div>

          <div className={styles.tabs}>
            <button className={styles.tab} type="button">
              Dia
            </button>
            <button className={`${styles.tab} ${styles.tabActive}`} type="button">
              Semana
            </button>
            <button className={styles.tab} type="button">
              Mês
            </button>
          </div>
        </div>

        <div className={styles.chartWrap}>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={CHART_DATA} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillYellow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffd400" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#ffd400" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#ffd400"
                strokeWidth={3}
                fill="url(#fillYellow)"
                dot={false}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.tablePanel}>
        <div className={styles.tableHeader}>
          <div className={styles.tableTitle}>Vendas Recentes</div>

          <div className={styles.tableActions}>
            <button className={styles.filterBtn} type="button">
              <FiCalendar />
              01Out - 31Out
            </button>
            <button className={styles.filterBtn} type="button">
              Todos os Status
            </button>
          </div>
        </div>

        <div className={styles.table}>
          <div className={`${styles.row} ${styles.thead}`}>
            <div>ID PEDIDO</div>
            <div>DATA/HORA</div>
            <div>CLIENTE</div>
            <div>PRODUTOS</div>
            <div>VALOR TOTAL</div>
            <div>STATUS</div>
            <div>AÇÕES</div>
          </div>

          {RECENT.map((r) => (
            <div key={r.id} className={styles.row}>
              <div className={styles.idCell}>{r.id}</div>

              <div className={styles.dateCell}>
                <div>{r.date}</div>
                <div className={styles.muted}>{r.time}</div>
              </div>

              <div className={styles.clientCell}>
                <div className={styles.avatar}>{r.client.initials}</div>
                <div className={styles.clientName}>{r.clientName}</div>
              </div>

              <div className={styles.productsCell}>{r.products}</div>

              <div className={styles.totalCell}>{r.total}</div>

              <div>
                <span
                  className={
                    r.status === "CONCLUIDO" ? styles.statusOk : styles.statusBad
                  }
                >
                  {r.status}
                </span>
              </div>

              <div className={styles.actionsCell}>
                <button className={styles.eyeBtn} type="button" aria-label="Ver">
                  <FiEye />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.tableFooter}>
          <div className={styles.muted}>Mostrando 4 de 432 pedidos</div>

          <div className={styles.pagination}>
            <button className={`${styles.pageBtn} ${styles.pageBtnActive}`} type="button">
              1
            </button>
            <button className={styles.pageBtn} type="button">
              2
            </button>
            <button className={styles.pageBtn} type="button">
              3
            </button>
            <button className={styles.pageBtn} type="button">
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
