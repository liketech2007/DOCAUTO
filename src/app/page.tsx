"use client"
import { useState } from "react"
import jsPDF from 'jspdf';
import { Configuration, OpenAIApi } from "openai"

export default function Home() {
  const [text,setText] = useState("")
  const [load,setLoad] = useState(false)

  async function gerar() {

    setLoad(true)
    const configuration = new Configuration({
      apiKey: "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",
    });
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: `Faz um artigo com introdução desenvolvimento e conclusão sobre ${text}`}],
    });
    console.log(completion)

    const data1 = `Introdução:

    O futebol é um esporte popular em todo o mundo, com uma história que remonta a mais de um século. É um esporte que é jogado em todos os continentes e possui um número incrível de fãs em todo o mundo. O futebol é um esporte emocionante e competitivo, com jogadores de todas as idades e habilidades que competem em todos os níveis, desde jogos de bairro até partidas profissionais.
    
    Desenvolvimento:
    
    O futebol é um esporte de equipe jogado com uma bola. O objetivo do jogo é marcar gols, colocando a bola na rede do adversário, enquanto se defende sua própria rede de ser atingida. Cada equipe tem 11 jogadores em campo, incluindo um goleiro. O futebol é um esporte que requer uma combinação de habilidades físicas, técnicas e mentais, incluindo velocidade, força, habilidade com a bola, precisão e estratégia.
    
    O futebol é um esporte que tem uma grande base de fãs em todo o mundo. As pessoas são apaixonadas por futebol e muitas vezes se tornam torcedores de uma equipe específica desde jovens. O futebol profissional é um esporte de bilhões de dólares, com jogadores e equipes competindo em todo o mundo. As competições de futebol mais famosas incluem a Copa do Mundo, a Liga dos Campeões da UEFA, a Premier League Inglesa, a La Liga Espanhola, a Serie A Italiana, a Bundesliga Alemã, entre outras.
    
    O futebol também é um esporte que promove a inclusão e a diversidade. O esporte pode ser jogado por qualquer pessoa, independentemente de sua idade, sexo, habilidade ou origem. O futebol é um esporte que conecta pessoas de todas as culturas e países. Muitas vezes, as pessoas encontram sua identidade e senso de comunidade através de suas equipes de futebol favoritas.
    
    Conclusão:
    
    O futebol é um esporte emocionante que tem uma base de fãs global e é jogado por milhões de pessoas em todo o mundo. É um esporte que requer habilidade física, técnica e mental, e promove a inclusão e a diversidade. O futebol é mais do que apenas um jogo, é uma paixão que une pessoas de todas as culturas e países. Com sua popularidade crescente, o futebol continuará sendo um esporte amado por muitos anos.`

    const  data = completion !== null ? completion.data.choices[0].message?.content : data1
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    doc.setFont('arial', 'normal')
    doc.setFontSize(12)

    const pageHeight = doc.internal.pageSize.height - 20;


    // Divide o texto do artigo em três partes
    const intro = data && data.substring(0, data.indexOf('Desenvolvimento:')).trim();
    const dev = data && data.substring(data.indexOf('Desenvolvimento:'), data.indexOf('Conclusão:')).replace('Desenvolvimento:', '').trim();
    const conclusao = data && data.substring(data.indexOf('Conclusão:')).replace('Conclusão:', '').trim();

    // Adiciona a introdução à primeira página do PDF
    doc.text(`${intro}`, 10, 10, { maxWidth: 190 });
    doc.addPage();

    // Adiciona o desenvolvimento à segunda página do PDF
    let devLines = doc.splitTextToSize(`${dev}`, 190);
    let devY = 10;
    devLines.forEach((line:any) => {
      if (devY + 10 > pageHeight) {
        doc.addPage();
        devY = 10;
      }
      doc.text(line, 10, devY);
      devY += 10;
    });
    doc.addPage();

    // Adiciona a conclusão à terceira página do PDF
    doc.text(`${conclusao}`, 10, 10, { maxWidth: 190 });
    doc.save('artigo-futebol.pdf');
    setLoad(false)
  }
  return (
    <main className="bg-white flex min-h-screen flex-col items-center justify-center gap-8 p-24">
      <form onSubmit={(e) => {
        e.preventDefault()
        gerar()
      }} className="flex gap-8">
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Tema da documento" className="py-2 px-4"/>
        <input type="submit" value="Gerar" className="bg-black text-white rounded-lg py-2 px-6 hover:bg-transparent hover:text-black transition-all"/>
      </form>

      
      { load && <div className="my-8">Carregando...</div>}
    </main>
  )
}
