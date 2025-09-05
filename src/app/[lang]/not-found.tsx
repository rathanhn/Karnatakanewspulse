'use client'
import {useEffect, useState} from 'react'
import Link from 'next/link'
import {Button} from '@/components/ui/button'
import {getDictionary, Dictionary} from '@/lib/i18n'
import {usePathname} from 'next/navigation'
import {Home} from 'lucide-react'

export default function NotFound() {
  const pathname = usePathname()
  const lang = pathname.split('/')[1] as 'en' | 'kn'
  const [dict, setDict] = useState<Dictionary>(getDictionary(lang || 'en'))

  useEffect(() => {
    setDict(getDictionary(lang || 'en'))
  }, [lang])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <h2 className="mt-4 text-3xl font-semibold text-foreground">
        {dict.pageNotFound}
      </h2>
      <p className="mt-2 text-lg text-muted-foreground">
        {dict.pageNotFoundDesc}
      </p>
      <Button asChild className="mt-8">
        <Link href={`/${lang}/home`}>
          <Home className="mr-2" />
          {dict.goHome}
        </Link>
      </Button>
    </div>
  )
}
