import React, { useState, useEffect, useRef } from "react";
import {
  Sun,
  Moon,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Car,
  Eye,
  Sliders,
  Layers,
  HelpCircle,
  Clock,
  Sparkles,
  Phone,
  User,
  MapPin,
  Calendar,
  AlertTriangle,
  Loader2,
  Check,
} from "lucide-react";

export const VISOR_IMAGES = [
  {
    url: "https://i.postimg.cc/3JkCPrFR/main-image-1.webp",
    alt: "Visor Automóvel Anti-Encandeamento 2 em 1 instalado na pala do carro com painéis para dia e noite",
    caption: "Visor 2 em 1 com duplo painel translúcido para dia e noite",
  },
  {
    url: "https://i.postimg.cc/QxFkRNJN/main-image-2.webp",
    alt: "Painel escurecido para luz solar intensa e painel âmbar para condições noturnas",
    caption: "Configuração dupla: atenuação solar e condução com luzes intensas",
  },
  {
    url: "https://i.postimg.cc/158cLRr9/main-image-3.webp",
    alt: "Comparação de visibilidade ao volante antes e depois de utilizar o visor anti-encandeamento",
    caption: "Atenuação de reflexos e luminosidade excessiva na estrada",
  },
  {
    url: "https://i.postimg.cc/DySdtfPy/main-image-4.webp",
    alt: "Mecanismo articulado ajustável e clipe de fixação rápida para pala solar original",
    caption: "Fixação por clipe resistente e ajuste de rotação em 180°",
  },
  {
    url: "https://i.postimg.cc/8P7Bqkmz/main-image-5.webp",
    alt: "Dimensões compactas e materiais acrílicos resistentes do visor auxiliar",
    caption: "Design compacto compatível com a pala solar da maioria dos veículos",
  },
  {
    url: "https://i.postimg.cc/PrCzBfQT/main-image-6.webp",
    alt: "Visor automóvel em embalagem e pronto a instalar sem ferramentas",
    caption: "Instalação imediata sem necessitar de ferramentas ou adaptações",
  },
];

const PROVINCIAS_ANGOLA = [
  "Luanda",
  "Benguela",
  "Huambo",
  "Huíla",
  "Cabinda",
  "Cuanza Sul",
  "Cuanza Norte",
  "Uíge",
  "Malanje",
  "Namibe",
  "Zaire",
  "Lunda Norte",
  "Lunda Sul",
  "Moxico",
  "Bié",
  "Cunene",
  "Cuando Cubango",
  "Bengo",
];

interface VisorAutomovelViewProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent, selectedColor?: string, selectedSize?: string) => Promise<void>;
  isCheckoutVisible?: boolean;
  timeLeft?: number;
  formatTime?: (seconds: number) => string;
  leadCount?: number;
  leadGoal?: number;
}

export default function VisorAutomovelView({
  formData,
  setFormData,
  isSubmitting,
  onSubmit,
}: VisorAutomovelViewProps) {
  // Gallery state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  // FAQ state
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Sticky CTA state (observed via IntersectionObserver)
  const [isReservaInView, setIsReservaInView] = useState(false);
  const reservaRef = useRef<HTMLElement | null>(null);

  // Quantity packages calculation (1 un: 17.000 Kz, 2 un: 30.000 Kz, 3 un: 44.000 Kz)
  const selectedQty = Number(formData.quantity) || 1;
  const getPackageTotal = (qty: number) => {
    if (qty === 1) return 17000;
    if (qty === 2) return 30000;
    if (qty === 3) return 44000;
    return qty * 17000;
  };
  const currentTotal = getPackageTotal(selectedQty);
  const unitRefPrice = 17000;
  const normalSum = selectedQty * unitRefPrice;
  const savings = normalSum - currentTotal;

  // Fix province to Luanda exclusively
  useEffect(() => {
    if (formData.province !== "Luanda") {
      setFormData((prev: any) => ({ ...prev, province: "Luanda" }));
    }
  }, []);

  // Auto-rotate gallery every 3.200ms
  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || isPaused) return;

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % VISOR_IMAGES.length);
    }, 3200);

    return () => clearInterval(timer);
  }, [isPaused]);

  // Observe #reserva section for Sticky CTA visibility
  useEffect(() => {
    const target = document.getElementById("reserva");
    if (!target) return;
    reservaRef.current = target;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsReservaInView(entry.isIntersecting);
        });
      },
      {
        root: null,
        threshold: 0.08, // triggers as soon as 8% of the form enters the screen
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  // Name input ref for instant mobile keyboard opening
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  // Smooth scroll helper to #reserva with instant input focus and keyboard activation
  const scrollToReserva = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    const input = nameInputRef.current || document.getElementById("reserva-nome-input");
    const section = document.getElementById("reserva");

    // 1. Focus synchronously in user click gesture to trigger virtual keyboard on mobile
    if (input) {
      input.focus({ preventScroll: true });
    }

    // 2. Smoothly scroll into the reservation area
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // 3. Re-affirm focus and cursor position once scrolling arrives
    setTimeout(() => {
      const activeInput = nameInputRef.current || (document.getElementById("reserva-nome-input") as HTMLInputElement | null);
      if (activeInput) {
        activeInput.focus();
        const len = activeInput.value ? activeInput.value.length : 0;
        try {
          activeInput.setSelectionRange(len, len);
        } catch {}
      }
    }, 450);
  };

  // Touch gesture handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (diff > 45) {
      // Swiped left -> next
      setCurrentImageIndex((prev) => (prev + 1) % VISOR_IMAGES.length);
    } else if (diff < -45) {
      // Swiped right -> prev
      setCurrentImageIndex(
        (prev) => (prev - 1 + VISOR_IMAGES.length) % VISOR_IMAGES.length
      );
    }
    touchStartXRef.current = null;
    setTimeout(() => setIsPaused(false), 2000);
  };

  const goToNextImage = () => {
    setIsPaused(true);
    setCurrentImageIndex((prev) => (prev + 1) % VISOR_IMAGES.length);
    setTimeout(() => setIsPaused(false), 4000);
  };

  const goToPrevImage = () => {
    setIsPaused(true);
    setCurrentImageIndex(
      (prev) => (prev - 1 + VISOR_IMAGES.length) % VISOR_IMAGES.length
    );
    setTimeout(() => setIsPaused(false), 4000);
  };

  const selectImage = (index: number) => {
    setIsPaused(true);
    setCurrentImageIndex(index);
    setTimeout(() => setIsPaused(false), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-950">
      {/* ── SECÇÃO 1 — HERO ── */}
      <section className="relative pt-6 sm:pt-10 pb-14 sm:pb-20 px-4 max-w-6xl mx-auto overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent blur-3xl -z-10 pointer-events-none" />

        {/* Hero Title - Posicionado no topo acima da galeria */}
        <div className="text-left max-w-4xl mb-6 sm:mb-8">
          {/* Título Principal */}
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-950 tracking-tight leading-[1.15] text-balance">
            Mais conforto visual ao volante, em diferentes condições de luminosidade.
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Hero Gallery */}
          <div className="lg:col-span-6">
            <div
              className="bg-white p-3 sm:p-4 rounded-3xl border border-slate-200/90 shadow-md relative group"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Carousel Container */}
              <div
                className="relative aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center select-none"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {/* Image Frame with Smooth Fade */}
                {VISOR_IMAGES.map((img, idx) => (
                  <div
                    key={img.url}
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out flex items-center justify-center ${
                      idx === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.alt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain p-2"
                      loading={idx === 0 ? "eager" : "lazy"}
                    />
                  </div>
                ))}

                {/* Manual Controls: Prev / Next */}
                <button
                  type="button"
                  onClick={goToPrevImage}
                  aria-label="Imagem anterior"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-xs transition-all shadow-md cursor-pointer border border-white/20 active:scale-90"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={goToNextImage}
                  aria-label="Imagem seguinte"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-xs transition-all shadow-md cursor-pointer border border-white/20 active:scale-90"
                >
                  <ChevronRight size={20} />
                </button>

                {/* Caption bar */}
                <div className="absolute bottom-2 left-2 right-2 z-20 px-3 py-1.5 rounded-lg bg-slate-950/75 backdrop-blur-xs text-white text-[11px] font-medium text-center truncate border border-white/10">
                  {VISOR_IMAGES[currentImageIndex].caption}
                </div>
              </div>

              {/* Dot Indicators */}
              <div className="flex items-center justify-center gap-2 mt-3 pt-1">
                {VISOR_IMAGES.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => selectImage(dotIdx)}
                    aria-label={`Ver imagem ${dotIdx + 1}`}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      dotIdx === currentImageIndex
                        ? "w-7 bg-amber-500"
                        : "w-2 bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>

              {/* Thumbnails Row */}
              <div className="grid grid-cols-6 gap-2 mt-3">
                {VISOR_IMAGES.map((thumb, tIdx) => (
                  <button
                    key={thumb.url}
                    type="button"
                    onClick={() => selectImage(tIdx)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer p-0.5 bg-slate-900 ${
                      tIdx === currentImageIndex
                        ? "border-amber-500 ring-2 ring-amber-500/30 scale-102"
                        : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={thumb.url}
                      alt={`Miniatura ${tIdx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-lg"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Hero Content Right */}
          <div className="lg:col-span-6 space-y-5 text-left">
            {/* Descrição */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Conheça o visor automóvel 2 em 1, um acessório prático com painéis de tonalidades diferentes, desenvolvido para ajudar a atenuar a incidência de luz intensa durante as suas viagens.
            </p>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
              Uma solução complementar para quem passa muito tempo ao volante.
            </p>

            {/* Caixa de Preço & Pacotes em Destaque */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              {/* Header com Televendas & Entrega Gratuita em Luanda */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-wider text-slate-700">
                  <Phone size={13} className="text-amber-600" />
                  <span>Televendas & Pacotes Especiais</span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <Check size={12} className="text-emerald-600 stroke-[3]" />
                  <span>Entrega Gratuita em Luanda</span>
                </span>
              </div>

              {/* Pacotes de 1, 2 e 3 Unidades com seleção rápida */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    qty: 1,
                    label: "1 Carro",
                    sub: "1 Unidade",
                    price: "17.000 Kz",
                    badge: null,
                  },
                  {
                    qty: 2,
                    label: "2 Carros",
                    sub: "2 Unidades",
                    price: "30.000 Kz",
                    badge: "Poupa 4.000",
                  },
                  {
                    qty: 3,
                    label: "Frota / Família",
                    sub: "3 Unidades",
                    price: "44.000 Kz",
                    badge: "Poupa 7.000",
                  },
                ].map((item) => (
                  <button
                    key={item.qty}
                    type="button"
                    onClick={() => setFormData({ ...formData, quantity: item.qty })}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer relative ${
                      selectedQty === item.qty
                        ? "bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30 text-slate-900 shadow-xs"
                        : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    {item.badge && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8.5px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 whitespace-nowrap shadow-xs">
                        {item.badge}
                      </span>
                    )}
                    <span className="block text-[10px] font-extrabold uppercase tracking-wide text-slate-500">
                      {item.label}
                    </span>
                    <span className="block text-xs sm:text-sm font-black text-slate-950 tabular-nums my-0.5">
                      {item.price}
                    </span>
                    <span className="block text-[9.5px] font-semibold text-slate-400">
                      {item.sub}
                    </span>
                  </button>
                ))}
              </div>

              {/* Destaque do pacote selecionado e total */}
              <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Total do Pedido ({selectedQty} {selectedQty === 1 ? "unidade" : "unidades"}):
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black text-slate-950 tabular-nums">
                      {new Intl.NumberFormat("pt-AO").format(currentTotal)}
                    </span>
                    <span className="text-sm font-black text-amber-600">Kz</span>
                    {savings > 0 && (
                      <span className="text-xs font-bold text-emerald-600 ml-1.5 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Poupa {new Intl.NumberFormat("pt-AO").format(savings)} Kz!
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-200/60 font-medium">
                  <Sparkles size={13} className="text-amber-600 shrink-0" />
                  <span>Pacote seleccionado para a reserva</span>
                </div>
              </div>
            </div>

            {/* Quick Benefits row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-600 font-semibold">
              <div className="flex items-center gap-2 bg-slate-100/80 p-2.5 rounded-lg border border-slate-200/60">
                <Sun size={15} className="text-amber-500 shrink-0" />
                <span>Painel p/ Sol Forte</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-100/80 p-2.5 rounded-lg border border-slate-200/60">
                <Moon size={15} className="text-amber-600 shrink-0" />
                <span>Painel Âmbar Noturno</span>
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-center gap-2 bg-slate-100/80 p-2.5 rounded-lg border border-slate-200/60">
                <Sliders size={15} className="text-slate-700 shrink-0" />
                <span>Articulação 180°</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECÇÃO 2 — O PROBLEMA ── */}
      <section className="py-14 sm:py-20 px-4 bg-white border-y border-slate-200">
        <div className="max-w-4xl mx-auto text-left">
          <div className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase text-amber-700 bg-amber-50 px-3 py-1 rounded-md mb-3 border border-amber-200/60">
            <span>Dificuldades no Trânsito</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mb-6">
            A luz intensa durante a condução pode tornar a viagem desconfortável.
          </h2>

          <div className="space-y-4 text-base sm:text-lg text-slate-700 leading-relaxed">
            <p>
              Já aconteceu conduzir e sentir o sol a incidir diretamente nos seus olhos?
            </p>
            <p>
              Ou de sentir desconforto com determinadas luzes durante a viagem?
            </p>
            <p>
              A pala solar original nem sempre oferece o ajuste necessário para todas as situações.
            </p>
            <p className="font-semibold text-slate-900 pt-2 border-t border-slate-100">
              Por isso, ter uma opção complementar de proteção visual pode ser bastante útil no interior do seu automóvel.
            </p>
          </div>

          {/* Visual Problem Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                <Sun size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Incidência Solar Direta</h3>
              <p className="text-sm text-slate-600 leading-normal">
                Nas horas de ponta da manhã ou ao fim da tarde, o sol frontal incide em ângulos que a pala convencional do carro nem sempre consegue cobrir com eficácia.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center font-bold">
                <Moon size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Luzes e Faróis à Noite</h3>
              <p className="text-sm text-slate-600 leading-normal">
                Faróis altos e iluminação pública incisiva podem provocar cansaço visual após horas continuadas na estrada ou em trajetos interprovinciais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECÇÃO 3 — A SOLUÇÃO ── */}
      <section className="py-14 sm:py-20 px-4 max-w-5xl mx-auto text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase text-amber-700 bg-amber-100/70 px-3 py-1 rounded-md border border-amber-200">
              <span>Solução Prática 2 em 1</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight leading-tight">
              Um acessório. Duas configurações. Mais opções para o seu dia a dia.
            </h2>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
              O Visor Automóvel Anti-Encandeamento 2 em 1 foi pensado para oferecer diferentes configurações de proteção visual.
            </p>

            <p className="text-base text-slate-600 leading-relaxed">
              Com os seus painéis de tonalidades distintas, pode selecionar e posicionar o painel de acordo com as condições de luminosidade e o conforto visual.
            </p>

            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Prático, compacto e desenvolvido para complementar a pala solar do seu veículo.
            </p>

            <div className="pt-3">
              <button
                type="button"
                onClick={scrollToReserva}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-black text-sm uppercase tracking-wide bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md transition cursor-pointer active:scale-95 flex items-center justify-center gap-2"
              >
                <span>QUERO RESERVAR O MEU — 17.000 Kz</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md aspect-square flex items-center justify-center p-3">
              <img
                src={VISOR_IMAGES[1].url}
                alt="Painel duplo para dia e noite em detalhe"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── SECÇÃO 4 — CARACTERÍSTICAS ── */}
      <section className="py-14 sm:py-20 px-4 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-5xl mx-auto text-left">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black tracking-widest uppercase text-amber-700 block mb-1">
              Especificações e Detalhes
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Conheça os detalhes que fazem a diferença.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* CARACTERÍSTICA 01 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-widest">
                  CARACTERÍSTICA 01
                </span>
                <Sun size={20} className="text-amber-500" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Configuração para luz solar
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                O painel escurecido foi concebido para ajudar a reduzir a incidência da luz solar intensa.
              </p>
            </div>

            {/* CARACTERÍSTICA 02 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-widest">
                  CARACTERÍSTICA 02
                </span>
                <Moon size={20} className="text-amber-600" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Painel complementar amarelado
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Uma configuração apresentada para situações de luminosidade intensa, com utilização dependente das condições reais de visibilidade.
              </p>
            </div>

            {/* CARACTERÍSTICA 03 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-widest">
                  CARACTERÍSTICA 03
                </span>
                <Sliders size={20} className="text-slate-700" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Ajuste de posição
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                O mecanismo articulado permite posicionar o visor conforme a configuração do acessório.
              </p>
            </div>

            {/* CARACTERÍSTICA 04 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-widest">
                  CARACTERÍSTICA 04
                </span>
                <Layers size={20} className="text-slate-700" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Design compacto
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Um acessório concebido para ser instalado no interior do automóvel, junto à pala solar original, de acordo com a compatibilidade do veículo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECÇÃO 5 — DEMONSTRAÇÃO ── */}
      <section className="py-14 sm:py-20 px-4 max-w-5xl mx-auto text-left">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-black tracking-widest uppercase text-amber-700 block mb-1">
            Galeria Real do Produto
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Veja como funciona na prática.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Observe os painéis, o mecanismo de ajuste e a forma de instalação. Um acessório simples de compreender e fácil de integrar na rotina do seu automóvel, desde que exista compatibilidade com a pala original.
          </p>
        </div>

        {/* Real photo gallery grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {VISOR_IMAGES.slice(1, 6).map((img, i) => (
            <div
              key={img.url}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs group"
            >
              <div className="aspect-[4/3] bg-slate-950 flex items-center justify-center p-3">
                <img
                  src={img.url}
                  alt={img.alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain group-hover:scale-103 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-3 bg-white border-t border-slate-100">
                <p className="text-xs font-medium text-slate-700 leading-tight">
                  {img.caption}
                </p>
              </div>
            </div>
          ))}

          {/* CTA card within demonstration grid */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl border border-slate-800 p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400 block">
                Disponibilidade Imediata
              </span>
              <h3 className="text-xl font-black text-white leading-snug">
                Garanta o seu visor com entrega simplificada.
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Reserva rápida sem pagamentos antecipados. Confirme o seu pedido e receba o contacto da nossa equipa.
              </p>
            </div>
            <button
              type="button"
              onClick={scrollToReserva}
              className="mt-6 w-full py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wide bg-amber-500 hover:bg-amber-600 text-slate-950 transition cursor-pointer text-center"
            >
              RESERVAR AGORA — 17.000 Kz
            </button>
          </div>
        </div>
      </section>

      {/* ── SECÇÃO 6 — PÚBLICO-ALVO ── */}
      <section className="py-14 sm:py-20 px-4 bg-white border-y border-slate-200">
        <div className="max-w-4xl mx-auto text-left">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-black tracking-widest uppercase text-amber-700 block mb-1">
              Para Quem Foi Desenvolvido
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Ideal para quem passa muito tempo ao volante.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Motoristas particulares",
                desc: "Para quem utiliza o carro no percurso diário casa-trabalho e enfrenta o sol da manhã e fim de tarde.",
              },
              {
                title: "Motoristas de táxi e transporte",
                desc: "Profissionais que conduzem muitas horas consecutivas e necessitam de conforto visual constante.",
              },
              {
                title: "Profissionais da estrada",
                desc: "Quem faz entregas, transporte comercial ou trabalha diariamente em tráfego intenso.",
              },
              {
                title: "Pessoas com viagens frequentes",
                desc: "Condutores que percorrem estradas interprovinciais com mudanças contínuas de iluminação.",
              },
              {
                title: "Condutores práticos",
                desc: "Pessoas que procuram acessórios funcionais, de fixação simples e sem alterar o carro.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2 hover:border-amber-400/60 transition"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                  0{idx + 1}
                </div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECÇÃO 7 — PREÇO ── */}
      <section className="py-14 sm:py-20 px-4 max-w-4xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white border border-slate-800 shadow-xl space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-amber-400 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20">
            <span>Investimento Acessível</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight max-w-2xl mx-auto leading-tight">
            Equipe o seu automóvel com uma solução complementar de proteção visual.
          </h2>

          <div className="py-2">
            <div className="inline-flex items-baseline gap-2">
              <span className="text-4xl sm:text-6xl font-black text-white tabular-nums">
                17.000
              </span>
              <span className="text-2xl font-black text-amber-400">Kz</span>
            </div>
            <p className="text-xs uppercase font-extrabold tracking-widest text-slate-400 mt-1">
              Preço por unidade
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Um acessório 2 em 1 para complementar a pala solar do seu veículo.
          </p>

          <div>
            <button
              type="button"
              onClick={scrollToReserva}
              className="px-9 py-4 rounded-xl font-black text-sm uppercase tracking-wide bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-lg hover:shadow-amber-500/25 transition cursor-pointer active:scale-95 inline-flex items-center gap-2"
            >
              <span>QUERO RESERVAR POR 17.000 Kz</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── SECÇÃO 8 — PERGUNTAS FREQUENTES (FAQ) ── */}
      <section className="py-14 sm:py-20 px-4 bg-white border-y border-slate-200">
        <div className="max-w-3xl mx-auto text-left">
          <div className="text-center mb-10">
            <span className="text-xs font-black tracking-widest uppercase text-amber-700 block mb-1">
              Esclarecimentos Importantes
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "O produto é uma película para o para-brisas?",
                a: "Não. Trata-se de um visor auxiliar instalado no interior do automóvel, e não de uma película para aplicar no vidro.",
              },
              {
                q: "É compatível com todos os automóveis?",
                a: "A compatibilidade depende das características da pala solar e do suporte de fixação do veículo. Confirme a compatibilidade antes de finalizar a compra.",
              },
              {
                q: "Como funciona?",
                a: "O acessório dispõe de painéis com tonalidades diferentes, que podem ser posicionados conforme a configuração e as condições de luminosidade.",
              },
              {
                q: "O painel amarelo garante melhor visão durante a noite?",
                a: "Não existe garantia de melhoria da visão noturna. Nunca utilize qualquer painel que limite a visibilidade da estrada ou a capacidade de identificar obstáculos.",
              },
              {
                q: "Quanto custa?",
                a: "O preço é de 17.000 Kz por unidade.",
              },
              {
                q: "Como posso reservar?",
                a: "Basta preencher o formulário de reserva com os dados solicitados. A nossa equipa entrará em contacto para confirmar os detalhes do pedido.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-slate-50 border border-slate-200/90 rounded-2xl overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-5 py-4 text-left flex justify-between items-center hover:bg-slate-100/60 transition cursor-pointer font-bold text-slate-900 text-sm sm:text-base gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 transition-transform duration-200 shrink-0 ${
                      activeFaq === i ? "rotate-180 text-amber-600" : ""
                    }`}
                  />
                </button>
                {activeFaq === i && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECÇÃO 9 — CHAMADA FINAL ── */}
      <section className="py-12 sm:py-16 px-4 max-w-4xl mx-auto text-center">
        <div className="space-y-4">
          <span className="text-xs font-black tracking-widest uppercase text-amber-700 block">
            Praticidade no Seu Veículo
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Dê mais uma opção de conforto visual ao interior do seu automóvel.
          </h2>
          <p className="text-base text-slate-600 max-w-lg mx-auto">
            Conheça o Visor Automóvel Anti-Encandeamento 2 em 1.
          </p>

          <div className="py-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-950 tabular-nums">
              17.000 Kz
            </span>
            <span className="text-xs text-slate-400 uppercase font-bold block mt-0.5">
              / UNIDADE
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-500">
            Faça a sua reserva através do formulário abaixo.
          </p>

          <div>
            <button
              type="button"
              onClick={scrollToReserva}
              className="px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md transition cursor-pointer inline-flex items-center gap-2"
            >
              <span>RESERVAR O MEU AGORA</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ── SECÇÃO 10 — RESERVA (#reserva) ── */}
      <section
        id="reserva"
        className="py-16 sm:py-24 px-4 bg-slate-900 text-white scroll-mt-10"
      >
        <div className="max-w-2xl mx-auto text-left">
          {/* Header da Secção */}
          <div className="text-center mb-8 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
              Formulário Oficial de Pedido
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Reserve o seu visor automóvel.
            </h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Preencha os seus dados para registar a sua reserva. A nossa equipa entrará em contacto para confirmar o pedido e os detalhes de entrega.
            </p>
            <div className="inline-block bg-slate-800/80 border border-slate-700/80 px-4 py-1.5 rounded-full text-xs font-semibold text-amber-400 mt-2">
              Preço: 17.000 Kz por unidade.
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
            <form onSubmit={(e) => onSubmit(e)} className="space-y-5">
              {/* Nome Completo */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 font-bold mb-1.5">
                  Nome Completo *
                </label>
                <div className="relative">
                  <input
                    ref={nameInputRef}
                    id="reserva-nome-input"
                    required
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none pl-11 pr-4 py-3.5 rounded-xl text-white font-medium text-sm transition"
                    placeholder="Ex: Manuel António Domingos"
                  />
                  <User
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                </div>
              </div>

              {/* Telefone / WhatsApp */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 font-bold mb-1.5">
                  Número de Telefone / WhatsApp *
                </label>
                <div className="relative">
                  <input
                    required
                    type="tel"
                    value={formData.phone || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none pl-11 pr-4 py-3.5 rounded-xl text-white font-medium text-sm transition"
                    placeholder="Ex: 923 000 000"
                  />
                  <Phone
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Insira um contacto válido para a nossa equipa ligar e confirmar a entrega.
                </p>
              </div>

              {/* Província (Bloqueada em Luanda) */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 font-bold mb-1.5">
                  Província de Entrega *
                </label>
                <div className="relative">
                  <select
                    disabled
                    value="Luanda"
                    className="w-full bg-slate-900/90 border border-emerald-500/50 pl-11 pr-8 py-3.5 rounded-xl text-emerald-400 font-bold text-sm appearance-none cursor-not-allowed shadow-inner"
                  >
                    <option value="Luanda" className="bg-slate-900 text-emerald-400 font-bold">
                      Luanda (Exclusivo — Entrega Gratuita)
                    </option>
                  </select>
                  <MapPin
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500"
                  />
                  <Check
                    size={16}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none stroke-[3]"
                  />
                </div>
                <p className="text-[11px] text-emerald-400/90 font-medium mt-1.5 flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-500 shrink-0" />
                  <span>Entregas rápidas com frete grátis disponíveis exclusivamente na Província de Luanda.</span>
                </p>
              </div>

              {/* Endereço / Bairro / Município */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 font-bold mb-1.5">
                  Endereço de Entrega (Município / Bairro / Referência) *
                </label>
                <input
                  required
                  type="text"
                  value={formData.area || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, area: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none px-4 py-3.5 rounded-xl text-white font-medium text-sm transition"
                  placeholder="Ex: Maianga, Rua do Kero, próximo ao posto da Sonangol"
                />
              </div>

              {/* Pacotes de Quantidade (Desconto Progressivo) */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-amber-400 font-bold mb-2">
                  Selecione a Quantidade Desejada
                </label>
                <div className="space-y-2.5">
                  {[
                    {
                      qty: 1,
                      title: "1 Visor Automóvel 2 em 1",
                      priceText: "17.000 Kz",
                      desc: "Preço padrão de 1 unidade",
                      badge: null,
                    },
                    {
                      qty: 2,
                      title: "2 Visores Automóveis (Par Completo)",
                      priceText: "30.000 Kz",
                      desc: "Poupe 4.000 Kz! (15.000 Kz por unidade)",
                      badge: "Mais Recomendado",
                    },
                    {
                      qty: 3,
                      title: "3 Visores Automóveis (Combo Família / Frota)",
                      priceText: "44.000 Kz",
                      desc: "Poupe 7.000 Kz! (Apenas 14.667 Kz por unidade)",
                      badge: "Maior Poupança",
                    },
                  ].map((pkg) => (
                    <button
                      key={pkg.qty}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, quantity: pkg.qty })
                      }
                      className={`w-full p-4 border rounded-2xl text-left transition flex items-center justify-between gap-3 cursor-pointer relative ${
                        selectedQty === pkg.qty
                          ? "bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30 text-white"
                          : "bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300"
                      }`}
                    >
                      {pkg.badge && (
                        <span className="absolute -top-2.5 right-4 text-[9.5px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-amber-500 text-slate-950 shadow-sm">
                          {pkg.badge}
                        </span>
                      )}
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            selectedQty === pkg.qty
                              ? "border-amber-500 bg-amber-500 text-slate-950"
                              : "border-slate-700 bg-slate-900"
                          }`}
                        >
                          {selectedQty === pkg.qty && (
                            <div className="w-2 h-2 rounded-full bg-slate-950" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-white">
                            {pkg.title}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {pkg.desc}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p
                          className={`text-sm sm:text-base font-black ${
                            selectedQty === pkg.qty
                              ? "text-amber-400"
                              : "text-slate-200"
                          }`}
                        >
                          {pkg.priceText}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Preferencial */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 font-bold mb-1.5">
                  Data Preferencial para Entrega (Opcional)
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.deliveryDate || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, deliveryDate: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none pl-11 pr-4 py-3 rounded-xl text-white font-medium text-sm transition"
                  />
                  <Calendar
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                </div>
              </div>

              {/* Observações */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 font-bold mb-1.5">
                  Notas / Observações Adicionais (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={formData.observacoes || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, observacoes: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none px-4 py-3 rounded-xl text-white font-medium text-sm transition resize-none"
                  placeholder="Ex: Entregar após as 14h; modelo do veículo, etc."
                />
              </div>

              {/* Resumo de Preços */}
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-sm space-y-2">
                <div className="flex justify-between font-bold text-slate-400 text-xs uppercase tracking-wider">
                  <span>Produto Selecionado:</span>
                  <span className="text-white text-right">
                    {selectedQty}x Visor Automóvel 2 em 1
                  </span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between font-semibold text-emerald-400 text-xs">
                    <span>Desconto do Pacote:</span>
                    <span>
                      - {new Intl.NumberFormat("pt-AO").format(savings)} Kz
                    </span>
                  </div>
                )}
                <div className="border-t border-slate-800 pt-2 flex justify-between items-baseline">
                  <span className="font-black text-white text-sm uppercase">
                    Total a pagar:
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-amber-400 tabular-nums">
                      {new Intl.NumberFormat("pt-AO").format(currentTotal)}
                    </span>
                    <span className="text-xs font-black text-amber-400">Kz</span>
                  </div>
                </div>
              </div>

              {/* Botão de Submissão */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-lg ${
                    isSubmitting
                      ? "opacity-75 cursor-wait"
                      : "cursor-pointer active:scale-98"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>A processar reserva...</span>
                    </>
                  ) : (
                    <>
                      <span>CONFIRMAR RESERVA DO VISOR AUTOMÓVEL</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Texto de Utilização no Rodapé da Secção */}
          <div className="mt-8 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-400 text-xs leading-relaxed flex items-start gap-3">
            <AlertTriangle
              size={18}
              className="text-amber-500 shrink-0 mt-0.5"
            />
            <p>
              Este acessório é complementar e não substitui a atenção do condutor, a pala solar original ou as condições necessárias para uma condução segura. Não posicione o visor de modo a obstruir o campo de visão. Não utilize os painéis em condições nas quais reduzam a visibilidade.
            </p>
          </div>
        </div>
      </section>

      {/* ── STICKY CTA FLUTUANTE ── */}
      <div
        className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-40 transition-all duration-300 transform ${
          isReservaInView
            ? "opacity-0 pointer-events-none translate-y-8"
            : "opacity-100 pointer-events-auto translate-y-0"
        }`}
      >
        <button
          type="button"
          onClick={scrollToReserva}
          className="w-full sm:w-auto px-7 py-3.5 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-2xl border-2 border-slate-900/20 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>RESERVAR AGORA</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
