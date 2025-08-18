cat > prisma/seed.js << 'EOF'
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Creando datos de prueba...');
  
  const tasks = [
    {
      title: 'Implementar componente de dashboard',
      description: 'Desarrollar el dashboard principal con React',
      status: 'En Progreso',
      assignee: 'Ana García'
    },
    {
      title: 'Configurar API de autenticación',
      description: 'Implementar JWT authentication',
      status: 'Completada',
      assignee: 'Carlos Mendez'
    },
    {
      title: 'Integrar notificaciones push',
      description: 'Servicio de notificaciones en tiempo real',
      status: 'Bloqueada',
      assignee: 'Carlos Mendez'
    },
    {
      title: 'Setup CI/CD pipeline',
      description: 'Pipeline de integración continua',
      status: 'Bloqueada',
      assignee: 'David Silva'
    },
    {
      title: 'Diseñar interfaz móvil',
      description: 'Wireframes responsive para móviles',
      status: 'En Progreso',
      assignee: 'Ana García'
    },
    {
      title: 'Escribir pruebas automatizadas',
      description: 'Suite de pruebas con Jest',
      status: 'Pendiente',
      assignee: 'Roberto Vega'
    }
  ];

  for (const taskData of tasks) {
    const task = await prisma.task.create({
      data: taskData
    });
    console.log(`✅ ${task.title} - ${task.status}`);
  }

  console.log('\n🎉 Datos creados exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
EOF