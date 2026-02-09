import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./ProductDetails.module.css";
import { FiEye, FiTrash2 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { BiTrash } from "react-icons/bi";
import { ProductService } from "../../service/Product.service";
import type { ProductResponse } from "../../dtos/response/product-response.dto";
import type { ProductRequest } from "../../dtos/request/product-request.dto";
import { ProductCategoryEnum } from "../../dtos/enums/product-category.enum";
import { ProductStatusEnum } from "../../dtos/enums/product-status.enum";

type Media = {
  id: string;
  url: string;
  isPrimary?: boolean;
  file?: File;
};

type FieldErrors = {
  name?: string;
  description?: string;
  category?: string;
  price?: string;
  promoPrice?: string;
  stockEnabled?: string;
  stock?: string;
};

export function ProductsDetails() {
  const [media, setMedia] = useState<Media[]>([]);
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const navigate = useNavigate();

  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [supplier, setSupplier] = useState("");
  const [collection, setCollection] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState<ProductCategoryEnum>(
    ProductCategoryEnum.FOOD,
  );
  const [price, setPrice] = useState("");
  const [promoPrice, setPromoPrice] = useState("");
  const [isActive, setActive] = useState<ProductStatusEnum>(
    ProductStatusEnum.DISABLED,
  );
  const [stockEnabled, setStockEnabled] = useState<boolean>(false);
  const [stock, setStock] = useState<string>("0");
  const [saving, setSaving] = useState(false);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function alterationIsActive(): void {
    const newStatus =
      isActive === ProductStatusEnum.ACTIVED
        ? ProductStatusEnum.DISABLED
        : ProductStatusEnum.ACTIVED;

    setActive(newStatus);
  }

  function alterationStockEnabled(): void {
    setStockEnabled((v) => !v);
    setErrors((prev) => ({ ...prev, stock: undefined }));
  }

  useEffect(() => {
    const fetchProduct = async () => {
      if (!isEdit || !id) {
        setProduct(null);
        setMedia([]);
        setName("");
        setDescription("");
        setSku("");
        setBrand("");
        setColor("");
        setSize("");
        setSupplier("");
        setCollection("");
        setNotes("");
        setCategory(ProductCategoryEnum.FOOD);
        setPrice("");
        setPromoPrice("");
        setActive(ProductStatusEnum.DISABLED);
        setStockEnabled(false);
        setStock("0");
        setErrors({});
        setSubmitted(false);
        return;
      }

      const data = await ProductService.findOne(id);
      setProduct(data);
      setActive(data.isActive as any);
      setStockEnabled(!!data.stockEnabled);
      setMedia(
        (data.images || []).map((img: any) => ({
          id: String(img.id ?? img.fileName ?? img.url),
          url: img.url,
          isPrimary: !!img.isPrimary,
        })),
      );

      setName(data.name || "");
      setDescription(data.description || "");
      setSku(String((data as any)?.sku ?? ""));
      setBrand(String((data as any)?.brand ?? ""));
      setColor(String((data as any)?.color ?? ""));
      setSize(String((data as any)?.size ?? ""));
      setSupplier(String((data as any)?.supplier ?? ""));
      setCollection(String((data as any)?.collection ?? ""));
      setNotes(String((data as any)?.notes ?? ""));
      setCategory(
        (data.category as ProductCategoryEnum) || ProductCategoryEnum.FOOD,
      );
      setPrice(data.price ? String(data.price).replace(".", ",") : "");
      setPromoPrice(
        data.promoPrice ? String(data.promoPrice).replace(".", ",") : "",
      );
      setStock(String(data.stock ?? 0));
      setErrors({});
      setSubmitted(false);
    };

    fetchProduct();
  }, [id, isEdit]);

  const primaryId = useMemo(
    () => media.find((m) => m.isPrimary)?.id ?? media[0]?.id,
    [media],
  );

  const setPrimary = (mid: string) => {
    setMedia((prev) => prev.map((m) => ({ ...m, isPrimary: m.id === mid })));
  };

  const removeMedia = (mid: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== mid));
  };

  function deletFood(pid: string | undefined): void {
    if (!pid) return;
    ProductService.remove(pid);
    navigate(-1);
  }

  const toDot = (v: string) => v.replace(/\./g, "").replace(",", ".").trim();

  function onPickFilesClick() {
    fileInputRef.current?.click();
  }

  function onFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const next = files.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      url: URL.createObjectURL(file),
      isPrimary: false,
      file,
    }));

    setMedia((prev) => {
      const merged = [...prev, ...next];
      if (!merged.some((m) => m.isPrimary) && merged.length) {
        merged[0] = { ...merged[0], isPrimary: true };
      }
      return merged;
    });

    e.target.value = "";
  }

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};

    if (!name.trim()) next.name = "Preencha o nome do produto";
    if (!description.trim()) next.description = "Preencha a descrição";
    if (!category) next.category = "Selecione uma categoria";

    const p = toDot(price);
    const pNum = p ? Number(p) : NaN;
    if (!price.trim()) next.price = "Preencha o preço";
    else if (!Number.isFinite(pNum) || pNum < 0)
      next.price = "Preço inválido";

    if (promoPrice.trim()) {
      const pp = toDot(promoPrice);
      const ppNum = Number(pp);
      if (!Number.isFinite(ppNum) || ppNum < 0)
        next.promoPrice = "Preço promocional inválido";
      if (Number.isFinite(ppNum) && Number.isFinite(pNum) && ppNum > pNum)
        next.promoPrice = "Promoção não pode ser maior que o preço base";
    }

    if (stockEnabled) {
      const sNum = Number(String(stock ?? "").trim());
      if (!String(stock ?? "").trim()) next.stock = "Informe o estoque";
      else if (!Number.isInteger(sNum) || sNum < 0)
        next.stock = "Estoque inválido";
    }

    return next;
  };

  async function onSave(): Promise<void> {
    if (saving) return;

    setSubmitted(true);

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      const firstKey = Object.keys(nextErrors)[0] as keyof FieldErrors;
      const el = document.querySelector(`[data-field="${firstKey}"]`);
      (el as any)?.scrollIntoView?.({ behavior: "smooth", block: "center" });
      return;
    }

    const payload: ProductRequest = {
      name: name.trim(),
      description: description.trim(),
      category,
      price: Number(toDot(price)),
      promoPrice: promoPrice.trim() ? Number(toDot(promoPrice)) : undefined,
      isActive,
      stockEnabled: !!stockEnabled,
      stock: stockEnabled ? Number(stock || 0) : 0,
    } as any;

    const filesToUpload = media
      .filter((m) => m.file instanceof File)
      .map((m) => m.file as File);

    try {
      setSaving(true);

      if (isEdit && id) {
        await ProductService.update(id, payload as any);
        navigate(-1);
        return;
      }

      await ProductService.create(payload, filesToUpload);
      navigate(-1);
    } finally {
      setSaving(false);
    }
  }

  const inputErrorClass = (key: keyof FieldErrors) =>
    submitted && errors[key] ? `${styles.input} ${styles.inputError}` : styles.input;

  const textareaErrorClass = (key: keyof FieldErrors) =>
    submitted && errors[key]
      ? `${styles.textarea} ${styles.inputError}`
      : styles.textarea;

  const selectErrorClass = (key: keyof FieldErrors) =>
    submitted && errors[key]
      ? `${styles.select} ${styles.inputError}`
      : styles.select;

  return (
    <div className={styles.page}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={onFilesSelected}
      />

      <div className={styles.top}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              className={styles.backBtn}
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Voltar"
            >
              ←
            </button>

            <h1 className={styles.title}>
              {isEdit ? "Editar produto" : "Cadastro de novo produto"}
            </h1>
          </div>
          <p className={styles.subtitle}>
            {isEdit
              ? "Atualize as informações e preços do produto."
              : "Preencha as informações e preços do produto."}
          </p>
        </div>

        <div className={styles.topActions}>
          <button className={styles.btnGhost} type="button">
            <FiEye />
            Visualizar
          </button>
          <button className={styles.discard} type="button">
            Cancelar
          </button>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              className={styles.save}
              type="button"
              onClick={onSave}
              disabled={saving}
            >
              <span className={styles.check}>✓</span>
              {isEdit ? "Salvar alteracoes" : "Salvar produto"}
            </button>

            {isEdit && (
              <button
                className={styles.delete}
                type="button"
                onClick={() => deletFood(product?.id)}
              >
                <BiTrash size={13} />
                Excluir produto
              </button>
            )}
          </div>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.sectionLabel}>
          <span className={styles.sectionDot} />
          FOTOS DO PRODUTO
        </div>

        <button
          className={styles.uploadCard}
          type="button"
          onClick={onPickFilesClick}
        >
          <div className={styles.uploadIcon}>+</div>
          <div className={styles.uploadText}>Clique para enviar imagens</div>
          <div className={styles.uploadHint}>PNG ou JPG ate 5MB</div>
        </button>

        <div className={styles.gallery}>
          {media.map((m) => (
            <div
              key={m.id}
              className={`${styles.mediaCard} ${
                m.id === primaryId ? styles.mediaCardActive : ""
              }`}
            >
              {m.id === primaryId ? (
                <div className={styles.primaryTag}>Principal</div>
              ) : null}

              <img src={m.url} alt="" className={styles.mediaImg} />

              <div className={styles.mediaActions}>
                <button
                  className={styles.mediaBtn}
                  type="button"
                  onClick={() => setPrimary(m.id)}
                  aria-label="Definir como principal"
                >
                  ★
                </button>
                <button
                  className={styles.mediaBtn}
                  type="button"
                  onClick={() => removeMedia(m.id)}
                  aria-label="Excluir"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelIcon}>📄</span>
              <span className={styles.panelTitle}>Informacoes basicas</span>
            </div>

            <div className={styles.form}>
              <div className={styles.field} data-field="name">
                <label className={styles.label}>NOME DO PRODUTO</label>
                <input
                  className={inputErrorClass("name")}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (submitted)
                      setErrors((p) => ({ ...p, name: undefined }));
                  }}
                />
                {submitted && errors.name ? (
                  <div className={styles.fieldError}>{errors.name}</div>
                ) : null}
              </div>

              <div className={styles.row2}>
                <div className={styles.field} data-field="category">
                  <label className={styles.label}>CATEGORIA</label>
                  <select
                    className={selectErrorClass("category")}
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value as ProductCategoryEnum);
                      if (submitted)
                        setErrors((p) => ({ ...p, category: undefined }));
                    }}
                  >
                    <option value={ProductCategoryEnum.FOOD}>Camisetas</option>
                    <option value={ProductCategoryEnum.DRINK}>Calcas</option>
                    <option value={ProductCategoryEnum.ADDON}>Vestidos</option>
                    <option value={ProductCategoryEnum.DESSERT}>
                      Acessorios
                    </option>
                  </select>
                  {submitted && errors.category ? (
                    <div className={styles.fieldError}>{errors.category}</div>
                  ) : null}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>STATUS</label>
                  <div className={styles.availability}>
                    <button
                      type="button"
                      className={`${styles.pill} ${
                        isActive === ProductStatusEnum.ACTIVED
                          ? styles.pillOn
                          : styles.pillOff
                      }`}
                      aria-label="Disponivel"
                      onClick={() => alterationIsActive()}
                    >
                      <span className={styles.pillDot} />
                    </button>
                    <span className={styles.disp}>DISP.</span>
                  </div>
                </div>
              </div>

              <div className={styles.field} data-field="description">
                <label className={styles.label}>DESCRICAO DETALHADA</label>
                <textarea
                  className={textareaErrorClass("description")}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (submitted)
                      setErrors((p) => ({ ...p, description: undefined }));
                  }}
                />
                {submitted && errors.description ? (
                  <div className={styles.fieldError}>{errors.description}</div>
                ) : null}
              </div>
            </div>
          </div>

        <div className={styles.panelGrid}>
          <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <span className={styles.panelIcon}>🏷️</span>
                <span className={styles.panelTitle}>Atributos</span>
              </div>

              <div className={styles.form}>
                <div className={styles.row2}>
                  <div className={styles.field}>
                    <label className={styles.label}>SKU</label>
                    <input
                      className={styles.input}
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>MARCA</label>
                    <input
                      className={styles.input}
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.row2}>
                  <div className={styles.field}>
                    <label className={styles.label}>COR</label>
                    <input
                      className={styles.input}
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>TAMANHO</label>
                    <input
                      className={styles.input}
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <span className={styles.panelIcon}>💳</span>
                <span className={styles.panelTitle}>Preco e estoque</span>
              </div>

              <div className={styles.form}>
                <div className={styles.row2}>
                  <div className={styles.field} data-field="price">
                    <label className={styles.label}>PRECO DE VENDA</label>
                    <div className={styles.moneyInput}>
                      <span className={styles.moneyPrefix}>R$</span>
                      <input
                        className={inputErrorClass("price")}
                        value={price}
                        onChange={(e) => {
                          setPrice(e.target.value);
                          if (submitted)
                            setErrors((p) => ({ ...p, price: undefined }));
                        }}
                      />
                    </div>
                    {submitted && errors.price ? (
                      <div className={styles.fieldError}>{errors.price}</div>
                    ) : null}
                  </div>

                  <div className={styles.field} data-field="promoPrice">
                    <label className={styles.label}>PRECO PROMOCIONAL</label>
                    <div className={styles.moneyInput}>
                      <span className={styles.moneyPrefix}>R$</span>
                      <input
                        className={
                          submitted && errors.promoPrice
                            ? `${styles.input} ${styles.inputMuted} ${styles.inputError}`
                            : `${styles.input} ${styles.inputMuted}`
                        }
                        value={promoPrice}
                        onChange={(e) => {
                          setPromoPrice(e.target.value);
                          if (submitted)
                            setErrors((p) => ({ ...p, promoPrice: undefined }));
                        }}
                      />
                    </div>
                    {submitted && errors.promoPrice ? (
                      <div className={styles.fieldError}>{errors.promoPrice}</div>
                    ) : (
                      <div className={styles.help}>
                        Deixe em branco para nao aplicar promocao.
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>ESTOQUE</label>
                  <div className={styles.inventory}>
                    <span className={styles.inventoryLabel}>
                      Ativar controle de estoque
                    </span>
                    <div className={styles.availability}>
                      <button
                        type="button"
                        className={`${styles.pill} ${
                          stockEnabled ? styles.pillOn : styles.pillOff
                        }`}
                        aria-label="Disponivel"
                        onClick={() => alterationStockEnabled()}
                      >
                        <span className={styles.pillDot} />
                      </button>
                      <span className={styles.disp}>DISP.</span>
                    </div>
                  </div>
                </div>

                {stockEnabled && (
                  <div className={styles.field} data-field="stock">
                    <label className={styles.label}>QTD. EM ESTOQUE</label>
                    <input
                      className={inputErrorClass("stock")}
                      value={stock}
                      onChange={(e) => {
                        setStock(e.target.value);
                        if (submitted)
                          setErrors((p) => ({ ...p, stock: undefined }));
                      }}
                    />
                    {submitted && errors.stock ? (
                      <div className={styles.fieldError}>{errors.stock}</div>
                    ) : null}
                  </div>
                )}
              </div>
          </div>
        </div>

        <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelIcon}>🧾</span>
              <span className={styles.panelTitle}>Detalhes adicionais</span>
            </div>

            <div className={styles.form}>
              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.label}>FORNECEDOR</label>
                  <input
                    className={styles.input}
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>COLECAO</label>
                  <input
                    className={styles.input}
                    value={collection}
                    onChange={(e) => setCollection(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>OBSERVACOES</label>
                <textarea
                  className={styles.textarea}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
        </div>
      </div>
  );
}
