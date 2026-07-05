import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
    },
  });

  const products = [
    {
      name: 'Laptop',
      description: 'High performance laptop',
      price: 15000000,
      stock: 10,
    },
    {
      name: 'Mouse',
      description: 'Wireless mouse',
      price: 250000,
      stock: 50,
    },
    {
      name: 'Keyboard',
      description: 'Mechanical keyboard',
      price: 750000,
      stock: 30,
    },
    {
      name: 'Monitor',
      description: '24 inch full HD monitor',
      price: 2000000,
      stock: 15,
    },
    {
      name: 'Headset',
      description: 'Noise cancelling headset',
      price: 900000,
      stock: 25,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product,
    });
  }

  console.log('Seed completed');
  console.log({ user: user.email, productCount: products.length });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
