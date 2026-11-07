# Página de Vendas: Visor Automóvel Anti-Encandeamento 2 em 1

Desenvolvimento de uma página de vendas profissional, de alta conversão (CRO) e ultra-rápida para o **Visor Automóvel Anti-Encandeamento 2 em 1 — Dia e Noite**, 100% integrada à arquitetura existente do Valida C sem duplicação de lógica ou alterações em páginas prévias.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Decisões confirmadas com o utilizador:**
> - **Pacotes de Desconto Progressivo**: Ativados no seletor de reserva (1 un = 17.000 Kz, 2 un = 30.000 Kz, 3 un = 44.000 Kz) com cálculo automático no Firestore e Meta CAPI (convertido para USD a $1 = 1.000 Kz).
> - **Acesso e Navegação**: Rota dedicada (`?product=visor-automovel` / `?view=sales-visor-automovel`) e inclusão no seletor de produtos `PRODUCTS_LIST` da loja e do painel admin.

---

### 1. Overview & Core Concept

- **Produto**: Visor Automóvel Anti-Encandeamento 2 em 1 (Dia e Noite) com painéis de tonalidades distintas, mecanismo articulado e instalação simples na pala original do veículo.
- **Público-Alvo**: Motoristas particulares, taxistas, condutores de aplicativos e profissionais da estrada em Angola.
- **Preço Base**: 17.000 Kz por unidade (com pacotes promocionais de 2 un por 30.000 Kz e 3 un por 44.000 Kz).
- **Proposta de Valor**: Conforto visual complementar contra a incidência solar direta e faróis incisivos, respeitando integridade técnica e sem promessas milagrosas.

---

### 2. User Experience & Visual Design

- **Identidade Visual Automóvel**:
  - Paleta: Fundo neutro suave (`#F8FAFC` / `#FFFFFF`), tipografia em carvão escuro (`#0F172A`), detalhes sutis em âmbar/amarelo automóvel (`#F59E0B` / `#D97706`) e botões de alta legibilidade.
  - Tipografia: *Plus Jakarta Sans* para clareza técnica e números tabulares (`tabular-nums`) para preços e pacotes.
  - Zero-Pill & Anti-Slop: Sem contadores falsos de escassez, sem falsos depoimentos e sem poluição de badges genéricos.
- **Galeria Automática de Imagens (Hero)**:
  - Carrossel suave com 6 imagens reais fornecidas pelo utilizador.
  - Transição contínua com fade a cada 3.200ms.
  - Controles manuais (setas anterior/seguinte), indicadores de posição em pontos e miniaturas interativas com seleção direta.
  - Suporte a gestos touch/swipe em smartphones e pausa automática em caso de interação.
  - Respeito à preferência de sistema `prefers-reduced-motion`.
- **Sticky CTA Flutuante**:
  - Botão inferior fixo com texto `RESERVAR AGORA — 17.000 Kz`.
  - Integrado via `IntersectionObserver` observando a secção `#reserva`.
  - Desaparece suavemente quando o utilizador entra na secção de reserva e reaparece ao afastar-se.
  - Ao clicar, executa scroll suave até `#reserva` e foca o campo do nome.
- **10 Secções Estruturadas (Copy Oficial em Português de Angola)**:
  1. *Hero* com proposta de valor, preço unitário e CTA principal.
  2. *O Problema* (desconforto visual ao volante e limitações da pala solar original).
  3. *A Solução* (configuração dupla 2 em 1 dia/noite e ajuste articulado).
  4. *Características* (4 cartões: luz solar, painel amarelado, articulação e design compacto).
  5. *Demonstração* (apresentação visual dos detalhes e fixação).
  6. *Público-Alvo* (motoristas particulares, táxis, viagens frequentes).
  7. *Preço e Pacotes* (destaque de 17.000 Kz com opções de 2 e 3 unidades).
  8. *Perguntas Frequentes (FAQ)* (6 perguntas oficiais com sanfona/accordion interativo).
  9. *Chamada Final* (reforço de conveniência antes do formulário).
  10. *Reserva (`#reserva`)* (formulário nativo integrado com aviso de segurança no rodapé).

---

### 3. Key Product Decisions & Trade-Offs

- **Reutilização Integral do Pipeline de Reservas**:
  - *Decisão*: Reutilizar a função `handleFormSubmit` do `App.tsx`, a coleção `leads` do Firestore, os pop-ups de confirmação em 2 passos (`step1` e `success`), o cálculo de preço e a integração Meta Conversions API (CAPI).
  - *Porquê*: Garante consistência de dados absoluta, compatibilidade com o funil CRM do Valida C e zero regressão nas outras páginas.
- **Componente Modular Dedicado (`VisorAutomovelView.tsx`)**:
  - *Decisão*: Criar `src/components/VisorAutomovelView.tsx` espelhando a arquitetura de `CamisaSedaView.tsx` e `CintaColombianaView.tsx`.
  - *Porquê*: Mantém o código desacoplado, limpo e testável sem inflar o `App.tsx` com milhares de linhas de marcação visual.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│                        URL / Router                    │
│  ?product=visor-automovel  ou  ?view=sales-visor-automovel  │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                     App.tsx State                      │
│ - view: "sales-visor-automovel"                        │
│ - formData (name, phone, province, area, quantity)    │
│ - isSubmitting, modalState, currentLeadId             │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
               ▼                          ▼
┌─────────────────────────────┐  ┌───────────────────────┐
│    VisorAutomovelView.tsx   │  │   Modal Confirmação   │
│ - 6 Imagens Reais           │  │ - Passo 1: Resumo     │
│ - Carrossel 3.200ms (Fade)  │  │ - Passo 2: Garantido  │
│ - Sticky CTA + Observer     │  └───────────────────────┘
│ - Form Secção #reserva      │               │
└──────────────┬──────────────┘               │
               │ Submissão                    │
               ▼                              ▼
┌─────────────────────────────┐  ┌───────────────────────┐
│     Firestore (leads)       │  │   Meta CAPI & Pixel   │
│ - produto: Visor Automóvel  │  │ - Evento: Lead        │
│ - valor/totalPrice: Kz      │  │ - Moeda: USD (1k=1$)  │
└─────────────────────────────┘  └───────────────────────┘
```

#### Mapeamento de Ficheiros a Atualizar:
1. `src/components/VisorAutomovelView.tsx` *(Novo)*: Componente completo da página de vendas com todas as 10 secções, carrossel 3.2s, sticky CTA com `IntersectionObserver`, acordeão FAQ e formulário `#reserva`.
2. `src/App.tsx`:
   - Adicionar `"sales-visor-automovel"` aos estados de rota e `isSalesView`.
   - Adicionar o item ao `PRODUCTS_LIST` para seleção na loja/admin.
   - Adicionar regras de precificação (`computedTotal`) e nome de produto em `handleFormSubmit` e no modal de reserva.
   - Renderizar `<VisorAutomovelView />` quando `view === "sales-visor-automovel"`.
3. `src/services/leadUtils.ts`: Atualizar `getLeadPrice` para reconhecer `Visor Automóvel` (17.000 Kz para 1 un, 30.000 Kz para 2 un, 44.000 Kz para 3 un).
4. `index.html`: Assegurar que os metadados de SEO padrão ou dinâmicos incluam o título e descrição solicitados.

---

### Verification & Testing Plan

1. **Responsividade Mobile & Desktop**: Testar carrossel, layout fluido e espaçamentos em viewport móvel (375px–414px) e desktop (1440px).
2. **Carrossel Automático**: Validar ciclo contínuo de 3.200ms, transição suave, pausa ao arrastar/clicar e botões manuais.
3. **Sticky CTA**: Verificar visibilidade inicial, desaparecimento exato ao interceptar `#reserva` e reaparecimento ao rolar para cima/baixo.
4. **Submissão de Reserva Real**: Preencher formulário de teste, verificar criação do documento na coleção `leads` do Firestore, abertura do modal de sucesso e disparo de evento Meta.
5. **Preservação de Páginas Anteriores**: Testar navegação para Camisa Seda, Cinta Colombiana, Base Móvel e Secador UV, garantindo que nada foi alterado.
