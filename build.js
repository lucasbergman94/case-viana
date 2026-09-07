#!/usr/bin/env node
/*
 * build.js — gera o index.html final com os painéis embutidos.
 *
 * Por que isto existe: a apresentação não pode depender de rede para aparecer.
 * O index.html publicado precisa conter os painéis no HTML, para que o case
 * abra com JavaScript desligado, por file:// (duplo clique num arquivo salvo),
 * dentro de um zip enviado por e-mail e em qualquer leitor restritivo.
 *
 * Uso: node build.js   (rodar sempre antes de commitar)
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PARTS = ['sections-a.html', 'sections-b.html', 'sections-c.html', 'sections-d.html'];
const SRC = path.join(ROOT, 'index.src.html');
const OUT = path.join(ROOT, 'index.html');

const missing = PARTS.filter(f => !fs.existsSync(path.join(ROOT, f)));
if (missing.length) {
  console.error('Faltam parciais:', missing.join(', '));
  process.exit(1);
}

const deck = PARTS
  .map(f => fs.readFileSync(path.join(ROOT, f), 'utf8').trim())
  .join('\n\n');

const src = fs.readFileSync(SRC, 'utf8');
if (!src.includes('<!--DECK-->')) {
  console.error('index.src.html nao contem o marcador <!--DECK-->');
  process.exit(1);
}

fs.writeFileSync(OUT, src.replace('<!--DECK-->', '\n' + deck + '\n'), 'utf8');

const panels = (deck.match(/data-slide="/g) || []).length;
console.log(`index.html gerado: ${panels} paineis, ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB`);
