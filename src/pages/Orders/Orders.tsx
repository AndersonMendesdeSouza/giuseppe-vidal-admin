import { OrderStatusEnum } from "../../dtos/enums/orders-status.enum";
import type { Order } from "../../types/Orders-type";
import styles from "./Orders.module.css";
import { FiMoreHorizontal, FiPlus } from "react-icons/fi";
import { OrderCard } from "../../components/OrderCard";

const MOCK_ORDERS: Order[] = [
  {
    id: "o1",
    number: "1234",
    customerName: "Ricardo Silva",
    minutes: 12,
    total: 45.9,
    status: OrderStatusEnum.NEW,
    items: [
      { name: "Double Bacon Burger", quantity: 1 },
      { name: "Batata Frita G", quantity: 1 },
    ],
  },
  {
    id: "o1",
    number: "1234",
    customerName: "Ricardo Silva",
    minutes: 12,
    total: 45.9,
    status: OrderStatusEnum.NEW,
    items: [
      { name: "Double Bacon Burger", quantity: 1 },
      { name: "Batata Frita G", quantity: 1 },
    ],
  },
  {
    id: "o1",
    number: "1234",
    customerName: "Ricardo Silva",
    minutes: 12,
    total: 45.9,
    status: OrderStatusEnum.NEW,
    items: [
      { name: "Double Bacon Burger", quantity: 1 },
      { name: "Batata Frita G", quantity: 1 },
    ],
  },
  {
    id: "o1",
    number: "1234",
    customerName: "Ricardo Silva",
    minutes: 12,
    total: 45.9,
    status: OrderStatusEnum.NEW,
    items: [
      { name: "Double Bacon Burger", quantity: 1 },
      { name: "Batata Frita G", quantity: 1 },
    ],
  },
  {
    id: "o1",
    number: "1234",
    customerName: "Ricardo Silva",
    minutes: 12,
    total: 45.9,
    status: OrderStatusEnum.NEW,
    items: [
      { name: "Double Bacon Burger", quantity: 1 },
      { name: "Batata Frita G", quantity: 1 },
    ],
  },
  {
    id: "o2",
    number: "1237",
    customerName: "Carla Dias",
    minutes: 2,
    total: 75,
    status: OrderStatusEnum.NEW,
    items: [{ name: "Smash Burger", quantity: 3 }],
    urgent: true,
  },
  {
    id: "o3",
    number: "1235",
    customerName: "Ana Oliveira",
    minutes: 8,
    total: 62,
    status: OrderStatusEnum.PREPARING,
    items: [
      { name: "Smash Burger", quantity: 2 },
      { name: "Coca-Cola 350ml", quantity: 1 },
    ],
    cookingLabel: "Cozinhando...",
  },
  {
    id: "o4",
    number: "1236",
    customerName: "Bruno Souza",
    minutes: 6,
    total: 38.5,
    status: OrderStatusEnum.ON_ROUTE,
    courierName: "João Pedro",
  },
  {
    id: "o5",
    number: "1240",
    customerName: "Marina Costa",
    minutes: 4,
    total: 51.9,
    status: OrderStatusEnum.PREPARING,
    items: [{ name: "Batata Frita G", quantity: 2 }],
    cookingLabel: "Cozinhando...",
  },
  {
    id: "o6",
    number: "1242",
    customerName: "Paulo Henrique",
    minutes: 15,
    total: 29.9,
    status: OrderStatusEnum.ON_ROUTE,
    courierName: "Luan",
  },
];

function ColumnHeader({
  title,
  count,
  tone,
}: {
  title: string;
  count: number;
  tone: "yellow" | "blue" | "orange";
}) {
  return (
    <div className={styles.columnHeader}>
      <div className={styles.columnTitle}>
        <span className={`${styles.dot} ${styles[`dot_${tone}`]}`} />
        <span className={styles.columnTitleText}>{title}</span>
        <span className={`${styles.count} ${styles[`count_${tone}`]}`}>
          {String(count).padStart(2, "0")}
        </span>
      </div>

      <button className={styles.kebab} type="button" aria-label="Menu">
        <FiMoreHorizontal />
      </button>
    </div>
  );
}

export function Orders() {
  const news = MOCK_ORDERS.filter((o) => o.status === OrderStatusEnum.NEW);
  const preparing = MOCK_ORDERS.filter(
    (o) => o.status === OrderStatusEnum.PREPARING,
  );
  const onRoute = MOCK_ORDERS.filter(
    (o) => o.status === OrderStatusEnum.ON_ROUTE,
  );

  return (
    <div className={styles.page}>
      <div className={styles.board}>
        <section className={styles.column}>
          <ColumnHeader title="NOVOS" count={news.length} tone="yellow" />
          <div className={styles.list}>
            {news.map((o) => (
              <div
                key={o.id}
                className={`${styles.cardWrapper} ${styles.cardWrapper_yellow}`}
              >
                <OrderCard
                  navigateTo="/orders-details"
                  status={o.status}
                  orderNumber={o.number}
                  customerName={o.customerName}
                  minutesAgo={o.minutes}
                  items={(o.items || []).map((it) => ({
                    name: it.name,
                    quantity: it.quantity,
                  }))}
                  total={o.total}
                />
              </div>
            ))}
          </div>
        </section>

        <section className={styles.column}>
          <ColumnHeader
            title="EM PREPARO"
            count={preparing.length}
            tone="blue"
          />
          <div className={styles.list}>
            {preparing.map((o) => (
              <div
                key={o.id}
                className={`${styles.cardWrapper} ${styles.cardWrapper_blue}`}
              >
                <OrderCard
                  navigateTo="/orders-details"
                  status={o.status}
                  orderNumber={o.number}
                  customerName={o.customerName}
                  minutesAgo={o.minutes}
                  items={(o.items || []).map((it) => ({
                    name: it.name,
                    quantity: it.quantity,
                  }))}
                  total={o.total}
                />
              </div>
            ))}
          </div>
        </section>

        <section className={styles.column}>
          <ColumnHeader title="EM ROTA" count={onRoute.length} tone="orange" />
          <div className={styles.list}>
            {onRoute.map((o) => (
              <div
                key={o.id}
                className={`${styles.cardWrapper} ${styles.cardWrapper_orange}`}
              >
                <OrderCard
                  navigateTo="/orders-details"
                  status={o.status}
                  orderNumber={o.number}
                  customerName={o.customerName}
                  minutesAgo={o.minutes}
                  items={
                    o.items && o.items.length
                      ? o.items.map((it) => ({
                          name: it.name,
                          quantity: it.quantity,
                        }))
                      : [
                          {
                            name: `Entregador | ${o.courierName || "—"}`,
                            quantity: 1,
                          },
                        ]
                  }
                  total={o.total}
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      <button className={styles.fab} type="button" aria-label="Novo pedido">
        <FiPlus />
      </button>
    </div>
  );
}
