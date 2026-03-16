import { Link } from "@/i18n/navigation";

type Props = { params: { locale: string } };

const content = {
  en: {
    title: "Privacy Policy",
    updated: "Last updated: March 16, 2026",
    sections: [
      {
        title: "1. Overview",
        body: "QRcraft ('we', 'us', 'our') is committed to protecting your personal data. This Privacy Policy explains what information we collect, how we use it, and your rights regarding that data.",
      },
      {
        title: "2. Information We Collect",
        body: "When you sign in with Google, we receive and store your name, email address, and profile picture. When you use the service, we also store QR codes you create (title, type, content, design settings), scan count per QR code (a simple counter — no scanner IP or identity), and your subscription plan status.",
      },
      {
        title: "3. How We Use Your Data",
        body: "We use your data to provide and maintain the QRcraft service, to associate your QR codes with your account, to process payments and manage your subscription, and to send transactional emails (e.g. payment confirmations) — no marketing emails.",
      },
      {
        title: "4. Third-Party Services",
        body: "We use Google OAuth for authentication, MongoDB Atlas as our cloud database, and LiqPay as our payment processor for Pro subscriptions. Each service is governed by its own privacy policy.",
      },
      {
        title: "5. Data Retention",
        body: "Your data is retained as long as your account is active. You can request deletion of your account and all associated data by contacting us. QR codes you delete are removed immediately.",
      },
      {
        title: "6. Cookies",
        body: "We use session cookies solely to keep you signed in. We do not use tracking or advertising cookies.",
      },
      {
        title: "7. Your Rights",
        body: "You have the right to access, correct, or delete the personal data we hold about you. To exercise these rights, contact us at the email below.",
      },
      {
        title: "8. Contact",
        email: true,
        body: "If you have questions about this Privacy Policy, please contact us at",
      },
    ],
  },
  ua: {
    title: "Політика конфіденційності",
    updated: "Оновлено: 16 березня 2026 р.",
    sections: [
      {
        title: "1. Загальні положення",
        body: "QRcraft («ми», «нас», «наш») зобов'язується захищати ваші персональні дані. Ця Політика конфіденційності пояснює, яку інформацію ми збираємо, як її використовуємо та які права ви маєте щодо цих даних.",
      },
      {
        title: "2. Інформація, яку ми збираємо",
        body: "При вході через Google ми отримуємо і зберігаємо ваше ім'я, адресу електронної пошти та фото профілю. Під час використання сервісу ми також зберігаємо створені вами QR-коди (назва, тип, вміст, налаштування дизайну), кількість сканувань кожного QR-коду (лише лічильник — без IP або особистих даних), а також статус вашого тарифного плану.",
      },
      {
        title: "3. Як ми використовуємо ваші дані",
        body: "Ми використовуємо ваші дані для надання та підтримки сервісу QRcraft, прив'язки QR-кодів до вашого акаунту, обробки платежів та управління підпискою, а також для надсилання транзакційних листів (наприклад, підтвердження оплати) — без маркетингових розсилок.",
      },
      {
        title: "4. Сторонні сервіси",
        body: "Ми використовуємо Google OAuth для автентифікації, MongoDB Atlas як хмарну базу даних та LiqPay як платіжний процесор для Pro-підписок. Кожен сервіс регулюється власною політикою конфіденційності.",
      },
      {
        title: "5. Зберігання даних",
        body: "Ваші дані зберігаються поки ваш акаунт активний. Ви можете запросити видалення акаунту та всіх пов'язаних даних, зв'язавшись з нами. QR-коди, які ви видаляєте, видаляються негайно.",
      },
      {
        title: "6. Файли cookie",
        body: "Ми використовуємо сесійні cookie виключно для підтримки вашої авторизації. Ми не використовуємо трекінгові або рекламні cookie.",
      },
      {
        title: "7. Ваші права",
        body: "Ви маєте право на доступ, виправлення або видалення персональних даних, які ми зберігаємо. Для реалізації цих прав зв'яжіться з нами за електронною адресою нижче.",
      },
      {
        title: "8. Контакти",
        email: true,
        body: "Якщо у вас є запитання щодо цієї Політики конфіденційності, зв'яжіться з нами:",
      },
    ],
  },
};

export default function PrivacyPage({ params }: Props) {
  const c = params.locale === "ua" ? content.ua : content.en;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm no-underline mb-10 transition-colors"
          style={{ color: "var(--muted)" }}
        >
          ← QRcraft
        </Link>

        <h1 className="text-3xl font-black tracking-[-1px] mb-2" style={{ color: "var(--text)" }}>
          {c.title}
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--muted)" }}>{c.updated}</p>

        <div className="flex flex-col gap-8">
          {c.sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-base font-bold mb-3" style={{ color: "var(--text)" }}>{s.title}</h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {s.body}{" "}
                {s.email && (
                  <a href="mailto:support@qrcraft.app" style={{ color: "var(--purple-light)" }}>
                    support@qrcraft.app
                  </a>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
