// lancé par le test « local » de NeoDex : lit les mots affichés, retrouve les groupes dans le code du jeu,
// fait une erreur « à un près », puis trouve les quatre groupes et vérifie que la grille est réussie
// (avec NEO_SHOTS : garde des images du jeu, sans la teinte du thème)
module.exports = async ({ pj, sleep }) => {
  const key = k => pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: '${k}', bubbles: true})), 0`);
  const label = () => pj(`document.getElementById('qtCanvas').getAttribute('aria-label')`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('qtCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'quatuor-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  const src = require('fs').readFileSync(require('path').join(process.env.NEO_LOCAL || __dirname, 'index.js'), 'utf8');
  const grids = src.split('\n').filter(l => /^  \[\['/.test(l)).map(l => [...l.matchAll(/\['[^']+', \[([^\]]+)\]\]/g)].map(m => m[1].split(', ').map(w => w.slice(1, -1))));
  const read = async () => { const l = await label(), m = /grille (\d+), (\d+) groupes trouvés.*Mots : (.*)\.$/.exec(l); if (!m) throw new Error('grille illisible : « ' + l + ' »'); return {l, idx: +m[1] - 1, found: +m[2], words: m[3] ? m[3].split(', ') : []}; };
  // un clic sur la case i (mêmes mesures que le jeu : cases de 58 x 26, écart 2, grille à (3, 15) sur un dessin de 244 x 172)
  const click = (s, w) => { const i = s.words.indexOf(w), x = 3 + (i % 4) * 60 + 29, y = 15 + (s.found + Math.floor(i / 4)) * 28 + 13;
    return pj(`(() => { const c = document.getElementById('qtCanvas'), r = c.getBoundingClientRect(); c.dispatchEvent(new PointerEvent('pointerdown', {bubbles: true, clientX: r.left + ${x} / 244 * r.width, clientY: r.top + ${y} / 172 * r.height})); return 0; })()`); };
  const pickAll = async ws => { const s = await read(); for (const w of ws) await click(s, w); };
  await sleep(500);
  let s = await read(); const G = grids[s.idx];
  if (!G || G.length !== 4) throw new Error('groupes introuvables pour la grille ' + (s.idx + 1));
  await pickAll([G[2][0], G[3][1]]); await sleep(150); await shot('0-depart'); await key('Backspace');
  await pickAll([G[0][0], G[0][1], G[0][2], G[1][0]]); await key('Enter'); await sleep(120); await shot('1-erreur');
  await sleep(900); if (!/3 erreurs permises/.test(await label())) throw new Error('erreur non comptée : « ' + (await label()) + ' »');
  for (let k = 0; k < 4; k++) { await key('Backspace'); await pickAll(G[k]); await key('Enter'); await sleep(k === 1 ? 500 : 700); if (k === 1) await shot('2-deux'); }
  await sleep(1600); await shot('3-gagne');
  s = await read();
  if (!/grille réussie/.test(s.l) || s.found !== 4) throw new Error('grille non réussie : « ' + s.l + ' »');
  if (process.env.NEO_SHOTS) {  // grille suivante, quatre erreurs : les groupes se dévoilent
    await key('Enter'); await sleep(500); const s2 = await read(), G2 = grids[s2.idx];
    for (let k = 0; k < 4; k++) { await key('Backspace'); await pickAll(G2.map(gr => gr[k])); await key('Enter'); await sleep(400); }
    await sleep(3200); await shot('4-perdu');
  }
  return s.l;
};
