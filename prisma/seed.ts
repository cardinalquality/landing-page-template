import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create Reluma tenant
  const reluma = await prisma.tenant.upsert({
    where: { slug: 'reluma' },
    update: {},
    create: {
      slug: 'reluma',
      name: 'Reluma',
      domain: 'reluma.com',
      theme: {
        primaryColor: '#2563eb',
        secondaryColor: '#475569',
        accentColor: '#f59e0b',
        backgroundColor: '#ffffff',
        textColor: '#1e293b',
        logo: '/logos/reluma-logo.svg',
        favicon: '/favicons/reluma-favicon.ico',
      },
      features: {
        ecommerce: true,
        blog: true,
        multiLanguage: false,
        stripe: true,
        analytics: true,
      },
    },
  })

  console.log('✅ Created tenant:', reluma.name)

  // Create Eonlife tenant
  const eonlife = await prisma.tenant.upsert({
    where: { slug: 'eonlife' },
    update: {},
    create: {
      slug: 'eonlife',
      name: 'Eonlife',
      domain: 'eonlife.com',
      theme: {
        primaryColor: '#059669',
        secondaryColor: '#64748b',
        accentColor: '#ec4899',
        backgroundColor: '#fafaf9',
        textColor: '#0f172a',
        logo: '/logos/eonlife-logo.svg',
        favicon: '/favicons/eonlife-favicon.ico',
      },
      features: {
        ecommerce: true,
        blog: true,
        multiLanguage: true,
        stripe: true,
        analytics: true,
      },
    },
  })

  console.log('✅ Created tenant:', eonlife.name)

  // Create products for Reluma
  await prisma.product.createMany({
    data: [
      {
        tenantId: reluma.id,
        name: 'Premium Wireless Headphones',
        slug: 'premium-wireless-headphones',
        description: 'High-quality wireless headphones with noise cancellation.',
        price: 299.99,
        compareAtPrice: 399.99,
        imageUrl: 'https://placehold.co/600x400/2563eb/ffffff?text=Headphones',
        inventory: 50,
        active: true,
        featured: true,
      },
      {
        tenantId: reluma.id,
        name: 'Smart Watch Pro',
        slug: 'smart-watch-pro',
        description: 'Feature-packed smartwatch with health tracking.',
        price: 449.99,
        imageUrl: 'https://placehold.co/600x400/2563eb/ffffff?text=Watch',
        inventory: 30,
        active: true,
        featured: false,
      },
    ],
  })

  console.log('✅ Created Reluma products: 2')

  // Create products for Eonlife
  await prisma.product.createMany({
    data: [
      {
        tenantId: eonlife.id,
        name: 'Longevity Essentials Bundle',
        slug: 'longevity-essentials-bundle',
        description: 'Complete supplement pack for healthy aging and vitality.',
        price: 89.99,
        compareAtPrice: 120.0,
        imageUrl: 'https://placehold.co/600x400/059669/ffffff?text=Bundle',
        inventory: 100,
        active: true,
        featured: true,
      },
      {
        tenantId: eonlife.id,
        name: 'NAD+ Booster',
        slug: 'nad-booster',
        description: 'Advanced cellular energy support supplement.',
        price: 59.99,
        imageUrl: 'https://placehold.co/600x400/059669/ffffff?text=NAD+',
        inventory: 75,
        active: true,
        featured: true,
      },
      {
        tenantId: eonlife.id,
        name: 'Resveratrol Plus',
        slug: 'resveratrol-plus',
        description: 'Powerful antioxidant for cellular health.',
        price: 45.99,
        imageUrl: 'https://placehold.co/600x400/059669/ffffff?text=Resveratrol',
        inventory: 60,
        active: true,
        featured: false,
      },
    ],
  })

  console.log('✅ Created Eonlife products: 3')
  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
