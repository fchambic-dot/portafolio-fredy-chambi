(() => {
  'use strict';
  const P = window.PROFILE;
  const $ = (id) => document.getElementById(id);
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  let toastTimer;

  function notify(message) {
    const toast = $('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2700);
  }
  function list(items, extraClass = '') {
    return `<ul class="${extraClass}">${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
  }
  function gallery(experience) {
    const images = Array.isArray(experience.images) ? experience.images : [];
    const slots = images.length
      ? images.slice(0,5).map((image,index) => `<button class="gallery-slot image-slot" data-gallery="${escapeHtml(image.src)}" data-alt="${escapeHtml(image.alt || 'Imagen profesional') }" data-caption="${escapeHtml(image.caption || '')}" aria-label="Abrir imagen ${index+1}: ${escapeHtml(image.alt || 'Imagen profesional')}"><img loading="lazy" src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt || '')}"></button>`).join('')
      : Array.from({length:4},(_,index) => `<div class="gallery-slot"><span><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 18 9 12l4 4 4-7 4 9H3Z" stroke="currentColor" stroke-width="1.3"/><circle cx="8" cy="7" r="2" stroke="currentColor" stroke-width="1.3"/></svg>${index===0?'Imagen principal':'Imagen complementaria'}<br>Disponible para agregar</span></div>`).join('');
    return `<details class="gallery-details"><summary>Galería de experiencia <span>· ${images.length ? `${images.length} imagen${images.length===1?'':'es'}` : 'espacio preparado'}</span></summary><div class="gallery-grid">${slots}</div>${images.length?'':`<p class="gallery-help">El CV no incluye fotografías de esta experiencia. Agrega imágenes verificables en el arreglo <code>images</code> del archivo <code>data.js</code>.</p>`}</details>`;
  }
  function renderExperience(filter='all') {
    const experiences = P.experience.filter(item => filter==='all' || item.category===filter);
    $('experienceList').innerHTML = experiences.map((item,index) => `<article class="experience-card reveal" id="experience-${P.experience.indexOf(item)}"><div class="experience-date"><strong>${escapeHtml(item.period)}</strong><span>${escapeHtml(item.location)}</span><span>${escapeHtml(item.start)} — ${escapeHtml(item.end)}</span></div><div class="experience-main"><h3>${escapeHtml(item.title)}</h3><p class="company">${escapeHtml(item.organization)} <span>· ${escapeHtml(item.location)}</span></p><p class="experience-intro">${escapeHtml(item.intro)}</p><button class="detail-toggle" aria-expanded="false" aria-controls="detail-${index}"><span>＋</span> Ver responsabilidades, métodos y galería</button><div class="experience-details" id="detail-${index}" hidden><div class="detail-grid"><section class="detail-block"><h4>PRINCIPALES CONTRIBUCIONES</h4>${list(item.contributions)}</section>${item.achievements.length?`<section class="detail-block achievement-block"><h4>LOGROS DOCUMENTADOS</h4>${list(item.achievements)}</section>`:''}<section class="detail-block"><h4>NORMATIVA Y METODOLOGÍAS</h4><div class="tag-list">${item.methods.map(tag=>`<span>${escapeHtml(tag)}</span>`).join('')}</div></section>${item.tools.length?`<section class="detail-block"><h4>EQUIPOS Y HERRAMIENTAS</h4><div class="tag-list">${item.tools.map(tag=>`<span>${escapeHtml(tag)}</span>`).join('')}</div></section>`:''}</div>${gallery(item)}</div></div></article>`).join('');
    $('experienceList').querySelectorAll('.detail-toggle').forEach(button => button.addEventListener('click', () => {
      const panel = $(button.getAttribute('aria-controls'));
      const opening = button.getAttribute('aria-expanded')!=='true';
      button.setAttribute('aria-expanded',String(opening)); panel.hidden=!opening;
      button.innerHTML = `<span>${opening?'＋':'＋'}</span> ${opening?'Ocultar detalles':'Ver responsabilidades, métodos y galería'}`;
    }));
    observeReveals();
  }
  function renderCourses(search='',limit=8) {
    const filtered=P.courses.filter(course=>`${course.name} ${course.provider} ${course.date}`.toLocaleLowerCase('es').includes(search.toLocaleLowerCase('es')));
    const visible=filtered.slice(0,limit);
    $('courseList').innerHTML=visible.length?visible.map(course=>`<article class="course-item"><h3>${escapeHtml(course.name)}</h3><div class="course-meta"><span>${escapeHtml(course.provider)}</span><span>${escapeHtml(course.hours)}</span><span>${escapeHtml(course.date)}</span></div></article>`).join(''):`<p class="course-empty">No se encontraron cursos con ese término.</p>`;
    $('courseCount').textContent=`${filtered.length} cursos`;
    $('loadMoreCourses').hidden=filtered.length<=limit;
    $('loadMoreCourses').textContent=`Ver ${Math.min(8,filtered.length-limit)} más · ${filtered.length-limit} restantes ↓`;
  }
  function render() {
    $('heroName').textContent=P.name; $('heroRole').textContent=P.role; $('heroSummary').textContent=P.tagline;
    $('profileSummary').textContent=P.summary;
    $('profilePhoto').src=P.photo;
    $('metrics').innerHTML=P.metrics.map(metric=>`<div class="metric"><div class="metric-value">${escapeHtml(metric.value)}</div><div class="metric-label">${escapeHtml(metric.label)}</div></div>`).join('');
    $('impactMetrics').innerHTML=P.metrics.map(metric=>`<div class="impact-stat"><b>${escapeHtml(metric.value)}</b><span>${escapeHtml(metric.label)}</span></div>`).join('');
    renderExperience();
    $('contributions').innerHTML=P.contributions.map((item,index)=>`<article class="contribution-card reveal"><span class="contribution-index">0${index+1} / EXPERIENCIA APLICADA</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p><div class="tag-list">${item.tags.map(tag=>`<span>${escapeHtml(tag)}</span>`).join('')}</div></article>`).join('');
    $('skillGroups').innerHTML=P.skills.map(group=>`<article class="skill-group"><h3>${escapeHtml(group.group.toLocaleUpperCase('es'))}</h3><div class="skill-items">${group.items.map(item=>`<span>${escapeHtml(item)}</span>`).join('')}</div></article>`).join('');
    $('softwareList').innerHTML=P.software.map(tool=>`<span class="tool-chip">${escapeHtml(tool)}</span>`).join('');
    $('educationList').innerHTML=P.education.map(item=>`<article class="education-item"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.institution)}</p>${item.period?`<span>${escapeHtml(item.period)}</span>`:''}</article>`).join('');
    $('languages').innerHTML=P.languages.map(item=>`<span>${escapeHtml(item)}</span>`).join('');
    renderCourses();
    $('hobbies').innerHTML=P.hobbies.map(item=>`<em>${escapeHtml(item)}</em>`).join('');
    $('emailButton').href=`mailto:${P.email}`; $('emailText').href=`mailto:${P.email}`; $('emailText').textContent=P.email;
    $('phoneText').href=`tel:${P.phone.replace(/[^+\d]/g,'')}`; $('phoneText').textContent=P.phone;
    const person={'@context':'https://schema.org','@type':'Person','name':P.name,'jobTitle':P.role,'description':P.summary,'email':`mailto:${P.email}`,'telephone':P.phone,'image':new URL(P.photo,location.href).href,'address':{'@type':'PostalAddress','addressCountry':'PE'}};
    const schema=document.createElement('script');schema.type='application/ld+json';schema.textContent=JSON.stringify(person);document.head.append(schema);
  }
  function observeReveals() {
    const items=document.querySelectorAll('.reveal:not(.in-view)');
    if(!('IntersectionObserver' in window)){items.forEach(item=>item.classList.add('in-view'));return;}
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}}),{threshold:.06});items.forEach(item=>observer.observe(item));
  }
  function setupNavigation() {
    const toggle=$('menuToggle'),nav=$('primaryNav');
    toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Cerrar menú de navegación':'Abrir menú de navegación');nav.classList.toggle('open',open);});
    nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menú de navegación');}));
    document.querySelectorAll('.filter-chip').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.filter-chip').forEach(item=>item.classList.toggle('selected',item===button));renderExperience(button.dataset.filter);}));
  }
  function setupCourses() {
    let limit=8;renderCourses('',limit);
    $('loadMoreCourses').addEventListener('click',()=>{limit+=8;renderCourses($('courseSearch').value,limit);});
    $('courseSearch').addEventListener('input',()=>{limit=8;renderCourses($('courseSearch').value,limit);});
  }
  function openGallery(src,alt,caption) {
    $('modalContent').innerHTML=`<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" id="modalTitle"><p>${escapeHtml(caption||alt)}</p>`;
    const modal=$('galleryModal');modal.hidden=false;$('modalClose').focus();document.body.style.overflow='hidden';
  }
  function closeGallery(){$('galleryModal').hidden=true;document.body.style.overflow='';}
  function setupGallery(){
    document.addEventListener('click',event=>{const target=event.target.closest('[data-gallery]');if(target)openGallery(target.dataset.gallery,target.dataset.alt,target.dataset.caption);});
    $('modalClose').addEventListener('click',closeGallery);$('galleryModal').addEventListener('click',event=>{if(event.target===$('galleryModal'))closeGallery();});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!$('galleryModal').hidden)closeGallery();});
  }
  function atsLines(){
    const lines=[];const add=(text='')=>lines.push(String(text));
    add(P.name.toLocaleUpperCase('es'));add('Ingeniero Químico Colegiado | CIP 315397');
    add(`Perú | ${P.phone} | ${P.email}`);add('');add('PERFIL PROFESIONAL');add(P.summary);add('');
    add('EXPERIENCIA PROFESIONAL');
    const numericDate=date=>{const months={ene:'01',feb:'02',mar:'03',abr:'04',may:'05',jun:'06',jul:'07',ago:'08',sep:'09',oct:'10',nov:'11',dic:'12'};return date.replace(/^(\d{2})\s+([a-z]{3})\s+(\d{4})$/i,(_,day,month,year)=>`${day}/${months[month.toLowerCase()]}/${year}`);};
    P.experience.forEach(item=>{add(item.title);add(`${item.organization} | ${item.location}`);add(`${numericDate(item.start)} – ${numericDate(item.end)}`);item.contributions.forEach(value=>add(`- ${value}`));item.achievements.forEach(value=>add(`- Logro: ${value}`));add('');});
    add('EDUCACIÓN');P.education.forEach(item=>{add(item.title);add(item.institution);if(item.period)add(item.period);});add('');
    add('HABILIDADES');P.skills.forEach(group=>add(`${group.group}: ${group.items.join(', ')}`));add(`Software: ${P.software.join(', ')}`);add('');
    add('CURSOS Y CAPACITACIONES');P.courses.forEach(course=>add(`${course.name} — ${course.provider} — ${course.hours} — ${course.date}`));add('');
    add('IDIOMAS');P.languages.forEach(item=>add(item));return lines;
  }
  function downloadATS(){
    if(!window.jspdf?.jsPDF){
      const printWindow=window.open('','_blank');if(!printWindow){notify('Permite la ventana emergente para guardar el CV como PDF.');return;}
      const headings=new Set(['PERFIL PROFESIONAL','EXPERIENCIA PROFESIONAL','EDUCACIÓN','HABILIDADES','CURSOS Y CAPACITACIONES','IDIOMAS']);
      const content=atsLines().map((line,index)=>!line?'':headings.has(line)?`<h2>${escapeHtml(line)}</h2>`:index===0?`<h1>${escapeHtml(line)}</h1>`:`<p>${escapeHtml(line)}</p>`).join('');
      printWindow.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${escapeHtml(P.name)} · CV ATS</title><style>@page{size:letter;margin:18mm}body{font:10pt/1.42 Arial,sans-serif;color:#222}h1{font-size:18pt;margin:0 0 8pt}h2{font-size:10pt;text-transform:uppercase;border-bottom:1px solid #bbb;padding:0 0 4pt;margin:14pt 0 7pt}p{margin:3pt 0;overflow-wrap:anywhere}button{display:none}</style></head><body>${content}<script>window.print()<\\/script></body></html>`);printWindow.document.close();notify('En la ventana de impresión, elige “Guardar como PDF”.');return;
    }
    const pdf=new window.jspdf.jsPDF({unit:'pt',format:'letter',compress:true});const margin=54,width=pdf.internal.pageSize.getWidth()-margin*2;let y=52;
    const headings=new Set(['PERFIL PROFESIONAL','EXPERIENCIA PROFESIONAL','EDUCACIÓN','HABILIDADES','CURSOS Y CAPACITACIONES','IDIOMAS']);
    const fullName=P.name.toLocaleUpperCase('es');
    for(const line of atsLines()){
      if(!line){y+=7;continue;}
      const heading=headings.has(line),isName=line===fullName;
      const size=isName?17:heading?10:9.5;const leading=heading?14:12.4;
      pdf.setFont('helvetica',heading||isName?'bold':'normal');pdf.setFontSize(size);pdf.setTextColor(heading?35:42,heading?66:49,heading?57:51);
      const wrapped=pdf.splitTextToSize(line,width);
      if(y+wrapped.length*leading>pdf.internal.pageSize.getHeight()-48){pdf.addPage();y=52;}
      if(heading){y+=5;pdf.setDrawColor(208,219,211);pdf.line(margin,y-7,pdf.internal.pageSize.getWidth()-margin,y-7);}
      pdf.text(wrapped,margin,y);y+=wrapped.length*leading;
    }
    const slug=P.name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z0-9]+/g,'_').replace(/^_|_$/g,'');
    pdf.save(`${slug}_CV_ATS.pdf`);notify('CV ATS descargado: una columna, texto seleccionable y sin fotografía.');
  }
  function setupDownload(){document.querySelectorAll('[data-download-cv]').forEach(button=>button.addEventListener('click',downloadATS));}
  function setupActiveNavigation(){
    if(!('IntersectionObserver' in window))return;
    const sections=[...document.querySelectorAll('main section[id]')];
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){const active=`#${entry.target.id}`;document.querySelectorAll('.primary-nav a').forEach(link=>{if(link.hash===active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}}),{rootMargin:'-35% 0px -55% 0px'});sections.forEach(section=>observer.observe(section));
  }
  render();setupNavigation();setupCourses();setupGallery();setupDownload();setupActiveNavigation();observeReveals();
})();
