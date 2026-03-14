#!/bin/bash
# MySQL 8.4: caching_sha2_password is the default but requires RSA/SSL for TCP.
# Switch the app user to mysql_native_password so Prisma can connect without SSL.
mysql -u root -p"${MYSQL_ROOT_PASSWORD}" <<-EOF
  ALTER USER '${MYSQL_USER}'@'%'
    IDENTIFIED WITH mysql_native_password
    BY '${MYSQL_PASSWORD}';
  FLUSH PRIVILEGES;
EOF
