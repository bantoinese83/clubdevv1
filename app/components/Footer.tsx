import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">© 2023 ClubDev. All rights reserved.</div>
          <div className="flex space-x-6">
            <Link href="/about" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              About
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

