import { useState } from "react";
import styles from "./Login.module.css";
import Colors from "../../themes/Colors";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { UserService } from "../../service/User.service";
import logo from "../../assets/logo.png";
type Props = {
  backgroundImageUrl?: string;
  onSubmit?: (data: {
    email: string;
    password: string;
    remember: boolean;
  }) => void;
};

export default function Login({
  backgroundImageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx5T1LvEjeIQBt-UxZLODbdXIF-tr7NXUvdQ&s",
  onSubmit,
}: Props) {
  const [email, setEmail] = useState("admim@giuseppevidal@gmail.com");
  const [password, setPassword] = useState("giuseppe@vidal");
  const [remember, setRemember] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const { login: contextLogin } = useAuth();

  async function login() {
    try {
      const payload = { email, password };
      const data = await UserService.login(payload);
      localStorage.setItem("token", data.token);
      contextLogin(data.token);
      navigate("/dashboard");
    } catch (error) {
      alert("Email ou senha inválidos");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit?.({ email, password, remember });
  }

  return (
    <div
      className={styles.page}
      style={
        {
          ["--bgPrimary" as any]: Colors.Background.primary,
          ["--bgSecondary" as any]: Colors.Background.secondary,
          ["--bgSidebar" as any]: Colors.Background.sidebar ?? "#1E1B18",
          ["--surface" as any]: Colors.Background.surface ?? "#FFFFFF",
          ["--surfaceMuted" as any]:
            Colors.Background.surfaceMuted ?? "#F0F1F5",
          ["--highlight" as any]: Colors.Highlight.primary,
          ["--textPrimary" as any]: Colors.Texts.primary,
          ["--textSecondary" as any]: Colors.Texts.secondary,
          ["--textMuted" as any]: Colors.Texts.muted ?? "#9CA3AF",
          ["--textOnDark" as any]: Colors.Texts.onDark ?? "#FFFFFF",
          ["--border" as any]: Colors.Border?.default ?? "#E5E7EB",
          ["--borderLight" as any]: Colors.Border?.light ?? "#F1F1F1",
          ["--heroImage" as any]: `url(${backgroundImageUrl})`,
        } as React.CSSProperties
      }
    >
      <div className={styles.left}>
        <div className={styles.leftBg} />
        <div className={styles.leftGlow} />
        <div className={styles.leftInner}>
          <img src={logo} alt="Logo" className={styles.logoImg} />
          <div className={styles.leftTitle}>Giuseppe Vidal</div>
          <div className={styles.leftDesc}>
            Gestão moderna de inventário e vendas
            <br />
            com inteligência e simplicidade.
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.formWrap}>
          <div className={styles.header}>
            <div className={styles.h1}>Bem-vindo</div>
            <div className={styles.sub}>
              Acesse sua conta para gerenciar seu negócio.
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label}>E-mail</label>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon} aria-hidden>
                <FiMail />
              </span>
              <input
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@pinha.com.br"
                type="email"
                autoComplete="email"
              />
            </div>

            <div className={styles.rowBetweenTop}>
              <label className={styles.label}>Senha</label>
              <button type="button" className={styles.forgot}>
                Esqueci minha senha
              </button>
            </div>

            <div className={styles.inputWrap}>
              <span className={styles.inputIcon} aria-hidden>
                <FiLock />
              </span>
              <input
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Manter conectado por 30 dias</span>
            </label>

            <button
              className={styles.submit}
              type="submit"
              onClick={() => login()}
            >
              ENTRAR
              <span className={styles.submitIcon} aria-hidden>
                <FiArrowRight />
              </span>
            </button>

            <div className={styles.support}>
              Ainda não tem acesso? <span>Fale com o suporte</span>
            </div>

            <div className={styles.copy}>© 2026 GIUSEPPE VIDAL.</div>
          </form>
        </div>
      </div>
    </div>
  );
}
