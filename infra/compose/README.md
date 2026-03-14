
**Dosya:** `infra/compose/README.md`

**Amaç:**
Altyapıyı başlatmak için compose dizininin nasıl kullanılacağını netleştirmek; `.env` dosyasının hazırlanması, servislerin ayağa kaldırılması ve erişim bilgilerinin tek yerde dokümante edilmesi.

**Kod:**

```md
# Infra Compose

Bu dizin, projenin lokal geliştirme ortamı için gerekli altyapı servislerini içerir:

- MySQL
- Redis
- MailHog

## 1) Ortam dosyasını oluştur

Önce örnek dosyayı kopyala:

```bash
cp .env.example .env
```

Ardından `.env` içindeki şifreleri ve gerekirse diğer değerleri güncelle.

## 2) Servisleri başlat

Bu dizinde çalıştır:

```bash
docker compose up -d
```

Servisleri durdurmak için:

```bash
docker compose down
```

Volumeleri de silmek istersen:

```bash
docker compose down -v
```

## 3) Servis erişimleri

### MySQL

* Host: `127.0.0.1`
* Port: `3306`
* Database: `pehlione_db_react`
* User: `.env` içindeki `MYSQL_USER`
* Password: `.env` içindeki `MYSQL_PASSWORD`

### Redis

* Host: `127.0.0.1`
* Port: `6379`

### MailHog

* SMTP Host: `127.0.0.1`
* SMTP Port: `1025`
* Web UI: `http://127.0.0.1:8025`

## 4) Sağlık kontrolü

Container durumlarını görmek için:

```bash
docker compose ps
```

Logları izlemek için:

```bash
docker compose logs -f
```

Sadece belirli bir servis için:

```bash
docker compose logs -f mysql
docker compose logs -f redis
docker compose logs -f mailhog
```

## 5) Notlar

* Gerçek gizli bilgiler `.env` içinde tutulmalı, `.env.example` sadece şablondur.
* Veritabanı adı proje kararı gereği `pehlione_db_react` olarak sabittir.
* Redis, backend tarafında `express-session` oturum verisini tutmak için kullanılacaktır.
* MailHog yalnızca lokal geliştirme/test e-posta akışları içindir.

```

**Kısa not:**
Bu dosya, altyapı foundation katmanını kullanılabilir hale getirir; ekipte herkes aynı başlangıç akışını izler. Sonraki adıma sadece **“bitti”** dediğinde geçeceğim.
```
