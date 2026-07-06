/* ============================================================
   ÁFRICA BURGER — MOTOR DO SITE
   Renderização a partir de js/data.js + interações
   ============================================================ */
(function () {
  "use strict";

  const D = window.AB_DATA;
  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const REDUZIDO = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TATIL = !window.matchMedia("(hover:hover) and (pointer:fine)").matches;

  const kz = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " Kz";
  const slug = (d) => d.cidade.toUpperCase().replace(/\s+/g, "_") + "_BURGER";

  /* ============================================================
     SOM (opcional — nunca inicia sozinho)
     ============================================================ */
  const Som = {
    ctx: null, amb: null, ligado: false,
    ativa() {
      try {
        this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
        const ctx = this.ctx;
        const g = ctx.createGain(); g.gain.value = 0; g.connect(ctx.destination);
        const o1 = ctx.createOscillator(); o1.type = "sine"; o1.frequency.value = 92;
        const o2 = ctx.createOscillator(); o2.type = "sine"; o2.frequency.value = 138;
        const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 300;
        o1.connect(lp); o2.connect(lp); lp.connect(g);
        o1.start(); o2.start();
        g.gain.linearRampToValueAtTime(0.018, ctx.currentTime + 1.4);
        this.amb = { g, o1, o2 };
      } catch (e) { /* áudio indisponível */ }
    },
    desativa() {
      if (!this.amb) return;
      try {
        const a = this.amb, ctx = this.ctx;
        a.g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
        setTimeout(() => { try { a.o1.stop(); a.o2.stop(); } catch (e) {} }, 600);
      } catch (e) {}
      this.amb = null;
    },
    tick(freq, dur, vol) {
      if (!this.ligado || !this.ctx) return;
      try {
        const ctx = this.ctx;
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine"; o.frequency.value = freq || 880;
        g.gain.value = 0; o.connect(g); g.connect(ctx.destination);
        o.start();
        g.gain.linearRampToValueAtTime(vol || 0.05, ctx.currentTime + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (dur || 0.18));
        setTimeout(() => { try { o.stop(); } catch (e) {} }, (dur || 0.18) * 1000 + 80);
      } catch (e) {}
    },
    chegada() { this.tick(740, 0.14, 0.045); setTimeout(() => this.tick(1108, 0.22, 0.045), 130); }
  };

  const somBtn = $("#som-btn");
  somBtn.addEventListener("click", () => {
    Som.ligado = !Som.ligado;
    somBtn.classList.toggle("on", Som.ligado);
    somBtn.setAttribute("aria-pressed", String(Som.ligado));
    somBtn.querySelector("b").textContent = Som.ligado ? "SOM ON" : "SOM";
    if (Som.ligado) Som.ativa(); else Som.desativa();
  });

  /* ============================================================
     LOADER
     ============================================================ */
  const loader = $("#loader");
  let loaderFechado = false;
  function fechaLoader() {
    if (loaderFechado) return;
    loaderFechado = true;
    loader.classList.add("done");
  }
  window.addEventListener("load", () => setTimeout(fechaLoader, REDUZIDO ? 150 : 2100));
  setTimeout(fechaLoader, 5000); // segurança absoluta

  /* ============================================================
     CURSOR PERSONALIZADO
     ============================================================ */
  (function cursor() {
    if (TATIL || REDUZIDO) return;
    document.body.classList.add("cursor-on");
    const dot = $("#cursor-dot"), ring = $("#cursor-ring"), tag = $("#cursor-tag");
    let tx = 0, ty = 0, rx = 0, ry = 0, visto = false;
    document.addEventListener("mousemove", (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!visto) { visto = true; dot.style.opacity = "1"; ring.style.opacity = "1"; }
      dot.style.transform = `translate(${tx}px,${ty}px) translate(-50%,-50%)`;
      const alvo = e.target.closest("[data-cursor]");
      ring.classList.toggle("hover", !!alvo);
      const rotulo = alvo && alvo.getAttribute("data-tag");
      if (rotulo) { tag.textContent = rotulo; tag.classList.add("show"); }
      else tag.classList.remove("show");
      tag.style.transform = `translate(${tx + 14}px,${ty + 16}px)`;
    });
    document.addEventListener("mousedown", () => { ring.style.transition = "none"; ring.style.width = "26px"; ring.style.height = "26px"; });
    document.addEventListener("mouseup", () => { ring.style.transition = ""; ring.style.width = ""; ring.style.height = ""; });
    (function anima() {
      rx += (tx - rx) * 0.16; ry += (ty - ry) * 0.16;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(anima);
    })();
  })();

  /* ============================================================
     NAVEGAÇÃO
     ============================================================ */
  const nav = $("#nav");
  const menuMobile = $("#menu-mobile");
  const burger = $(".nav-burger");
  let heroAltura = window.innerHeight;

  function estadoNav() {
    const y = window.scrollY;
    nav.classList.toggle("sombra", y > 40);
    document.body.classList.toggle("on-orange", y < heroAltura * 0.72 && !document.body.classList.contains("overlay-aberto"));
  }
  burger.addEventListener("click", () => {
    const aberto = document.body.classList.toggle("menu-aberto");
    menuMobile.classList.toggle("open", aberto);
    burger.setAttribute("aria-expanded", String(aberto));
    burger.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    document.body.style.overflow = aberto ? "hidden" : "";
  });
  $$("#menu-mobile a").forEach((a) => a.addEventListener("click", () => {
    document.body.classList.remove("menu-aberto");
    menuMobile.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }));

  /* ============================================================
     HERO — crossfade do vídeo + rota lateral
     ============================================================ */
  (function heroVideo() {
    const vA = $("#vid-a"), vB = $("#vid-b");
    if (!vA || !vB) return;
    const ANTES_DO_FIM = 1.3;
    let ativo = vA, espera = vB, aFundir = false;
    setInterval(() => {
      if (document.hidden) return;
      if (ativo.duration && ativo.currentTime >= ativo.duration - ANTES_DO_FIM && !aFundir) {
        aFundir = true;
        espera.currentTime = 0;
        espera.play().catch(() => {});
        espera.style.opacity = "1";
        ativo.style.opacity = "0";
        const antigo = ativo; ativo = espera; espera = antigo;
        setTimeout(() => { espera.pause(); espera.currentTime = 0; aFundir = false; }, 1350);
      }
      if (ativo.paused && !aFundir) ativo.play().catch(() => {});
    }, 240);
  })();

  (function heroRota() {
    const svg = $("#hero-rota-svg");
    if (!svg) return;
    const NS = "http://www.w3.org/2000/svg";
    const nomes = D.destinos.map((d) => d.cidade.toUpperCase());
    const passos = nomes.length;
    const yIni = 40, yFim = 600;
    const pts = nomes.map((n, i) => ({
      x: i % 2 === 0 ? 58 : 104,
      y: yIni + (yFim - yIni) * (i / (passos - 1)),
    }));
    let dTop = `M ${pts[0].x - 20} -30 C ${pts[0].x + 40} ${yIni - 50}, ${pts[0].x - 40} ${yIni - 6}, ${pts[0].x} ${pts[0].y}`;
    const linha = document.createElementNS(NS, "path");
    let dd = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      dd += ` C ${a.x} ${(a.y + b.y) / 2}, ${b.x} ${(a.y + b.y) / 2}, ${b.x} ${b.y}`;
    }
    linha.setAttribute("d", dTop + " " + dd.replace(/^M [^C]+/, ""));
    linha.setAttribute("class", "hr-linha");
    svg.appendChild(linha);
    pts.forEach((p, i) => {
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", p.x); c.setAttribute("cy", p.y); c.setAttribute("r", 11);
      svg.appendChild(c);
      const t = document.createElementNS(NS, "text");
      t.setAttribute("x", p.x + 26); t.setAttribute("y", p.y + 5);
      t.setAttribute("class", "hr-nome");
      t.textContent = nomes[i];
      svg.appendChild(t);
    });
  })();

  /* ============================================================
     LIGAÇÕES WHATSAPP
     ============================================================ */
  const waBase = "https://wa.me/" + D.contacto.whatsapp;
  const waGeral = waBase + "?text=" + encodeURIComponent("Olá! 👋 Quero fazer um pedido na África Burger. 🍔");
  $("#wa-flutuante").href = waGeral;
  $("#btn-pedido-final").href = waGeral;
  $$("[data-social]").forEach((a) => { a.href = D.social[a.dataset.social] || "#"; });

  /* ============================================================
     RENDERIZAÇÃO — estatísticas, quote, destinos, sobre, footer
     ============================================================ */
  const ICONES_STATS = [
    '<svg viewBox="0 0 24 24"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 1 8 8c0 5.4-8 12-8 12S4 15.4 4 10a8 8 0 0 1 8-8Z"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M4 15h16M4 15a2 2 0 0 1 0-4h16a2 2 0 0 1 0 4M6 11c0-3 2.5-5 6-5s6 2 6 5M5 19h14"/><circle cx="9" cy="8.5" r=".8" fill="currentColor" stroke="none"/><circle cx="13.5" cy="8" r=".8" fill="currentColor" stroke="none"/></svg>',
    '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.2-.2-4.2 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.5-2.4 1.5-3.5.5 1.5 1.5 3 2 3Z"/></svg>',
  ];
  $("#stats").innerHTML = D.stats.map((s, i) => `
    <div class="stat">
      <span class="stat-icone">${ICONES_STATS[i % ICONES_STATS.length]}</span>
      <div><b data-contador>${s.valor}</b><span>${s.rotulo}</span><small>${s.sub}</small></div>
    </div>`).join("");
  $("#mapa-quote-texto").innerHTML = D.brand.quote.replace(". ", ".<br>");

  /* ---------- Secções de destino ---------- */
  const numero = (i) => String(i + 1).padStart(2, "0");
  $("#destinos").innerHTML = D.destinos.map((d, i) => `
    <section class="destino" id="destino-${d.id}" data-indice="${i}" aria-label="Destino ${numero(i)}: ${d.cidade}">
      <span class="destino-fundo" aria-hidden="true" style="background-image:url('${d.fundo}')"></span>
      <span class="num-fantasma" aria-hidden="true">${numero(i)}</span>
      <div class="destino-grid">
        <div class="destino-texto" data-reveal>
          <div class="d-eyebrow"><span class="gota" aria-hidden="true"></span>
            <span class="eyebrow">DESTINO ATUAL · ${numero(i)} / ${numero(D.destinos.length - 1)}</span>
          </div>
          <h2>${d.cidade}</h2>
          <p class="d-pais"><img class="bandeira-ico" src="assets/flags/${d.bandeiraCod}.svg" alt="Bandeira de ${d.pais}" loading="lazy">${d.pais}</p>
          <p class="d-titulo">${d.titulo}</p>
          <p class="d-desc">${d.desc}</p>
          <div class="d-badges" aria-hidden="true">
            <span class="badge"><svg viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.2-.2-4.2 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.5-2.4 1.5-3.5.5 1.5 1.5 3 2 3Z"/></svg> GRELHADO NA HORA</span>
            <span class="badge"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg> PREPARO ${d.preparo.toUpperCase()}</span>
          </div>
          <div class="d-ingr" aria-label="Ingredientes">
            ${d.ingredientes.slice(0, 6).map((x) => `<span>${x}</span>`).join("")}
          </div>
          <div class="d-acoes">
            <b class="d-preco">${kz(d.preco)}</b>
            <button class="btn-pill" data-abrir="${i}" data-cursor data-tag="VER MAIS">VER HAMBÚRGUER <span aria-hidden="true">→</span></button>
            <button class="btn-ghost" data-abrir="${i}" data-cursor>PEDIR AGORA</button>
          </div>
        </div>
        <div class="destino-foto" data-reveal="${i % 2 === 0 ? "right" : "left"}">
          <span class="foto-selo">DESTINO ${numero(i)}</span>
          <div class="foto-moldura" data-abrir="${i}" data-cursor data-tag="EXPLORAR" role="button" tabindex="0"
               aria-label="Ver detalhes do hambúrguer de ${d.cidade}">
            <img class="d-foto" src="${d.img}" alt="Hambúrguer ${d.titulo} — ${d.cidade}" ${i > 0 ? 'loading="lazy"' : ""}>
            <span class="foto-brilho" aria-hidden="true"></span>
            <span class="foto-vapor" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="foto-tag">VÍDEO · 360° · DETALHES</span>
            <span class="foto-coord"><span>${d.coord}</span><span>${slug(d)}</span></span>
          </div>
        </div>
      </div>
    </section>`).join("");

  /* ---------- Sobre ---------- */
  $("#sobre-paragrafos").innerHTML = D.sobre.paragrafos.map((p) => `<p data-reveal>${p}</p>`).join("");
  $("#sobre-quote").innerHTML = D.brand.quote.replace(". ", ".<br>");
  $("#sobre-chips").innerHTML = D.sobre.chips.map((c) => `
    <div class="s-chip"><b>${c.valor}</b><span>${c.rotulo}</span><small>${c.sub}</small></div>`).join("");
  $(".hist-grid").insertAdjacentHTML("beforeend", D.sobre.historias.map((h) => `
    <div class="hist-card" data-reveal><img src="${h.img}" alt="${h.alt}" loading="lazy"></div>`).join(""));

  /* ---------- Newsletter ---------- */
  $("#news-eyebrow").textContent = D.newsletter.eyebrow;
  $("#news-titulo").textContent = D.newsletter.titulo;
  $("#news-texto").textContent = D.newsletter.texto;
  $("#news-beneficios").innerHTML = D.newsletter.beneficios.map((b) => `
    <div><span class="ic" aria-hidden="true">${b.icone}</span><span><b>${b.titulo}</b><small>${b.sub}</small></span></div>`).join("");
  $("#news-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("#news-email");
    if (!email.value || !email.checkValidity()) { email.focus(); email.style.borderColor = "#F97316"; return; }
    $(".news-card").classList.add("enviado");
    Som.tick(880, 0.2, 0.05);
  });

  /* ---------- Footer ---------- */
  const IC = {
    nav: '<svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
    tel: '<svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.5 2.8.6a2 2 0 0 1 1.8 2.1Z"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 1 8 8c0 5.4-8 12-8 12S4 15.4 4 10a8 8 0 0 1 8-8Z"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6L22 7"/></svg>',
    hora: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>',
    users: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M21.5 20a6.5 6.5 0 0 0-4.5-6.2"/></svg>',
    fone: '<svg viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/></svg>',
  };
  const SOC = {
    instagram: '<svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8 0 3.2 0 3.6-.1 4.8-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1-3.2 0-3.6 0-4.8-.1-3.3-.1-4.8-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.8 0-3.2 0-3.6.1-4.8C2.4 4 4 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 3.6a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24"><path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4h-3v-3.5h3V9.4c0-3 1.8-4.7 4.6-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.8v8.4A12 12 0 0 0 24 12z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24"><path d="M19.6 6.7a5.6 5.6 0 0 1-3.4-3.6A5 5 0 0 1 16 2h-3.4v13.6a2.9 2.9 0 1 1-2-2.7V9.4a6.3 6.3 0 1 0 5.4 6.2V8.8a8.9 8.9 0 0 0 4.6 1.3V6.8l-1-.1z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-1-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8a9.9 9.9 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4a9.8 9.8 0 1 1 8.3 4.6zM12 .3A11.7 11.7 0 0 0 1.9 17.9L.3 23.7l6-1.6A11.7 11.7 0 1 0 12 .3z"/></svg>',
  };
  $("#foot-grid").innerHTML = `
    <div class="f-col f-marca" data-reveal>
      <img src="assets/logo-512.png" alt="África Burger">
      <p>Mais que hambúrgueres. Uma viagem gastronómica por África. Sabores autênticos, ingredientes selecionados e paixão em cada detalhe.</p>
      <a class="btn-ghost" href="#sobre" data-cursor>SAIBA MAIS SOBRE NÓS <span aria-hidden="true">→</span></a>
      <div class="f-aval">
        <b>${D.avaliacao.nota}</b>
        <span><span class="estrelas" aria-hidden="true">★★★★★</span><small>${D.avaliacao.texto}</small></span>
      </div>
    </div>
    <div class="f-col" data-reveal>
      <h4>${IC.nav} NAVEGAÇÃO</h4>
      <nav aria-label="Navegação do rodapé">
        <a href="#mapa" data-cursor>A Viagem <span aria-hidden="true">›</span></a>
        <a href="#destino-${D.destinos[0].id}" data-cursor>Cardápio <span aria-hidden="true">›</span></a>
        <a href="#mapa" data-cursor>Destinos <span aria-hidden="true">›</span></a>
        <a href="#sobre" data-cursor>Sobre Nós <span aria-hidden="true">›</span></a>
        <a href="#contacto" data-cursor>Contacto <span aria-hidden="true">›</span></a>
        <a href="#" data-cursor>Trabalhe Connosco <span aria-hidden="true">›</span></a>
        <a href="#" data-cursor>Termos e Condições <span aria-hidden="true">›</span></a>
        <a href="#" data-cursor>Política de Privacidade <span aria-hidden="true">›</span></a>
      </nav>
    </div>
    <div class="f-col" data-reveal>
      <h4>${IC.tel} CONTACTO</h4>
      <ul class="f-contacto">
        <li>${IC.pin}<span>${D.contacto.morada.join("<br>")}</span></li>
        <li>${IC.tel}<span>${D.contacto.telefones.join("<br>")}</span></li>
        <li>${IC.mail}<a href="mailto:${D.contacto.email}" data-cursor>${D.contacto.email}</a></li>
        <li>${IC.hora}<span>${D.contacto.horario}<br>${D.contacto.horarioExtra}</span></li>
      </ul>
      <a class="btn-ghost" href="${D.contacto.mapaUrl}" target="_blank" rel="noopener" data-cursor>VER NO MAPA <span aria-hidden="true">➤</span></a>
    </div>
    <div class="f-col" data-reveal>
      <h4>${IC.users} SIGA-NOS</h4>
      <div class="f-social">
        <a href="${D.social.instagram}" target="_blank" rel="noopener" data-cursor><span class="ic">${SOC.instagram}</span> Instagram</a>
        <a href="${D.social.facebook}" target="_blank" rel="noopener" data-cursor><span class="ic">${SOC.facebook}</span> Facebook</a>
        <a href="${D.social.tiktok}" target="_blank" rel="noopener" data-cursor><span class="ic">${SOC.tiktok}</span> TikTok</a>
        <a href="${D.social.whatsapp}" target="_blank" rel="noopener" data-cursor><span class="ic">${SOC.whatsapp}</span> WhatsApp</a>
      </div>
    </div>
    <div class="f-col" data-reveal>
      <h4>${IC.fone} APP ÁFRICA BURGER</h4>
      <div class="f-app">
        <div>
          <p>Peça mais rápido, acompanhe a sua viagem e acumule recompensas. Descarregue agora!</p>
          <div class="lojas">
            <a class="loja-badge" href="${D.app.googlePlay}" data-cursor aria-label="Disponível no Google Play">
              <svg viewBox="0 0 24 24"><path d="M3.6 1.8 13.7 12 3.6 22.2c-.4-.2-.6-.7-.6-1.2V3c0-.5.2-1 .6-1.2ZM14.9 13.2l2.6 2.6-11 6.2 8.4-8.8Zm3.8-4.4 2.6 1.5c.9.5.9 1.9 0 2.4l-2.6 1.5-3-3 3-2.4ZM6.5 2l11 6.2-2.6 2.6L6.5 2Z"/></svg>
              <span><small>DISPONÍVEL NO</small><b>Google Play</b></span>
            </a>
            <a class="loja-badge" href="${D.app.appStore}" data-cursor aria-label="Descarregar na App Store">
              <svg viewBox="0 0 24 24"><path d="M17.05 12.5c0-2.4 2-3.6 2-3.6a4.6 4.6 0 0 0-3.6-1.9c-1.5-.2-3 .9-3.7.9-.8 0-2-.9-3.3-.9A4.9 4.9 0 0 0 4.4 9.5c-1.8 3-.4 7.5 1.3 10 .8 1.2 1.8 2.5 3.1 2.5 1.2-.1 1.7-.8 3.2-.8s1.9.8 3.3.8c1.3 0 2.2-1.2 3-2.4a10 10 0 0 0 1.4-2.8 4.4 4.4 0 0 1-2.7-4.3ZM14.5 5c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.1 1.8-1 2.9 1.1.1 2.2-.6 2.8-1.4Z"/></svg>
              <span><small>DESCARREGAR NA</small><b>App Store</b></span>
            </a>
          </div>
        </div>
        <img class="f-phone" src="assets/phone-app.png" alt="Aplicação África Burger num telemóvel" loading="lazy">
      </div>
    </div>`;

  const IC_CONF = [
    '<svg viewBox="0 0 24 24"><path d="M12 2 4 5.5v5.3c0 5 3.4 9.6 8 10.7 4.6-1.1 8-5.7 8-10.7V5.5L12 2Z"/><path d="m8.8 12 2.2 2.2 4.2-4.4"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M3 16V6a1 1 0 0 1 1-1h9v11M13 8h4.5L21 11.5V16h-8M3 16h2m8 0h2"/><circle cx="7" cy="18.5" r="2"/><circle cx="17" cy="18.5" r="2"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M12 21c-4 0-7-3-7-7 0-5 7-12 7-12s7 7 7 12c0 4-3 7-7 7Z" transform="rotate(40 12 12)"/><path d="M8 14c1.5 2 4.5 3 7 1"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.2-.2-4.2 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.5-2.4 1.5-3.5.5 1.5 1.5 3 2 3Z"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M12 21s-7-4.6-9.5-9A5.6 5.6 0 0 1 12 6.3 5.6 5.6 0 0 1 21.5 12c-2.5 4.4-9.5 9-9.5 9Z"/></svg>',
  ];
  $("#fc-grid").innerHTML = D.confianca.map((c, i) => `
    <div class="fc-item" data-reveal>${IC_CONF[i % IC_CONF.length]}<span><b>${c.titulo}</b><small>${c.sub}</small></span></div>`).join("");
  $("#ff-frase1").textContent = D.brand.assinatura;
  $("#ff-frase2").textContent = D.brand.assinatura2;

  /* ============================================================
     MAPA — pins + rota do palco + carro em passeio
     ============================================================ */
  const PIN_SVG = `
    <svg viewBox="0 0 44 52" aria-hidden="true">
      <defs><linearGradient id="pinG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#FDBA74"/><stop offset=".5" stop-color="#F97316"/><stop offset="1" stop-color="#EA580C"/>
      </linearGradient></defs>
      <path d="M22 1C10.4 1 1 10.2 1 21.6 1 36 22 51 22 51s21-15 21-29.4C43 10.2 33.6 1 22 1Z" fill="url(#pinG)" stroke="#FFD9B0" stroke-width="1"/>
      <circle cx="22" cy="20" r="8" fill="#191007"/>
      <circle cx="22" cy="20" r="3.4" fill="#F3EADB"/>
    </svg>`;
  const MAPA_PTS = [
    { x: 130, y: 660 }, { x: 420, y: 592 }, { x: 322, y: 458 },
    { x: 520, y: 348 }, { x: 428, y: 228 }, { x: 598, y: 108 },
  ];
  const palco = $("#mapa-palco");
  const mrLinha = $("#mr-linha");

  function catmull(pts) {
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  }
  mrLinha.setAttribute("d", catmull(MAPA_PTS.concat([{ x: 700, y: 46 }])));

  D.destinos.forEach((d, i) => {
    const p = MAPA_PTS[i];
    const b = document.createElement("button");
    b.className = "mapa-pin";
    b.style.left = (p.x / 800 * 100) + "%";
    b.style.top = (p.y / 760 * 100) + "%";
    b.setAttribute("data-cursor", "");
    b.setAttribute("data-tag", "IR PARA " + d.cidade.toUpperCase());
    b.setAttribute("aria-label", `Viajar até ${d.cidade}, ${d.pais}`);
    b.innerHTML = `
      <span class="mp-icone">${PIN_SVG}<span class="mp-anel" aria-hidden="true"></span></span>
      <span class="mp-nome">${d.cidade.toUpperCase()}</span>
      <span class="mp-pais">${d.pais.toUpperCase()}</span>`;
    b.addEventListener("click", () => {
      Som.tick(660, 0.1, 0.04);
      document.getElementById("destino-" + d.id).scrollIntoView({ behavior: REDUZIDO ? "auto" : "smooth", block: "start" });
    });
    palco.appendChild(b);
  });

  /* carro do mapa: passeio contínuo pela linha */
  (function carroMapa() {
    const carro = $("#mapa-carro");
    const svgLinha = mrLinha;
    if (REDUZIDO) { carro.style.display = "none"; return; }
    let len = 0, t0 = performance.now();
    const DURACAO = 26000;
    function frame(agora) {
      if (!len) { try { len = svgLinha.getTotalLength(); } catch (e) {} }
      if (len) {
        const rect = palco.getBoundingClientRect();
        const visivel = rect.bottom > 0 && rect.top < window.innerHeight;
        if (visivel) {
          carro.style.opacity = "1";
          const t = ((agora - t0) % DURACAO) / DURACAO;
          const suave = t; // linear no loop
          const p = svgLinha.getPointAtLength(len * suave);
          const p2 = svgLinha.getPointAtLength(Math.min(len, len * suave + 2));
          const ang = Math.atan2(p2.y - p.y, p2.x - p.x) * 180 / Math.PI;
          const sx = rect.width / 800, sy = rect.height / 760;
          const inclina = Math.max(-22, Math.min(22, ang));
          carro.style.transform = `translate(${p.x * sx - 28}px, ${p.y * sy - 30}px) rotate(${inclina}deg)`;
        } else carro.style.opacity = "0";
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();

  $("#btn-como").addEventListener("click", () => {
    mostraToast("Siga a rota e clique num destino", "O SEU PEDIDO CHEGA PELO WHATSAPP");
    const primeiro = $(".mapa-pin");
    if (primeiro) {
      primeiro.style.transition = "transform .4s cubic-bezier(.16,1,.3,1)";
      primeiro.style.transform = "translate(-50%,-50%) scale(1.18)";
      setTimeout(() => { primeiro.style.transform = "translate(-50%,-50%)"; }, 900);
    }
  });

  /* ============================================================
     ROTA CONTÍNUA + CARRO GPS (segue o scroll)
     ============================================================ */
  const viagem = $("#viagem");
  const rotaBase = $("#rota-base"), rotaProg = $("#rota-prog");
  const gpsCarro = $("#gps-carro");
  let rotaLen = 0;
  let rotaY0 = 0, rotaY1 = 1; // extensão vertical real do traçado (início → pino de chegada)

  function medirRota() {
    const vr = viagem.getBoundingClientRect();
    const W = viagem.offsetWidth;
    const mobile = window.innerWidth < 860;
    const pts = [];
    const topoY = ($("#mapa").offsetTop + $("#mapa").offsetHeight * 0.92);

    pts.push({ x: mobile ? 26 : W * 0.5, y: topoY - (mobile ? 120 : 60) });

    $$(".destino").forEach((sec) => {
      const foto = sec.querySelector(".foto-moldura");
      const rs = sec.getBoundingClientRect();
      const rf = foto.getBoundingClientRect();
      const cy = rs.top - vr.top + rs.height / 2;
      if (mobile) {
        pts.push({ x: 26, y: cy - rs.height * 0.22 });
        pts.push({ x: 44, y: cy + rs.height * 0.1 });
      } else {
        const cx = rf.left - vr.left + rf.width / 2;
        const fora = (rf.left - vr.left) > W / 2 ? Math.min(W - 70, cx + rf.width * 0.62) : Math.max(70, cx - rf.width * 0.62);
        pts.push({ x: fora, y: cy - rs.height * 0.3 });
        pts.push({ x: fora, y: cy + rs.height * 0.06 });
      }
    });

    const sobre = $("#sobre");
    pts.push({ x: mobile ? 26 : W * 0.62, y: sobre.offsetTop + sobre.offsetHeight * 0.5 });
    const chegada = $("#chegada");
    const pinChegada = chegada.querySelector(".chegada-pin");
    const rc = pinChegada.getBoundingClientRect();
    pts.push({ x: rc.left - vr.left + rc.width / 2, y: chegada.offsetTop + pinChegada.offsetTop + rc.height / 2 });

    if (pts.length < 2) return; // medição incompleta — mantém o traçado anterior
    const d = catmull(pts);
    if (!d) return;
    rotaBase.setAttribute("d", d);
    rotaProg.setAttribute("d", d);
    try {
      const novoLen = rotaProg.getTotalLength();
      if (novoLen > 0) {
        // só substitui o estado válido se a nova medição for utilizável —
        // uma medição falhada a meio do scroll nunca deve travar o carro
        rotaLen = novoLen;
        rotaProg.style.strokeDasharray = rotaLen;
        rotaY0 = pts[0].y;
        rotaY1 = pts[pts.length - 1].y;
      }
    } catch (e) { /* mantém a medição anterior; tenta novamente no próximo ciclo */ }
  }

  function atualizaRota() {
    if (!rotaLen || rotaY1 <= rotaY0) return;
    const jt = viagem.offsetTop;
    // progresso mapeado ao alcance real da linha (início → pino), não à altura
    // total de #viagem — assim o carro chega mesmo ao destino final ao invés
    // de ficar a meio caminho quando há conteúdo a seguir ao pino
    const alvo = window.scrollY + window.innerHeight * 0.55 - jt;
    const p = Math.max(0, Math.min(1, (alvo - rotaY0) / (rotaY1 - rotaY0)));
    rotaProg.style.strokeDashoffset = String(rotaLen * (1 - p));
    try {
      if (p > 0.003) {
        const comprimento = rotaLen * p;
        const pt = rotaProg.getPointAtLength(comprimento);
        const pt2 = rotaProg.getPointAtLength(Math.min(rotaLen, comprimento + 3));
        const inclina = Math.max(-24, Math.min(24, (pt2.x - pt.x) * 6));
        gpsCarro.style.opacity = "1";
        gpsCarro.style.transform = `translate(${pt.x - 27}px, ${pt.y - 22}px) rotate(${inclina}deg)`;
      } else {
        gpsCarro.style.opacity = "0";
      }
    } catch (e) { /* geometria transitória (ex.: remedição a meio) — ignora este frame */ }
  }

  /* ============================================================
     HUD GPS + TOAST DE CHEGADA
     ============================================================ */
  const hud = $("#gps-hud"), hudCidade = $("#hud-cidade"), hudProg = $("#hud-prog-i");
  const toast = $("#gps-toast");
  let toastTimer = null, cidadeAtual = -1;

  function mostraToast(titulo, sub) {
    $("#toast-titulo").textContent = titulo;
    $("#toast-sub").textContent = sub;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3400);
  }

  const ioDestinos = new IntersectionObserver((ents) => {
    ents.forEach((e) => {
      if (!e.isIntersecting) return;
      const i = Number(e.target.dataset.indice);
      if (i === cidadeAtual) return;
      cidadeAtual = i;
      const d = D.destinos[i];
      hudCidade.textContent = d.cidade.toUpperCase();
      hudProg.style.width = ((i + 1) / D.destinos.length * 100) + "%";
      hud.classList.add("show");
      mostraToast(`Chegou a ${d.cidade}`, `DESTINO ${numero(i)} · ${d.pais.toUpperCase()}`);
      Som.chegada();
      const pinMapa = $$(".mapa-pin")[i];
      if (pinMapa) pinMapa.classList.add("visitado");
    });
  }, { threshold: 0.45 });
  $$(".destino").forEach((s) => ioDestinos.observe(s));

  const ioForaViagem = new IntersectionObserver((ents) => {
    ents.forEach((e) => { if (e.isIntersecting) { hud.classList.remove("show"); cidadeAtual = -1; } });
  }, { threshold: 0.3 });
  [$("#hero"), $("#chegada"), $("#contacto")].forEach((s) => s && ioForaViagem.observe(s));

  /* ============================================================
     REVELAÇÕES + CONTADORES
     ============================================================ */
  const ioReveal = new IntersectionObserver((ents) => {
    ents.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); ioReveal.unobserve(e.target); }
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
  function observaReveals() { $$("[data-reveal]").forEach((el) => ioReveal.observe(el)); }
  observaReveals();

  const ioContador = new IntersectionObserver((ents) => {
    ents.forEach((e) => {
      if (!e.isIntersecting) return;
      ioContador.unobserve(e.target);
      const alvo = e.target, texto = alvo.textContent.trim();
      const m = texto.match(/^(\d+)(.*)$/);
      if (!m || REDUZIDO) return;
      const fim = parseInt(m[1], 10), sufixo = m[2] || "";
      const pad = m[1].length;
      const t0 = performance.now(), dur = 1300;
      (function passo(agora) {
        const t = Math.min(1, (agora - t0) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        alvo.textContent = String(Math.round(fim * eased)).padStart(pad, "0") + sufixo;
        if (t < 1) requestAnimationFrame(passo);
      })(t0);
    });
  }, { threshold: 0.6 });
  $$("[data-contador]").forEach((el) => ioContador.observe(el));

  /* ============================================================
     INCLINAÇÃO 3D DAS FOTOS (desktop)
     ============================================================ */
  if (!TATIL && !REDUZIDO) {
    $$(".foto-moldura").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.transform = `perspective(1100px) rotateY(${(px - 0.5) * 7}deg) rotateX(${(0.5 - py) * 6}deg)`;
        card.style.setProperty("--mx", (px * 100) + "%");
        card.style.setProperty("--my", (py * 100) + "%");
      });
      card.addEventListener("mouseleave", () => {
        card.style.transition = "transform .7s cubic-bezier(.16,1,.3,1)";
        card.style.transform = "";
        setTimeout(() => { card.style.transition = ""; }, 700);
      });
    });
  }

  /* ============================================================
     OVERLAY DO DESTINO (detalhe + pedido)
     ============================================================ */
  const overlay = $("#overlay");
  const Pedido = { i: 0, tamanho: "simples", extras: new Set(), comps: new Map(), qtd: 1, modo: "foto" };
  let ultimoFoco = null;

  const MODOS = [
    { id: "foto",     rotulo: "FOTO DO PRODUTO",      badge: "FOTO · PRODUTO",  icone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m21 15-4.5-4.5L6 21"/></svg>' },
    { id: "video",    rotulo: "VÍDEO DO HAMBÚRGUER",  badge: "VÍDEO · LOOP",    icone: '<svg viewBox="0 0 24 24"><polygon points="7 4 20 12 7 20 7 4"/></svg>' },
    { id: "360",      rotulo: "360° DO PRODUTO",      badge: "ROTAÇÃO · 360°",  icone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.5 12a8.5 8.5 0 1 1-3-6.5"/><path d="M21 2v5h-5"/></svg>' },
    { id: "detalhes", rotulo: "DETALHES",             badge: "MACRO · DETALHE", icone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4-4M11 8v6M8 11h6"/></svg>' },
  ];

  function abreOverlay(i, origem) {
    Pedido.i = i;
    Pedido.tamanho = D.tamanhos[0].id;
    Pedido.extras.clear();
    Pedido.comps.clear();
    Pedido.qtd = 1;
    Pedido.modo = "foto";
    ultimoFoco = origem || document.activeElement;

    const d = D.destinos[i];
    $("#ov-cidade").textContent = d.cidade.toUpperCase();
    $("#ov-pais").innerHTML = `<img class="bandeira-ico" src="assets/flags/${d.bandeiraCod}.svg" alt="Bandeira de ${d.pais}">${d.pais}`;
    $("#ov-titulo").textContent = d.titulo;
    $("#ov-desc").textContent = d.descLonga;
    $("#ov-coord").textContent = d.coord;
    $("#ov-slug").textContent = slug(d);
    $("#ov-preparo").textContent = d.preparo.toUpperCase();

    $("#ov-ingredientes").innerHTML = d.ingredientes.map((x) => `<li>${x}</li>`).join("");
    $("#ov-extras").innerHTML = D.extras.map((x) => `
      <label data-cursor><input type="checkbox" value="${x.id}"> ${x.nome}
        <span class="preco">+ ${kz(x.preco)}</span></label>`).join("");
    $("#ov-tamanhos").innerHTML = D.tamanhos.map((t, k) => `
      <button class="ov-tam ${k === 0 ? "ativo" : ""}" data-tam="${t.id}" data-cursor role="radio" aria-checked="${k === 0}">
        <b>${t.nome}</b><span>${kz(d.preco + t.extra)}</span>
      </button>`).join("");
    $("#ov-comps").innerHTML = D.complementos.map((c) => `
      <button class="ov-comp" data-comp="${c.id}" data-cursor aria-label="Adicionar ${c.nome}">
        <span class="qtd-badge">×1</span>
        <img src="${c.img}" alt="">
        <b>${c.nome}</b>
        <span class="linha-baixo"><span class="preco">+ ${kz(c.preco)}</span><span class="mais" aria-hidden="true">+</span></span>
      </button>`).join("");
    $("#ov-proximos-lista").innerHTML = D.destinos.map((x, k) =>
      k === i ? "" : `<button class="ov-prox" data-prox="${k}" data-cursor><span class="ponto" aria-hidden="true"></span>${x.cidade.toUpperCase()}</button>`
    ).join("");

    ligaOpcoes();
    montaMedia("foto");
    montaThumbs();
    atualizaTotal();

    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add("open"));
    document.body.style.overflow = "hidden";
    document.body.classList.add("overlay-aberto");
    document.body.classList.remove("on-orange");
    overlay.scrollTop = 0;
    $("#ov-fechar").focus({ preventScroll: true });
    Som.tick(520, 0.12, 0.04);
  }

  function fechaOverlay(scrollPara) {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    document.body.classList.remove("overlay-aberto");
    const video = overlay.querySelector("video");
    if (video) { video.pause(); }
    setTimeout(() => {
      overlay.hidden = true;
      if (scrollPara) scrollPara();
      else if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus({ preventScroll: true });
      estadoNav();
    }, 420);
  }

  function montaMedia(modo) {
    Pedido.modo = modo;
    const d = D.destinos[Pedido.i];
    const camada = $("#ov-camada");
    const m = MODOS.find((x) => x.id === modo);
    $("#ov-modo-badge").textContent = m.badge;
    if (modo === "video") {
      camada.className = "ov-camada";
      camada.innerHTML = `<video src="${d.video}" autoplay muted loop playsinline poster="assets/video-poster.jpg"></video>`;
    } else {
      camada.className = "ov-camada " + (modo === "360" ? "modo-360" : modo === "detalhes" ? "modo-detalhes" : "");
      camada.innerHTML = `<img src="${d.img}" alt="Hambúrguer ${d.titulo}">`;
    }
    $$(".ov-thumb").forEach((t) => {
      const sel = t.dataset.modo === modo;
      t.classList.toggle("ativo", sel);
      t.setAttribute("aria-selected", String(sel));
    });
  }

  function montaThumbs() {
    const d = D.destinos[Pedido.i];
    $("#ov-thumbs").innerHTML = MODOS.map((m) => `
      <button class="ov-thumb ${m.id === "foto" ? "ativo" : ""}" data-modo="${m.id}" data-cursor role="tab" aria-selected="${m.id === "foto"}">
        <img src="${d.img}" alt="">
        <span class="t-icone" aria-hidden="true">${m.icone}</span>
        <span>${m.rotulo}</span>
      </button>`).join("");
    $$(".ov-thumb").forEach((t) => t.addEventListener("click", () => { montaMedia(t.dataset.modo); Som.tick(600, 0.08, 0.03); }));
  }

  function ligaOpcoes() {
    $$("#ov-extras input").forEach((inp) => inp.addEventListener("change", () => {
      if (inp.checked) Pedido.extras.add(inp.value); else Pedido.extras.delete(inp.value);
      atualizaTotal();
      Som.tick(inp.checked ? 760 : 440, 0.08, 0.035);
    }));
    $$(".ov-tam").forEach((b) => b.addEventListener("click", () => {
      Pedido.tamanho = b.dataset.tam;
      $$(".ov-tam").forEach((x) => { x.classList.toggle("ativo", x === b); x.setAttribute("aria-checked", String(x === b)); });
      atualizaTotal();
      Som.tick(700, 0.08, 0.035);
    }));
    $$(".ov-comp").forEach((b) => b.addEventListener("click", () => {
      const id = b.dataset.comp;
      const atual = Pedido.comps.get(id) || 0;
      const novo = (atual + 1) % 4; // 0→1→2→3→0
      if (novo === 0) Pedido.comps.delete(id); else Pedido.comps.set(id, novo);
      b.classList.toggle("sel", novo > 0);
      b.querySelector(".qtd-badge").textContent = "×" + (novo || 1);
      atualizaTotal();
      Som.tick(novo === 0 ? 440 : 820, 0.08, 0.035);
    }));
    $("#ov-menos").onclick = () => { if (Pedido.qtd > 1) { Pedido.qtd--; atualizaTotal(); Som.tick(500, .06, .03); } };
    $("#ov-mais").onclick = () => { if (Pedido.qtd < 20) { Pedido.qtd++; atualizaTotal(); Som.tick(640, .06, .03); } };
    $$("[data-prox]").forEach((b) => b.addEventListener("click", () => {
      const k = Number(b.dataset.prox);
      fechaOverlay(() => {
        document.getElementById("destino-" + D.destinos[k].id).scrollIntoView({ behavior: REDUZIDO ? "auto" : "smooth" });
        setTimeout(() => abreOverlay(k), REDUZIDO ? 200 : 900);
      });
    }));
  }

  function calculaTotal() {
    const d = D.destinos[Pedido.i];
    const tam = D.tamanhos.find((t) => t.id === Pedido.tamanho);
    let unidade = d.preco + tam.extra;
    Pedido.extras.forEach((id) => { unidade += D.extras.find((x) => x.id === id).preco; });
    let total = unidade * Pedido.qtd;
    Pedido.comps.forEach((q, id) => { total += D.complementos.find((c) => c.id === id).preco * q; });
    return total;
  }

  function textoPedido() {
    const d = D.destinos[Pedido.i];
    const tam = D.tamanhos.find((t) => t.id === Pedido.tamanho);
    const linhas = [
      "🍔 *NOVO PEDIDO — ÁFRICA BURGER*",
      "",
      `📍 Destino: *${d.cidade.toUpperCase()}* — ${d.titulo}`,
      `▫️ Tamanho: ${tam.nome}`,
    ];
    if (Pedido.extras.size) {
      linhas.push("▫️ Extras: " + Array.from(Pedido.extras).map((id) => D.extras.find((x) => x.id === id).nome).join(", "));
    }
    if (Pedido.comps.size) {
      const c = [];
      Pedido.comps.forEach((q, id) => c.push(`${D.complementos.find((x) => x.id === id).nome} ×${q}`));
      linhas.push("▫️ Acompanhamentos: " + c.join(", "));
    }
    linhas.push(`▫️ Quantidade: ${Pedido.qtd}`);
    linhas.push("");
    linhas.push(`💰 *Total: ${kz(calculaTotal())}*`);
    linhas.push("");
    linhas.push("A minha viagem começa agora. 🚙💨");
    return linhas.join("\n");
  }

  function atualizaTotal() {
    $("#ov-qtd-num").textContent = Pedido.qtd;
    $("#ov-total").textContent = kz(calculaTotal());
    $("#ov-pedir").href = waBase + "?text=" + encodeURIComponent(textoPedido());
  }

  /* aberturas */
  document.addEventListener("click", (e) => {
    const alvo = e.target.closest("[data-abrir]");
    if (alvo) abreOverlay(Number(alvo.dataset.abrir), alvo);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      const alvo = e.target.closest(".foto-moldura[data-abrir]");
      if (alvo) { e.preventDefault(); abreOverlay(Number(alvo.dataset.abrir), alvo); }
    }
    if (e.key === "Escape") {
      if (!overlay.hidden) fechaOverlay();
      if (document.body.classList.contains("menu-aberto")) burger.click();
    }
  });
  $("#ov-fechar").addEventListener("click", () => fechaOverlay());
  $("#ov-voltar").addEventListener("click", () => fechaOverlay());
  overlay.addEventListener("click", (e) => { if (e.target === overlay) fechaOverlay(); });
  $("#ov-continuar").addEventListener("click", () => {
    const prox = Pedido.i + 1;
    fechaOverlay(() => {
      const destino = prox < D.destinos.length
        ? document.getElementById("destino-" + D.destinos[prox].id)
        : $("#chegada");
      destino.scrollIntoView({ behavior: REDUZIDO ? "auto" : "smooth" });
    });
  });

  /* ============================================================
     SCROLL / RESIZE
     ============================================================ */
  let aPintar = false;
  window.addEventListener("scroll", () => {
    if (aPintar) return;
    aPintar = true;
    requestAnimationFrame(() => {
      // try/finally é essencial: sem isto, um único erro num frame deixava
      // aPintar preso em "true" e o scroll parava de atualizar a rota para sempre
      try { estadoNav(); atualizaRota(); }
      finally { aPintar = false; }
    });
  }, { passive: true });

  let timerResize = null;
  window.addEventListener("resize", () => {
    heroAltura = window.innerHeight;
    clearTimeout(timerResize);
    timerResize = setTimeout(() => { medirRota(); atualizaRota(); }, 180);
  });

  function arranque() { medirRota(); atualizaRota(); estadoNav(); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => setTimeout(arranque, 80));
  window.addEventListener("load", () => setTimeout(arranque, 250));
  setTimeout(arranque, 900);
  setTimeout(arranque, 2400);
})();
