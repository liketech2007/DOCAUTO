"use client"
import { useState } from "react"
import jsPDF from 'jspdf';
import Link from "next/link"
import { Configuration, OpenAIApi } from "openai"

export default function Home() {
  const [link,setLink] = useState("")
  const [text,setText] = useState("")

  async function gerar() {

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: `Faz um artigo com introdução desenvolvimento e conclusão sobre ${text}`}],
    });
    const  data = completion !== null ? completion.data.choices[0].message?.content : ""

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

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

    // Cria um link de download para o arquivo PDF
    const blob = new Blob([doc.output('blob')], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setLink(url)


  }
  return (
    <main className="bg-white flex min-h-screen flex-col items-center justify-center gap-8 p-24">
      <form onSubmit={gerar} className="flex gap-8">
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Tema da documento"/>
        <input type="submit" value="Gerar" className="bg-black text-white rounded-lg p-4 hover:bg-transparent hover:text-black transition-all"/>
      </form>

      <a href={link} download className="bg-black text-white rounded-lg p-4 hover:bg-transparent hover:text-black transition-all">
        baixar
      </a>
    </main>
  )
}
