import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const categories = ['sillas', 'movies', 'toys', 'tools', 'books'];

  const products = Array.from({ length: 100 }).map(() => ({
    title: faker.commerce.productName(),
    category: faker.helpers.arrayElement(categories),
    price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
    image: faker.image.urlPicsumPhotos({ width: 300, height: 300 }),
  }));

  await prisma.product.deleteMany(); // Limpiar antes de insertar nuevos

  await prisma.product.createMany({ data: products });

  console.log('✅ Se insertaron 100 productos con categorías predefinidas.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
