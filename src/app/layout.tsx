export const metadata = {
  title: 'DOCAUTO',
  description: 'Gerador de documentos criado por Óscar Jeremias',
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
