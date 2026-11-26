"""Makes the two PDF manuals the page links to (dist/assets/manuals/admin.pdf, teacher.pdf) from the guides in the
server repository, so they say what the programs do now. Run it whenever docs/public changes:

    python scripts/build-manuals.py [path to gyomutalk-server]

The server repository defaults to the folder next to this one. Needs reportlab and pypdf (pip install reportlab pypdf)
and the Malgun Gothic font that comes with Windows."""
import datetime, re, sys
from pathlib import Path
from xml.sax.saxutils import escape
from pypdf import PdfReader
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, SimpleDocTemplate

site = Path(__file__).resolve().parent.parent
server = Path(sys.argv[1]) if len(sys.argv) > 1 else site.parent / 'gyomutalk-server'
guides = server / 'docs' / 'public'
target = site / 'dist' / 'assets' / 'manuals'
fonts = Path('C:/Windows/Fonts')
regular, symbol = TTFont('Korean', str(fonts / 'malgun.ttf')), TTFont('SegoeSymbol', str(fonts / 'seguisym.ttf'))
for font in (regular, TTFont('KoreanBold', str(fonts / 'malgunbd.ttf')), symbol): pdfmetrics.registerFont(font)
korean, symbols = regular.face.charToGlyph, symbol.face.charToGlyph

# Marks the guides use on screen (✕, ⊘) are not in Malgun Gothic and would print as blanks; they come from Segoe UI Symbol.
def marked(text):
    return ''.join(f'<font name="SegoeSymbol">{c}</font>' if ord(c) not in korean and ord(c) in symbols else c for c in text)

# The program's '맑은 청' colours (SchoolMessenger.Desktop/Theme.xaml): ink, accent, line, muted.
body = ParagraphStyle('body', fontName='Korean', fontSize=10, leading=17, wordWrap='CJK', textColor=HexColor('#0f1b2d'), spaceAfter=9)
title = ParagraphStyle('title', parent=body, fontName='KoreanBold', fontSize=23, leading=31, spaceAfter=22, textColor=HexColor('#2463eb'))
heading = ParagraphStyle('heading', parent=body, fontName='KoreanBold', fontSize=13, leading=21, spaceBefore=13, spaceAfter=8, keepWithNext=True)
day = datetime.date.today().strftime('%Y.%m.%d')

def footer(canvas, document):
    canvas.setStrokeColor(HexColor('#e3e8ef')); canvas.line(44, 42, A4[0] - 44, 42)
    canvas.setFont('Korean', 8); canvas.setFillColor(HexColor('#5b6b80'))
    canvas.drawString(44, 28, f'교무톡 | 사용 안내 · {day}'); canvas.drawRightString(A4[0] - 44, 28, str(document.page))

for name, web, needed in [('01_관리자_설치와운영', 'admin', '수강신청'), ('02_교직원_사용안내', 'teacher', '교체하지 않는 시간')]:
    text = (guides / f'{name}.md').read_text(encoding='utf-8').replace('\r\n', '\n')
    story = []
    for block in text.strip().split('\n\n'):
        for part in block.split('\n', 1) if block.startswith('#') else [block]:
            style = title if part.startswith('# ') else heading if part.startswith('## ') else body
            raw = re.sub(r'^#{1,2} ', '', part).replace('**', '').replace('`', '')
            story.append(Paragraph(marked(escape(raw)).replace('\n', '<br/>'), style))
    out = target / f'{web}.pdf'
    SimpleDocTemplate(str(out), pagesize=A4, leftMargin=44, rightMargin=44, topMargin=44, bottomMargin=60,
                      title=story[0].text if story else name, author='교무톡').build(story, onFirstPage=footer, onLaterPages=footer)
    pages = PdfReader(out).pages
    words = ''.join(p.extract_text() for p in pages)
    # Every page has text, and the manual tells of what the programs do now.
    assert all(p.extract_text().strip() for p in pages), out
    # Text pulled back out of a PDF breaks lines inside words, so spaces and line ends are left out of the comparison.
    assert re.sub(r'\s', '', needed) in re.sub(r'\s', '', words), f'{out}: {needed} is missing'
    print(out.name, len(pages), 'pages')
