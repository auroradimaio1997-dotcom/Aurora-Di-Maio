import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-muted">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-2">
        <div>
          <p className="font-serif text-lg font-semibold text-primary">
            Aurora Di Maio
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-secondary">
            Spazio di lavoro personale: dottorato, assistenza notarile e
            ricerca accademica.
          </p>
        </div>

        <nav aria-label="Link rapidi" className="text-sm">
          <p className="mb-3 font-medium text-primary">Sezioni</p>
          <ul className="space-y-2 text-secondary">
            <li>
              <Link href="/dottorato" className="hover:text-accent">
                Dottorato
              </Link>
            </li>
            <li>
              <Link href="/assistente-notarile" className="hover:text-accent">
                Assistente Notarile
              </Link>
            </li>
            <li>
              <Link href="/accademia" className="hover:text-accent">
                Accademia
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t px-6 py-6 text-center text-xs text-secondary">
        © {new Date().getFullYear()} Aurora Di Maio.
      </div>
    </footer>
  );
}
