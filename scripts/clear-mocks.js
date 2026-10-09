const fs = require('fs');
const path = require('path');

const files = [
  'src/app/dashboard/units/page.tsx',
  'src/app/dashboard/processes/page.tsx',
  'src/app/dashboard/legal/page.tsx',
  'src/app/dashboard/kanban/page.tsx',
  'src/app/dashboard/agenda/page.tsx',
  'src/app/dashboard/email/page.tsx',
];

for (const file of files) {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Expressões regulares para achar os arrays de mock
    content = content.replace(/const initialUnits[\s\S]*?=\s*\[[\s\S]*?\];/, 'const initialUnits: Unit[] = [];');
    content = content.replace(/const INITIAL_MEETINGS[\s\S]*?=\s*\[[\s\S]*?\];/, 'const INITIAL_MEETINGS: Meeting[] = [];');
    content = content.replace(/const INITIAL: LegalProcess\[\]\s*=\s*\[[\s\S]*?\];/, 'const INITIAL: LegalProcess[] = [];');
    content = content.replace(/const initialCards[\s\S]*?=\s*\[[\s\S]*?\];/, 'const initialCards: KanbanCard[] = [];');
    content = content.replace(/const initialEvents[\s\S]*?=\s*\[[\s\S]*?\];/, 'const initialEvents: AgendaEvent[] = [];');
    content = content.replace(/const MOCK_EMAILS[\s\S]*?=\s*\[[\s\S]*?\];/, 'const MOCK_EMAILS: Email[] = [];');
    
    fs.writeFileSync(filePath, content);
    console.log('Cleared mocks in ' + file);
  }
}

// Reports page needs hardcoded strings replaced
const reportsPath = path.join(__dirname, '..', 'src/app/dashboard/reports/page.tsx');
if (fs.existsSync(reportsPath)) {
  let content = fs.readFileSync(reportsPath, 'utf8');
  content = content.replace(/value="R\$ 1\.2M"/g, 'value="R$ 0,00"');
  content = content.replace(/value="1,284"/g, 'value="0"');
  content = content.replace(/value="68%"/g, 'value="0%"');
  content = content.replace(/value="342"/g, 'value="0"');
  content = content.replace(/\[45, 60, 40, 85, 70, 95, 65, 80, 55, 90, 75, 100\]/g, '[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]');
  content = content.replace(/\[1, 2, 3, 4, 5\]\.map/g, '[].map');
  content = content.replace(/"Aumente a alocação em Cardiologia nas terças-feiras para otimizar o fluxo de receita em até 12.5%."/g, '"Aguardando volume de dados para gerar insights de alocação de receita."');
  content = content.replace(/\[\s*{\s*label:\s*"Cardiologia"[\s\S]*?\]/g, '[]');
  
  fs.writeFileSync(reportsPath, content);
  console.log('Cleared mocks in reports');
}
