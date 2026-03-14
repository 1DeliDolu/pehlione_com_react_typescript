import { getMailTransporter } from "./providers/nodemailer.js";
import { env } from "../../config/env.js";

const FROM = `"${env.MAIL_FROM_NAME}" <${env.MAIL_FROM_ADDRESS}>`;

export async function sendVerificationEmail(
  to: string,
  name: string,
  token: string,
): Promise<void> {
  const link = `${env.APP_ORIGIN}/verify-email?token=${token}`;
  await getMailTransporter().sendMail({
    from: FROM,
    to,
    subject: "E-posta adresinizi doğrulayın",
    html: `
      <h2>Merhaba ${name},</h2>
      <p>Hesabınızı doğrulamak için aşağıdaki bağlantıya tıklayın:</p>
      <a href="${link}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;border-radius:6px;text-decoration:none;">E-postayı Doğrula</a>
      <p>Bu bağlantı 24 saat geçerlidir.</p>
      <p>Eğer bu isteği siz yapmadıysanız bu e-postayı görmezden gelebilirsiniz.</p>
    `,
    text: `Hesabınızı doğrulamak için bu bağlantıya gidin: ${link}`,
  });
}

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  token: string,
): Promise<void> {
  const link = `${env.APP_ORIGIN}/reset-password?token=${token}`;
  await getMailTransporter().sendMail({
    from: FROM,
    to,
    subject: "Şifre sıfırlama isteği",
    html: `
      <h2>Merhaba ${name},</h2>
      <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
      <a href="${link}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;border-radius:6px;text-decoration:none;">Şifremi Sıfırla</a>
      <p>Bu bağlantı 1 saat geçerlidir.</p>
      <p>Eğer bu isteği siz yapmadıysanız şifreniz değiştirilmeyecektir.</p>
    `,
    text: `Şifrenizi sıfırlamak için bu bağlantıya gidin: ${link}`,
  });
}

export async function sendPasswordChangedEmail(
  to: string,
  name: string,
): Promise<void> {
  await getMailTransporter().sendMail({
    from: FROM,
    to,
    subject: "Şifreniz değiştirildi",
    html: `
      <h2>Merhaba ${name},</h2>
      <p>Hesabınızın şifresi başarıyla değiştirildi.</p>
      <p>Bu değişikliği siz yapmadıysanız lütfen hemen desteğe başvurun.</p>
    `,
    text: `Hesabınızın şifresi değiştirildi. Siz yapmadıysanız destek ile iletişime geçin.`,
  });
}

export async function sendWelcomeEmail(
  to: string,
  name: string,
): Promise<void> {
  await getMailTransporter().sendMail({
    from: FROM,
    to,
    subject: `Hoş geldiniz, ${name}!`,
    html: `
      <h2>Merhaba ${name},</h2>
      <p>Pehlione'a hoş geldiniz! Hesabınız başarıyla oluşturuldu.</p>
      <p>Başlamak için e-posta adresinizi doğrulamayı unutmayın.</p>
    `,
    text: `Merhaba ${name}, Pehlione'a hoş geldiniz!`,
  });
}

export async function sendMembershipUpgradedEmail(
  to: string,
  name: string,
  newTier: string,
): Promise<void> {
  await getMailTransporter().sendMail({
    from: FROM,
    to,
    subject: "Üyelik planınız güncellendi",
    html: `
      <h2>Merhaba ${name},</h2>
      <p>Üyelik planınız <strong>${newTier}</strong> olarak güncellendi.</p>
      <p>Yeni özelliklerinizi keşfetmek için hesabınıza giriş yapın.</p>
    `,
    text: `Üyelik planınız ${newTier} olarak güncellendi.`,
  });
}

export async function sendAccountDisabledEmail(
  to: string,
  name: string,
): Promise<void> {
  await getMailTransporter().sendMail({
    from: FROM,
    to,
    subject: "Hesabınız devre dışı bırakıldı",
    html: `
      <h2>Merhaba ${name},</h2>
      <p>Hesabınız yönetici tarafından devre dışı bırakıldı.</p>
      <p>Daha fazla bilgi için destek ekibimizle iletişime geçin.</p>
    `,
    text: `Hesabınız devre dışı bırakıldı. Destek ile iletişime geçin.`,
  });
}
