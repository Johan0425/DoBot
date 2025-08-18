const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const seedData = {
  // Usuarios realistas del equipo
  users: [
    { name: 'Ana García', email: 'ana.garcia@dobot.dev', role: 'Frontend Developer' },
    { name: 'Carlos Mendez', email: 'carlos.mendez@dobot.dev', role: 'Backend Developer' },
    { name: 'María Rodriguez', email: 'maria.rodriguez@dobot.dev', role: 'Full Stack Developer' },
    { name: 'David Silva', email: 'david.silva@dobot.dev', role: 'DevOps Engineer' },
    { name: 'Roberto Vega', email: 'roberto.vega@dobot.dev', role: 'QA Engineer' }
  ],

  // Tareas realistas con diferentes estados
  tasks: [
    {
      title: 'Implementar componente de dashboard',
      description: 'Desarrollar el dashboard principal con React y Tailwind CSS',
      status: 'En Progreso',
      assignee: 'Ana García',
      priority: 'Alta'
    },
    {
      title: 'Configurar API de autenticación',
      description: 'Implementar JWT authentication con middleware de seguridad',
      status: 'Completada',
      assignee: 'Carlos Mendez',
      priority: 'Alta'
    },
    {
      title: 'Integrar notificaciones push',
      description: 'Desarrollar servicio de notificaciones en tiempo real',
      status: 'Bloqueada',
      assignee: 'Carlos Mendez',
      priority: 'Media'
    },
    {
      title: 'Diseñar interfaz móvil',
      description: 'Crear wireframes responsive para dispositivos móviles',
      status: 'En Progreso',
      assignee: 'Ana García',
      priority: 'Media'
    },
    {
      title: 'Setup CI/CD pipeline',
      description: 'Configurar pipeline de integración continua con GitHub Actions',
      status: 'Bloqueada',
      assignee: 'David Silva',
      priority: 'Alta'
    },
    {
      title: 'Escribir pruebas automatizadas',
      description: 'Desarrollar suite de pruebas con Jest y Cypress',
      status: 'Pendiente',
      assignee: 'Roberto Vega',
      priority: 'Media'
    },
    {
      title: 'Optimizar consultas de base de datos',
      description: 'Mejorar performance de queries con índices y optimizaciones',
      status: 'Pendiente',
      assignee: 'María Rodriguez',
      priority: 'Baja'
    }
  ]
};

async function main() {
  console.log('🌱 Iniciando seed de datos realistas...');
  
  // Crear tareas directamente (asumiendo que tu modelo es simple)
  for (const taskData of seedData.tasks) {
    const task = await prisma.task.create({
      data: {
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        assignee: taskData.assignee,
        priority: taskData.priority,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    console.log(`✅ Tarea creada: ${task.title} - ${task.status}`);
  }

  // Mostrar estadísticas
  const stats = {
    total: await prisma.task.count(),
    completed: await prisma.task.count({ where: { status: 'Completada' } }),
    inProgress: await prisma.task.count({ where: { status: 'En Progreso' } }),
    blocked: await prisma.task.count({ where: { status: 'Bloqueada' } }),
    pending: await prisma.task.count({ where: { status: 'Pendiente' } })
  };

  console.log('\n📊 Estadísticas:');
  console.log(`📝 Total: ${stats.total}`);
  console.log(`✅ Completadas: ${stats.completed}`);
  console.log(`🔄 En Progreso: ${stats.inProgress}`);
  console.log(`🚫 Bloqueadas: ${stats.blocked}`);
  console.log(`⏳ Pendientes: ${stats.pending}`);
  console.log('\n🎉 Seed completado! Ya puedes probar el AI Agent.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
