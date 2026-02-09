import type { CSSProperties } from "react";
import styles from "./Product.module.css";
import { useEffect, useMemo, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
import ProductCard from "../../components/ProductCard";
import { CgFileAdd } from "react-icons/cg";
import type { CategoryKey } from "../../types/Product-type";
import { ProductService } from "../../service/Product.service";
import type { ProductResponse } from "../../dtos/response/product-response.dto";
import { ProductCategoryEnum } from "../../dtos/enums/product-category.enum";
import { useNavigate } from "react-router-dom";
import Colors from "../../themes/Colors";

export function Products() {
  const [activeCat, setActiveCat] = useState<CategoryKey>("all");
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const categoryFromKey = (key: CategoryKey) => {
    switch (key) {
      case "hamburgers":
        return ProductCategoryEnum.FOOD;
      case "sides":
        return ProductCategoryEnum.ADDON;
      case "drinks":
        return ProductCategoryEnum.DRINK;
      case "desserts":
        return ProductCategoryEnum.DESSERT;
      default:
        return null;
    }
  };

  const filtered = useMemo(() => {
    let current = products;
    if (activeCat !== "all") {
      const category = categoryFromKey(activeCat);
      if (category) {
        current = current.filter((p) => p.category === category);
      }
    }

    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return current;
    return current.filter((p) => p.name.toLowerCase().includes(trimmed));
  }, [activeCat, products, query]);

  const pageSize = 4;
  const total = filtered.length;
  const maxPage = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, maxPage);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  const counts = useMemo(() => {
    const countBy = (category: ProductCategoryEnum) =>
      products.filter((p) => p.category === category).length;

    return {
      all: products.length,
      hamburgers: countBy(ProductCategoryEnum.FOOD),
      sides: countBy(ProductCategoryEnum.ADDON),
      drinks: countBy(ProductCategoryEnum.DRINK),
      desserts: countBy(ProductCategoryEnum.DESSERT),
    };
  }, [products]);

  const CATEGORIES: { key: CategoryKey; label: string }[] = useMemo(
    () => [
      { key: "all", label: `Todos ${counts.all}` },
      { key: "hamburgers", label: "Comidas" },
      { key: "sides", label: "Acompanhamentos " },
      { key: "drinks", label: "Bebidas" },
      { key: "desserts", label: "Sobremesas" },
    ],
    [counts],
  );

  const totalValue = useMemo(() => {
    return products.reduce((sum, p) => sum + Number(p.price || 0), 0);
  }, [products]);

  const lowStock = useMemo(() => {
    return products.filter((p) => p.stockEnabled && (p.stock ?? 0) <= 5).length;
  }, [products]);

  const categoryTotal = useMemo(() => {
    return new Set(products.map((p) => p.category)).size;
  }, [products]);

  const colorVars = {
    "--bg-primary": Colors.Background.primary,
    "--surface": Colors.Background.surface,
    "--surface-muted": Colors.Background.surfaceMuted,
    "--text-primary": Colors.Texts.primary,
    "--text-secondary": Colors.Texts.secondary,
    "--text-muted": Colors.Texts.muted,
    "--border-default": Colors.Border.default,
    "--highlight-primary": Colors.Highlight.primary,
    "--highlight-secondary": Colors.Highlight.secondary,
    "--status-warning": Colors.Status.warning,
    "--status-warning-bg": Colors.Status.warningBg,
  } as CSSProperties;

  // const getPrimaryImageUrl = (images: ImageResponse[]) => {
  //   const primary = (images || []).find((img: any) => img?.isPrimary);
  //   return primary?.url || (images?.[0] as any)?.url || "";
  // };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ProductService.findAll();
        setProducts(data);
      } catch (err: any) {
        console.error(err);
        setError("Erro ao carregar produtos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className={styles.page} style={colorVars}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestao de Produtos</h1>
        </div>

        <div className={styles.headerActions}>
          <button
            className={styles.addBtn}
            type="button"
            onClick={() => navigate("/product-details")}
          >
            <CgFileAdd size={18} />
            Cadastrar novo produto
          </button>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>TOTAL DE PRODUTOS</div>
          <div className={styles.statValue}>{counts.all.toLocaleString("pt-BR")}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>ESTOQUE BAIXO</div>
          <div className={`${styles.statValue} ${styles.statValueWarn}`}>
            {lowStock}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>VALOR TOTAL</div>
          <div className={styles.statValue}>
            {totalValue.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>CATEGORIAS</div>
          <div className={styles.statValue}>{categoryTotal}</div>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.search}>
          <FiSearch className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Buscar produtos..."
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className={styles.filterActions}>
          <select
            className={styles.categorySelect}
            value={activeCat}
            onChange={(event) => {
              setActiveCat(event.target.value as CategoryKey);
              setPage(1);
            }}
          >
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
          <button className={styles.filterBtn} type="button">
            <FiFilter />
            Filtros
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 12 }}>Carregando...</div>
      ) : error ? (
        <div style={{ padding: 12 }}>{error}</div>
      ) : (
        <div className={styles.grid}>
          {paginated.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              description={p.description}
              category={p.category}
              price={p.price}
              imageUrl={p.images}
              isActive={p.isActive}
              stockEnabled={p.stockEnabled}
              stock={p.stock}
              available
              onEdit={() => {}}
              onDelete={() => {}}
              onToggleAvailable={() => {}}
              navigateTo="/product-details"
            />
          ))}
        </div>
      )}

      <div className={styles.bottom}>
        <div className={styles.counter}>
          Exibindo {paginated.length} de {total} produtos cadastrados
        </div>

        <div className={styles.pager}>
          <button
            type="button"
            className={styles.pagerBtn}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            aria-label="Anterior"
            disabled={currentPage <= 1}
          >
            <FiChevronLeft />
          </button>
          <button
            type="button"
            className={styles.pagerBtn}
            onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
            aria-label="Próximo"
            disabled={currentPage >= maxPage}
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      <button
        className={styles.fab}
        type="button"
        aria-label="Adicionar produto"
        onClick={() => navigate("/product-details")}
      >
        <FiPlus />
      </button>
    </div>
  );
}
