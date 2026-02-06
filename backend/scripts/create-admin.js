import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '../.env') });

const createAdmin = async () => {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('Connected to database');

    // Default admin credentials
    const email = 'admin@example.com';
    const password = 'Admin@123';
    const name = 'Admin User';

    // Check if admin already exists
    const [existing] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      console.log('Admin user already exists!');
      return;
    }

    // Get admin role id
    const [roles] = await connection.execute(
      'SELECT id FROM roles WHERE name = ?',
      ['admin']
    );

    if (roles.length === 0) {
      console.error('Admin role not found. Please run schema.sql first.');
      return;
    }

    const roleId = roles[0].id;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate UUID
    const userId = crypto.randomUUID();

    // Create admin user
    await connection.execute(
      'INSERT INTO users (id, email, password, role_id, name) VALUES (?, ?, ?, ?, ?)',
      [userId, email, hashedPassword, roleId, name]
    );

    console.log('\n✅ Admin user created successfully!');
    console.log('\n📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('\n⚠️  IMPORTANT: Please change the default password after first login!\n');

  } catch (error) {
    console.error('Error creating admin:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

createAdmin();
