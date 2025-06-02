function PrintReportLayout({ children }: { children: React.ReactNode }) {
    return (
       <html lang="en">
      <body>
        {children}
      </body>
    </html>
    );
}

export default PrintReportLayout;