const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Criar Usuário Admin
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@medcore.com.br' },
    update: {
      password: hashedPassword
    },
    create: {
      email: 'admin@medcore.com.br',
      password: hashedPassword,
      fullName: 'Dr. Felipe Azevedo',
      role: 'admin',
    },
  });
  
  console.log('Usuário admin criado:', user.email);

  // Criar Módulos do Sistema Padrões
  const modulos = ['IA_Amelia', 'Agendamento', 'TISS', 'WhatsApp'];
  for (const m of modulos) {
    await prisma.systemModule.upsert({
      where: { id: m },
      update: {},
      create: {
        id: m,
        name: m,
        isEnabled: true
      }
    });
  }
  
  console.log('Módulos padrão criados');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
