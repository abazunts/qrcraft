import { Link } from "@/i18n/navigation";

type Props = { params: { locale: string } };

const content = {
  en: {
    title: "Terms of Service",
    updated: "Last updated: March 16, 2026",
    sections: [
      {
        title: "1. Acceptance of Terms",
        body: "By accessing or using QRcraft, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.",
      },
      {
        title: "2. Description of Service",
        body: "QRcraft is a web-based tool for creating, managing, and tracking QR codes. We offer a Free plan and a Pro subscription with expanded capabilities.",
      },
      {
        title: "3. Plans and Limits",
        body: "The Free plan includes up to 5 QR codes, URL and text types, and PNG export. The Pro plan includes unlimited QR codes, all content types, custom design, and full analytics, billed at €4.99/month via LiqPay. We reserve the right to adjust plan limits with reasonable notice.",
      },
      {
        title: "4. Account Responsibilities",
        body: "You are responsible for maintaining the security of your account, all activity that occurs under your account, and ensuring the content encoded in your QR codes complies with applicable laws.",
      },
      {
        title: "5. Prohibited Uses",
        body: "You may not use QRcraft to create QR codes that link to malware, phishing, or illegal content; violate any applicable law; infringe intellectual property rights of others; or are used for spam. We reserve the right to suspend accounts that violate these rules.",
      },
      {
        title: "6. Payments and Cancellation",
        body: "Pro subscriptions are processed through LiqPay. By subscribing, you authorise monthly charges of €4.99. You can cancel at any time from the Billing page. Access to Pro features continues until the end of the current billing period. We do not offer refunds for partial months.",
      },
      {
        title: "7. Data and Content",
        body: "QR codes and data you create remain yours. We do not claim ownership over your content. By using the service, you grant us a limited licence to store and process your content solely to provide the service.",
      },
      {
        title: "8. Availability",
        body: "We strive for high availability but do not guarantee uninterrupted access. We are not liable for losses resulting from downtime, data loss, or service interruptions.",
      },
      {
        title: "9. Limitation of Liability",
        body: "To the maximum extent permitted by law, QRcraft is provided 'as is' without warranty of any kind. Our total liability to you shall not exceed the amount you paid us in the last 3 months.",
      },
      {
        title: "10. Changes to Terms",
        body: "We may update these Terms at any time. Continued use of the service after changes constitutes acceptance of the new Terms. We will notify users of significant changes via email.",
      },
      {
        title: "11. Contact",
        email: true,
        body: "For questions about these Terms, contact us at",
      },
    ],
  },
  ua: {
    title: "Умови використання",
    updated: "Оновлено: 16 березня 2026 р.",
    sections: [
      {
        title: "1. Прийняття умов",
        body: "Використовуючи QRcraft, ви погоджуєтесь з цими Умовами використання. Якщо ви не погоджуєтесь — будь ласка, не використовуйте сервіс.",
      },
      {
        title: "2. Опис сервісу",
        body: "QRcraft — це веб-інструмент для створення, управління та відстеження QR-кодів. Ми пропонуємо безкоштовний план та Pro-підписку з розширеними можливостями.",
      },
      {
        title: "3. Плани та обмеження",
        body: "Безкоштовний план включає до 5 QR-кодів, типи URL та текст, експорт PNG. Pro-план включає необмежену кількість QR-кодів, всі типи контенту, кастомний дизайн та повну аналітику за €4.99/місяць через LiqPay. Ми залишаємо за собою право змінювати ліміти з розумним попередженням.",
      },
      {
        title: "4. Відповідальність акаунту",
        body: "Ви несете відповідальність за безпеку свого акаунту, всі дії в рамках вашого акаунту, а також за відповідність вмісту ваших QR-кодів чинному законодавству.",
      },
      {
        title: "5. Заборонене використання",
        body: "Ви не можете використовувати QRcraft для створення QR-кодів, що ведуть на шкідливе програмне забезпечення, фішинг або незаконний контент; порушують законодавство; порушують права інтелектуальної власності; або використовуються для спаму. Ми залишаємо за собою право призупиняти акаунти, що порушують ці правила.",
      },
      {
        title: "6. Платежі та скасування",
        body: "Pro-підписки обробляються через LiqPay. Оформлюючи підписку, ви дозволяєте щомісячне списання €4.99. Ви можете скасувати підписку будь-коли на сторінці Тарифів. Доступ до Pro-функцій зберігається до кінця поточного розрахункового періоду. Повернення коштів за неповний місяць не передбачено.",
      },
      {
        title: "7. Дані та контент",
        body: "QR-коди та дані, які ви створюєте, залишаються вашою власністю. Ми не претендуємо на право власності над вашим контентом. Використовуючи сервіс, ви надаєте нам обмежену ліцензію на зберігання та обробку вашого контенту виключно для надання сервісу.",
      },
      {
        title: "8. Доступність",
        body: "Ми прагнемо до високої доступності сервісу, але не гарантуємо безперебійну роботу. Ми не несемо відповідальності за збитки внаслідок простою, втрати даних або перебоїв у роботі.",
      },
      {
        title: "9. Обмеження відповідальності",
        body: "Максимально допустимою законом мірою QRcraft надається «як є» без будь-яких гарантій. Наша сукупна відповідальність перед вами не перевищує суму, сплачену вами за останні 3 місяці.",
      },
      {
        title: "10. Зміни умов",
        body: "Ми можемо оновлювати ці Умови в будь-який час. Продовження використання сервісу після змін означає прийняття нових Умов. Про суттєві зміни ми повідомлятимемо електронною поштою.",
      },
      {
        title: "11. Контакти",
        email: true,
        body: "З питань щодо цих Умов звертайтесь:",
      },
    ],
  },
};

export default function TermsPage({ params }: Props) {
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
