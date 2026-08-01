const fs = require('fs');
const brasileirao = require('campeonato-brasileiro-api');

async function main() {
  const rounds = await brasileirao.getRounds('b');
  const todasPartidas = rounds.rounds.flatMap(r => r.matches);

  const locais = JSON.parse(fs.readFileSync('locais.json', 'utf8'));

  const jogosDoNautico = todasPartidas
    .filter(m => m.homeTeam.name.includes('Náutico') || m.awayTeam.name.includes('Náutico'))
    .map(m => {
      const infoLocal = locais.por_rodada[String(m.round)] || locais.padrao;
      return {
        data: m.date,
        hora: m.time,
        status: m.status,
        mandante: m.homeTeam.name,
        visitante: m.awayTeam.name,
        placarMandante: m.score?.home ?? null,
        placarVisitante: m.score?.away ?? null,
        estadio: m.venue,
        rodada: m.round,
        localAssistir: infoLocal.local,
        tipoAssistir: infoLocal.tipo,
        distancia: infoLocal.distancia || null
      };
    });

  fs.writeFileSync('jogos.json', JSON.stringify(jogosDoNautico, null, 2));
  console.log(`Salvos ${jogosDoNautico.length} jogos do Náutico.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
