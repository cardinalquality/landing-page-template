import { Button } from '@/core/components/atoms'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold">Universal E-Commerce Platform</h1>
        <p className="text-lg text-gray-600">
          Multi-tenant platform built with Next.js 16, TypeScript, Tailwind CSS, and TDD
        </p>

        <div className="flex gap-4 justify-center">
          <Button variant="primary" size="lg">
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>✅ Testing Infrastructure: Vitest + Playwright</p>
          <p>✅ TDD Proven: 14/14 Button tests passing</p>
          <p>✅ Multi-Tenant: Reluma + Eonlife</p>
          <p>✅ Database: Supabase (PostgreSQL) + Prisma</p>
        </div>
      </div>
    </main>
  )
}
