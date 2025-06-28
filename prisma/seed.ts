import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const category = 'shoes';
  const brands = ['Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance', 'Converse'];
  const types = ['Deportivos', 'Casuales', 'Running', 'Formales', 'Sandalias', 'Botas'];
  const colors = ['Negro', 'Blanco', 'Rojo', 'Azul', 'Gris', 'Verde'];

  const sizes = Array.from({ length: 19 }, (_, i) => 36 + i * 0.5);

  const products = Array.from({ length: 200 }).map(() => ({
    title: `${faker.helpers.arrayElement(brands)} ${faker.helpers.arrayElement(types)} ${faker.helpers.arrayElement(colors)}`,
    category,
    brand: faker.helpers.arrayElement(brands),
    type: faker.helpers.arrayElement(types),
    color: faker.helpers.arrayElement(colors),
    size: faker.helpers.arrayElement(sizes),
    price: parseFloat(faker.commerce.price({ min: 30, max: 200 })),
    image: faker.image.urlPicsumPhotos({ width: 300, height: 300 }),
  }));

  await prisma.product.deleteMany();

  await prisma.product.createMany({ data: products });

  console.log('✅ Se insertaron 200 productos tipo zapatos.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
