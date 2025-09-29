import { SearchInterface } from "@/components/search-interface"
import { Header } from "@/components/header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className=" mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">
              Find and analyze leads with precision
            </h1>
            <p className="text-xl text-muted-foreground text-pretty">
              Advanced web scraping and data analysis tools to discover, filter, and connect with your ideal prospects
            </p>
          </div>
          <SearchInterface />
        </div>
      </main>
    </div>
  )
}
