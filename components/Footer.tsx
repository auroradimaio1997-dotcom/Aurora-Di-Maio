import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-muted">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-3">
        <div>
          <p className="font-serif text-lg font-semibold text-primary">
            Aurora Di Maio
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-secondary">
            Dottoranda e assistente notarile. Consulenza e supporto per atti,
            pratiche e ricerca giuridica.
          </p>
        </div>

        <nav aria-label="Link rapidi" className="text-sm">
          <p className="mb-3 font-medium text-primary">Link rapidi</p>
          <ul className="space-y-2 text-secondary">
            <li>
              <Link href="/chi-sono" className="hover:text-accent">
                Chi Sono
              </Link>
            </li>
            <li>
              <Link href="/servizi" className="hover:text-accent">
                Servizi
              </Link>
            </li>
            <li>
              <Link href="/contatti" className="hover:text-accent">
                Contatti
              </Link>
            </li>
          </ul>
        </nav>

        <div className="text-sm">
          <p className="mb-3 font-medium text-primary">Contatti</p>
          <ul className="space-y-2 text-secondary">
            <li className="flex items-center gap-2">
              <Mail size={16} aria-hidden="true" />
              <a
                href="mailto:aurora.dimaio@unisalento.it"
                className="hover:text-accent"
              >
                aurora.dimaio@unisalento.it
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} aria-hidden="true" />
              <span>Lecce, Italia</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t px-6 py-6 text-center text-xs text-secondary">
        © {new Date().getFullYear()} Aurora Di Maio. Tutti i diritti
        riservati.
      </div>
    </footer>
  );
}
