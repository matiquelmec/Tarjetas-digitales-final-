import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptionsSafe } from '@/lib/auth-safe';
import { prisma } from '@/lib/db';
import puppeteer from 'puppeteer';

// Export presentation to PDF
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptionsSafe);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = params;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'pdf';

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Buscar la presentación
    const presentation = await prisma.presentation.findFirst({
      where: {
        id,
        userId: user.id
      }
    });

    if (!presentation) {
      return NextResponse.json(
        { error: 'Presentación no encontrada' },
        { status: 404 }
      );
    }

    if (format === 'pdf') {
      // Generar PDF usando Puppeteer
      const pdfBuffer = await generatePresentationPDF(presentation);
      
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${presentation.title.replace(/[^a-z0-9]/gi, '_')}.pdf"`,
        },
      });
    } else if (format === 'pptx') {
      // En el futuro, aquí podríamos generar PowerPoint
      return NextResponse.json(
        { error: 'Formato PPTX no disponible aún. Usa formato PDF.' },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { error: 'Formato no soportado. Use: pdf, pptx' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error exporting presentation:', error);
    return NextResponse.json(
      { error: 'Error exportando presentación' },
      { status: 500 }
    );
  }
}

async function generatePresentationPDF(presentation: any): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // Obtener slides y tema
    const slides = Array.isArray(presentation.slides) ? presentation.slides : [];
    const theme = presentation.theme || {
      name: 'stellar',
      primaryColor: '#00f6ff',
      secondaryColor: '#0072ff',
      backgroundColor: '#0f0c29',
      fontFamily: 'Inter'
    };

    // Generar HTML para todas las slides
    const htmlContent = generateSlidesHTML(slides, theme, presentation.title);

    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0'
    });

    // Generar PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
    });

    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

function generateSlidesHTML(slides: any[], theme: any, title: string): string {
  const textColor = theme.backgroundColor === '#ffffff' || theme.backgroundColor === 'white' 
    ? '#1f2937' : '#ffffff';

  const slidesHTML = slides.map((slide, index) => {
    return `
      <div class="slide" style="
        page-break-after: ${index < slides.length - 1 ? 'always' : 'auto'};
        width: 100%;
        height: 100vh;
        background-color: ${theme.backgroundColor};
        color: ${textColor};
        font-family: ${theme.fontFamily}, sans-serif;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 60px;
        box-sizing: border-box;
      ">
        ${renderSlideContent(slide, theme, textColor)}
        <div style="
          position: absolute;
          bottom: 20px;
          right: 20px;
          font-size: 12px;
          opacity: 0.6;
        ">
          ${index + 1} / ${slides.length}
        </div>
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', sans-serif;
        }
        
        .slide {
          position: relative;
        }
        
        h1, h2, h3 {
          text-align: center;
          margin-bottom: 1rem;
        }
        
        ul {
          list-style: none;
          padding: 0;
        }
        
        li {
          margin-bottom: 0.75rem;
          position: relative;
          padding-left: 1.5rem;
        }
        
        li::before {
          content: '•';
          color: ${theme.primaryColor};
          position: absolute;
          left: 0;
          font-weight: bold;
        }
        
        blockquote {
          text-align: center;
          position: relative;
          font-style: italic;
          margin: 2rem 0;
        }
      </style>
    </head>
    <body>
      ${slidesHTML}
    </body>
    </html>
  `;
}

function renderSlideContent(slide: any, theme: any, textColor: string): string {
  const content = slide.content || {};
  
  switch (slide.type) {
    case 'title':
      return `
        <div style="text-align: center;">
          ${content.title ? `<h1 style="font-size: 3rem; font-weight: bold; margin-bottom: 1rem; color: ${textColor};">${content.title}</h1>` : ''}
          ${content.subtitle ? `<h2 style="font-size: 1.5rem; font-weight: 300; color: ${textColor};">${content.subtitle}</h2>` : ''}
        </div>
      `;
      
    case 'content':
      return `
        <div>
          ${content.title ? `<h2 style="font-size: 2rem; margin-bottom: 1rem; color: ${textColor};">${content.title}</h2>` : ''}
          ${content.text ? `<p style="font-size: 1.2rem; line-height: 1.6; color: ${textColor};">${content.text}</p>` : ''}
        </div>
      `;
      
    case 'bullets':
      return `
        <div>
          ${content.title ? `<h2 style="font-size: 2rem; margin-bottom: 1rem; color: ${textColor};">${content.title}</h2>` : ''}
          ${content.bullets ? `
            <ul style="font-size: 1.2rem; color: ${textColor};">
              ${content.bullets.map((bullet: string) => `<li>${bullet}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      `;
      
    case 'quote':
      return `
        <div style="text-align: center;">
          ${content.quote ? `
            <blockquote style="font-size: 1.8rem; color: ${textColor}; margin: 2rem 0;">
              "${content.quote}"
            </blockquote>
          ` : ''}
          ${content.author ? `<cite style="font-size: 1rem; color: ${textColor}; opacity: 0.8;">— ${content.author}</cite>` : ''}
        </div>
      `;
      
    case 'chart':
      return `
        <div style="text-align: center;">
          ${content.title ? `<h2 style="font-size: 2rem; margin-bottom: 1rem; color: ${textColor};">${content.title}</h2>` : ''}
          <div style="
            width: 400px;
            height: 300px;
            border: 2px dashed ${theme.primaryColor};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            color: ${textColor};
            background-color: ${theme.secondaryColor}20;
          ">
            📊 Gráfico ${content.chartType || 'bar'}
          </div>
        </div>
      `;
      
    default:
      return `
        <div style="text-align: center; font-size: 1.2rem; color: ${textColor};">
          ${slide.type} slide
        </div>
      `;
  }
}