// Central translation dictionary. Every public-facing string used by the
// site should route through here via the `t()` hook in LanguageContext —
// keeps translations centralized and makes gaps easy to spot (any key
// missing an `es` value falls back to `en` rather than breaking).

export const translations = {
  // --- Navbar ---
  "nav.home": { en: "Home", es: "Inicio" },
  "nav.solutions": { en: "Solutions", es: "Soluciones" },
  "nav.pricing": { en: "Pricing", es: "Precios" },
  "nav.about": { en: "About", es: "Nosotros" },
  "nav.contact": { en: "Contact", es: "Contacto" },
  "nav.learnDiy": { en: "Learn to DIY →", es: "Aprende a Hacerlo Tú Mismo →" },
  "nav.learnDiyMobile": { en: "Learn to DIY at the Academy →", es: "Aprende en la Academia →" },
  "nav.freeConsultation": { en: "Free AI Consultation", es: "Consulta Gratuita de IA" },

  // --- Hero ---
  "hero.badge": { en: "We Build AI Command Centers for Businesses", es: "Construimos Centros de Comando de IA para Empresas" },
  "hero.headline1": { en: "Your AI Workforce.", es: "Tu Equipo de IA." },
  "hero.headlineGradient": { en: "Built for Business.", es: "Hecho para tu Negocio." },
  "hero.subheadline": {
    en: "We build AI systems that automate customer support, lead generation, appointment booking, follow-ups, and business operations — so you can focus on growing your company.",
    es: "Creamos sistemas de IA que automatizan el soporte al cliente, la generación de clientes potenciales, la reserva de citas, los seguimientos y las operaciones comerciales — para que te enfoques en hacer crecer tu empresa.",
  },
  "hero.ctaSecondary": { en: "View Solutions", es: "Ver Soluciones" },
  "hero.trustLine": { en: "15–30 minute consultation • No obligation", es: "Consulta de 15–30 minutos • Sin compromiso" },
  "hero.assessmentLink": {
    en: "Not sure where to start? Take the Free AI Business Assessment →",
    es: "¿No sabes por dónde empezar? Realiza la Evaluación Gratuita de Negocio con IA →",
  },
  "hero.location": { en: "Houston, Texas", es: "Houston, Texas" },
  "hero.customBuilt": { en: "Custom-built AI systems", es: "Sistemas de IA hechos a medida" },
  "hero.fastDeployment": { en: "Fast, professional deployment", es: "Implementación rápida y profesional" },

  // --- Services section ---
  "services.eyebrow": { en: "Solutions", es: "Soluciones" },
  "services.title": { en: "AI systems built to run your business", es: "Sistemas de IA hechos para operar tu negocio" },
  "services.description": {
    en: "Every solution is custom-configured for your company — not a generic bot. Pick one, or combine them into a full command center.",
    es: "Cada solución está configurada a medida para tu empresa — no es un bot genérico. Elige una, o combínalas en un centro de comando completo.",
  },
  "services.getStarted": { en: "Free AI Consultation", es: "Consulta Gratuita de IA" },
  "services.buyStarterPackage": { en: "Buy Starter Package", es: "Comprar Paquete Inicial" },
  "services.freeConsultationQuote": {
    en: "Free Consultation / Custom Quote",
    es: "Consulta Gratuita / Cotización Personalizada",
  },
  "services.whatsIncluded": { en: "What's included at this price:", es: "Qué incluye este precio:" },
  "services.costDisclaimer": {
    en: "Additional features, integrations, users, locations, channels, automations, bilingual support, custom reporting, and ongoing support may increase the final cost.",
    es: "Funciones, integraciones, usuarios, ubicaciones, canales, automatizaciones, soporte bilingüe, reportes personalizados y soporte continuo adicionales pueden aumentar el costo final.",
  },
  "services.buyProcessing": { en: "Starting checkout…", es: "Iniciando el pago…" },
  "services.buyError": {
    en: "Something went wrong starting checkout. Please try again or request a free consultation.",
    es: "Algo salió mal al iniciar el pago. Intenta de nuevo o solicita una consulta gratuita.",
  },

  "services.chatbot.name": { en: "AI Website Chatbot", es: "Chatbot de IA para tu Sitio Web" },
  "services.chatbot.description": {
    en: "A tireless front-line assistant that greets, answers, and captures every visitor.",
    es: "Un asistente incansable que saluda, responde y capta a cada visitante.",
  },
  "services.booking.name": { en: "AI Appointment Booking Bot", es: "Bot de IA para Reservar Citas" },
  "services.booking.description": {
    en: "Let customers book themselves in — day or night — with zero back-and-forth.",
    es: "Permite que tus clientes agenden solos — de día o de noche — sin ida y vuelta.",
  },
  "services.leadgen.name": { en: "AI Lead Generation System", es: "Sistema de IA para Generar Clientes Potenciales" },
  "services.leadgen.description": {
    en: "Find, qualify, and nurture new business automatically, every single day.",
    es: "Encuentra, califica y cultiva nuevos negocios automáticamente, todos los días.",
  },
  "services.commandcenter.name": { en: "AI Business Command Center", es: "Centro de Comando de IA para tu Negocio" },
  "services.commandcenter.description": {
    en: "One executive dashboard that runs your entire operation on autopilot.",
    es: "Un panel ejecutivo que maneja toda tu operación en piloto automático.",
  },

  // Feature bullets — shared between the Services section and Pricing package cards
  "feature.answers24_7": { en: "Answers customer questions 24/7", es: "Responde preguntas de clientes las 24 horas" },
  "feature.capturesLeads": { en: "Captures leads", es: "Capta clientes potenciales" },
  "feature.handlesFaqs": { en: "Handles FAQs", es: "Responde preguntas frecuentes" },
  "feature.websiteIntegration": { en: "Website integration", es: "Integración con tu sitio web" },
  "feature.liveAiChat": { en: "Live AI chat", es: "Chat en vivo con IA" },
  "feature.emailNotifications": { en: "Email notifications", es: "Notificaciones por correo" },
  "feature.appointmentScheduling": { en: "Appointment scheduling", es: "Programación de citas" },
  "feature.calendarIntegration": { en: "Calendar integration", es: "Integración con calendario" },
  "feature.customerReminders": { en: "Customer reminders", es: "Recordatorios para clientes" },
  "feature.contactCapture": { en: "Contact capture", es: "Captura de contactos" },
  "feature.businessHours": { en: "Business hours", es: "Horario de atención" },
  "feature.leadDiscovery": { en: "Business lead discovery", es: "Descubrimiento de clientes potenciales" },
  "feature.contactManagement": { en: "Contact management", es: "Gestión de contactos" },
  "feature.leadQualification": { en: "Lead qualification", es: "Calificación de clientes potenciales" },
  "feature.pipelineTracking": { en: "Pipeline tracking", es: "Seguimiento de embudo de ventas" },
  "feature.followUpAutomation": { en: "Follow-up automation", es: "Automatización de seguimientos" },
  "feature.executiveDashboard": { en: "Executive dashboard", es: "Panel ejecutivo" },
  "feature.aiAssistant": { en: "AI Assistant", es: "Asistente de IA" },
  "feature.workflowAutomation": { en: "Workflow automation", es: "Automatización de flujos de trabajo" },
  "feature.leadManagement": { en: "Lead Management", es: "Gestión de clientes potenciales" },
  "feature.analytics": { en: "Analytics", es: "Análisis de datos" },
  "feature.reports": { en: "Reports", es: "Reportes" },
  "feature.businessInsights": { en: "Business insights", es: "Información estratégica del negocio" },

  // --- Services section: 6 new services (Priority 5 expansion to 10) ---
  "services.customerSupport.name": { en: "AI Customer Support System", es: "Sistema de IA de Atención al Cliente" },
  "services.customerSupport.description": {
    en: "Answers customer questions, organizes requests, and makes sure nothing falls through the cracks.",
    es: "Responde preguntas de clientes, organiza solicitudes y se asegura de que nada se pase por alto.",
  },
  "services.voiceAgent.name": { en: "AI Voice Receptionist and Phone Agent", es: "Recepcionista y Agente Telefónico de IA" },
  "services.voiceAgent.description": {
    en: "Answers your business calls, books appointments, and covers you after hours.",
    es: "Responde las llamadas de tu negocio, agenda citas y te cubre fuera de horario.",
  },
  "services.salesCrm.name": { en: "AI Sales and CRM Automation", es: "Automatización de Ventas y CRM con IA" },
  "services.salesCrm.description": {
    en: "Captures leads, keeps your pipeline current, and follows up so opportunities don't go cold.",
    es: "Capta clientes potenciales, mantiene tu embudo actualizado y da seguimiento para que las oportunidades no se enfríen.",
  },
  "services.estimatesInvoicing.name": { en: "AI Estimates, Invoices and Payment Follow-Up", es: "Estimados, Facturas y Seguimiento de Pagos con IA" },
  "services.estimatesInvoicing.description": {
    en: "Creates estimates, sends invoices, and follows up on payments automatically.",
    es: "Crea estimados, envía facturas y da seguimiento a los pagos automáticamente.",
  },
  "services.reputation.name": { en: "AI Reputation and Review Management", es: "Gestión de Reputación y Reseñas con IA" },
  "services.reputation.description": {
    en: "Requests reviews, watches your reputation, and flags unhappy customers early.",
    es: "Solicita reseñas, vigila tu reputación y detecta a clientes insatisfechos a tiempo.",
  },
  "services.employeeKnowledge.name": { en: "AI Employee Knowledge and Training Assistant", es: "Asistente de Conocimiento y Capacitación de Empleados con IA" },
  "services.employeeKnowledge.description": {
    en: "Answers employee questions from your own procedures and supports onboarding.",
    es: "Responde preguntas de empleados usando tus propios procedimientos y apoya la incorporación.",
  },

  "services.aiAgents.name": { en: "AI Agents for Business", es: "Agentes de IA para tu Negocio" },
  "services.aiAgents.description": {
    en: "A real custom AI agent built to work inside your business — not a simple chatbot. It can qualify leads, support customers, run multi-step workflows, connect to your tools and CRM, and follow up automatically, with human approval steps where you want them.",
    es: "Un agente de IA personalizado y real, construido para trabajar dentro de tu negocio — no un simple chatbot. Puede calificar clientes potenciales, apoyar a clientes, ejecutar flujos de trabajo de varios pasos, conectarse a tus herramientas y CRM, y hacer seguimiento automáticamente, con pasos de aprobación humana donde tú lo decidas.",
  },
  "services.securityHardening.name": { en: "AI & Business Data Security Hardening", es: "Fortalecimiento de Seguridad de Datos de IA y Negocio" },
  "services.securityHardening.description": {
    en: "A defensive security review and hardening pass on your AI systems and business data — credentials, access controls, secrets, integrations, and backup planning, reviewed and tightened.",
    es: "Una revisión defensiva de seguridad y fortalecimiento de tus sistemas de IA y datos de negocio — credenciales, controles de acceso, secretos, integraciones y planificación de respaldo, revisados y reforzados.",
  },
  "services.dataAnalytics.name": { en: "AI Data Analytics & Business Intelligence", es: "Análisis de Datos e Inteligencia de Negocio con IA" },
  "services.dataAnalytics.description": {
    en: "An owner-level dashboard that connects your business data, defines the KPIs that matter, and turns visitor, sales, and marketing activity into clear, automated reporting and AI-assisted insight.",
    es: "Un panel a nivel de propietario que conecta los datos de tu negocio, define los KPIs importantes, y convierte la actividad de visitantes, ventas y marketing en reportes claros y automatizados con información asistida por IA.",
  },

  // --- Website Development (separate from the AI Solutions catalog above) ---
  "services.websiteGroup.eyebrow": { en: "Website Development", es: "Desarrollo de Sitios Web" },
  "services.websiteGroup.title": {
    en: "Need a website too? Start here.",
    es: "¿También necesitas un sitio web? Empieza aquí.",
  },
  "services.websiteGroup.description": {
    en: "A professional website of your own — with a clear path to add AI automation on top of it whenever you're ready.",
    es: "Un sitio web profesional propio — con un camino claro para agregar automatización de IA cuando estés listo.",
  },
  "services.websiteBasic.name": { en: "Professional Business Website", es: "Sitio Web Profesional para tu Negocio" },
  "services.websiteBasic.description": {
    en: "A modern, professional business website built to look great and work properly across desktop, tablet, and mobile devices.",
    es: "Un sitio web moderno y profesional para tu negocio, hecho para verse bien y funcionar correctamente en computadora, tablet y celular.",
  },
  "services.websiteBasic.turnaround": {
    en: "Typical turnaround: 3–5 business days",
    es: "Tiempo típico de entrega: 3–5 días hábiles",
  },
  "services.websiteBasic.scopeNote": {
    en: "Starting price covers up to 5 core pages with standard functionality. Larger or more complex websites, ecommerce, memberships, extensive custom integrations, additional pages, or advanced functionality may require a custom quote.",
    es: "El precio inicial cubre hasta 5 páginas principales con funcionalidad estándar. Sitios web más grandes o complejos, tiendas en línea, membresías, integraciones personalizadas extensas, páginas adicionales o funciones avanzadas pueden requerir una cotización personalizada.",
  },
  "services.websiteAutomation.name": { en: "Website + AI Automation Package", es: "Paquete de Sitio Web + Automatización de IA" },
  "services.websiteAutomation.description": {
    en: "A professional business website combined with practical AI automation designed to help your business capture, respond to, and follow up with customers.",
    es: "Un sitio web profesional para tu negocio combinado con automatización de IA práctica, diseñada para ayudarte a captar, responder y dar seguimiento a tus clientes.",
  },
  "services.websiteAutomation.turnaround": {
    en: "Typical turnaround: 5–10 business days",
    es: "Tiempo típico de entrega: 5–10 días hábiles",
  },
  "services.websiteAutomation.scopeNote": {
    en: "Includes everything in the Professional Business Website package. Does not include the AI Voice Receptionist / Phone Agent — that stays available as a separate add-on. Third-party costs such as hosting, messaging, phone service, CRM subscriptions, AI usage, or other external platform fees may be separate unless specifically included in your project agreement.",
    es: "Incluye todo lo del paquete de Sitio Web Profesional. No incluye el Recepcionista Telefónico de IA — ese servicio se mantiene disponible por separado. Costos de terceros como hospedaje, mensajería, servicio telefónico, suscripciones de CRM, uso de IA u otras tarifas de plataformas externas pueden ser aparte, a menos que se incluyan específicamente en tu acuerdo de proyecto.",
  },
  "services.websiteAutomation.voiceUpsellNote": {
    en: "Want your phone calls answered by AI too? The AI Voice Receptionist / Phone Agent is available as a separate add-on.",
    es: "¿También quieres que la IA conteste tus llamadas? El Recepcionista Telefónico de IA está disponible como complemento por separado.",
  },
  "feature.customWebsiteDesign": { en: "Custom professional website design", es: "Diseño web profesional y personalizado" },
  "feature.responsiveAllDevices": { en: "Responsive on desktop, tablet, and mobile", es: "Adaptado a computadora, tablet y celular" },
  "feature.upToFiveCorePages": { en: "Up to 5 core pages", es: "Hasta 5 páginas principales" },
  "feature.contactAndLeadForms": { en: "Contact forms and lead-capture forms", es: "Formularios de contacto y captura de clientes potenciales" },
  "feature.basicSeoSetup": { en: "Basic SEO setup", es: "Configuración básica de SEO" },
  "feature.googleAnalyticsIntegration": { en: "Google Analytics integration", es: "Integración con Google Analytics" },
  "feature.socialMediaIntegration": { en: "Social media integration", es: "Integración con redes sociales" },
  "feature.domainSslSetup": { en: "Domain connection and SSL/security setup", es: "Conexión de dominio y configuración SSL/seguridad" },
  "feature.deploymentAndLaunch": { en: "Deployment and launch", es: "Publicación y lanzamiento" },
  "feature.postLaunchSupport30": { en: "30 days of post-launch support", es: "30 días de soporte posteriores al lanzamiento" },
  "feature.everythingInWebsiteBasic": {
    en: "Everything in the Professional Business Website package",
    es: "Todo lo del paquete de Sitio Web Profesional",
  },
  "feature.aiChatbotConfigured": {
    en: "Custom AI chatbot configured around your business, answering questions 24/7",
    es: "Chatbot de IA personalizado para tu negocio, respondiendo preguntas las 24 horas",
  },
  "feature.smartLeadCapture": {
    en: "Smart lead capture — name, phone, email, and service needs",
    es: "Captura inteligente de clientes potenciales — nombre, teléfono, correo y necesidad de servicio",
  },
  "feature.appointmentRequestRouting": {
    en: "Appointment request/booking integration where supported, with routing and business notifications",
    es: "Integración de solicitud de citas donde sea compatible, con enrutamiento y notificaciones al negocio",
  },
  "feature.automatedLeadFollowUp": {
    en: "Automated initial follow-up and customer confirmation messages",
    es: "Seguimiento inicial automatizado y mensajes de confirmación al cliente",
  },
  "feature.followUpWorkflowConfigured": {
    en: "Follow-up workflow configured around your sales process",
    es: "Flujo de seguimiento configurado según tu proceso de ventas",
  },
  "feature.crmEmailIntegrationSupported": {
    en: "Supported CRM/email integration where appropriate",
    es: "Integración compatible con CRM/correo cuando corresponda",
  },
  "feature.aiAutomationConsultation": {
    en: "AI automation consultation to identify further time-saving opportunities",
    es: "Consulta de automatización de IA para identificar más oportunidades de ahorrar tiempo",
  },

  "feature.answersSupportQuestions": { en: "Answers customer questions", es: "Responde preguntas de clientes" },
  "feature.organizesRequests": { en: "Organizes support requests", es: "Organiza solicitudes de soporte" },
  "feature.escalatesIssues": { en: "Escalates serious issues", es: "Escala problemas graves" },
  "feature.tracksFaqs": { en: "Tracks frequently asked questions", es: "Rastrea preguntas frecuentes" },
  "feature.identifiesGaps": { en: "Identifies missing answers", es: "Identifica respuestas faltantes" },

  "feature.answersCalls": { en: "Answers business calls", es: "Responde llamadas del negocio" },
  "feature.booksAppointmentsPhone": { en: "Books appointments", es: "Agenda citas" },
  "feature.takesMessages": { en: "Takes messages", es: "Toma mensajes" },
  "feature.qualifiesCallers": { en: "Qualifies callers", es: "Califica a quien llama" },
  "feature.afterHoursCoverage": { en: "After-hours coverage", es: "Cobertura fuera de horario" },

  "feature.capturesLeadsCrm": { en: "Captures leads", es: "Capta clientes potenciales" },
  "feature.organizesCustomerInfo": { en: "Organizes customer information", es: "Organiza información de clientes" },
  "feature.updatesPipeline": { en: "Updates sales pipelines", es: "Actualiza embudos de venta" },
  "feature.sendsFollowUps": { en: "Sends follow-up messages", es: "Envía mensajes de seguimiento" },
  "feature.tracksOpportunities": { en: "Tracks opportunities", es: "Rastrea oportunidades" },

  "feature.createsEstimates": { en: "Creates or organizes estimates", es: "Crea u organiza estimados" },
  "feature.sendsInvoices": { en: "Sends invoices", es: "Envía facturas" },
  "feature.paymentReminders": { en: "Sends payment reminders", es: "Envía recordatorios de pago" },
  "feature.tracksBalances": { en: "Tracks unpaid balances", es: "Rastrea saldos pendientes" },
  "feature.overdueAlerts": { en: "Notifies you about overdue payments", es: "Te notifica sobre pagos vencidos" },

  "feature.requestsReviews": { en: "Requests customer reviews", es: "Solicita reseñas de clientes" },
  "feature.monitorsFeedback": { en: "Monitors customer feedback", es: "Monitorea comentarios de clientes" },
  "feature.draftsResponses": { en: "Drafts professional responses", es: "Redacta respuestas profesionales" },
  "feature.alertsUnhappy": { en: "Alerts you about unhappy customers", es: "Te alerta sobre clientes insatisfechos" },
  "feature.organizesReputation": { en: "Organizes reputation activity", es: "Organiza la actividad de reputación" },

  "feature.answersEmployeeQuestions": { en: "Answers employee questions", es: "Responde preguntas de empleados" },
  "feature.searchesProcedures": { en: "Searches company procedures", es: "Busca en procedimientos de la empresa" },
  "feature.explainsPolicies": { en: "Explains policies", es: "Explica políticas" },
  "feature.supportsOnboarding": { en: "Supports employee onboarding", es: "Apoya la incorporación de empleados" },
  "feature.organizesTraining": { en: "Organizes training information", es: "Organiza información de capacitación" },

  "feature.toolApiIntegrations": { en: "Tool and API integrations", es: "Integraciones de herramientas y API" },
  "feature.crmIntegration": { en: "CRM integration", es: "Integración con CRM" },
  "feature.humanApprovalSteps": { en: "Human approval steps where needed", es: "Pasos de aprobación humana donde se necesiten" },
  "feature.securityReview": { en: "AI and business system security review", es: "Revisión de seguridad de sistemas de IA y negocio" },
  "feature.credentialProtection": { en: "Credential and API key protection", es: "Protección de credenciales y claves API" },
  "feature.accessControlReview": { en: "Access control review", es: "Revisión de control de acceso" },
  "feature.secretsConfiguration": { en: "Secrets and environment configuration", es: "Configuración de secretos y entorno" },
  "feature.promptInjectionMitigation": { en: "Prompt-injection risk mitigation", es: "Mitigación de riesgo de inyección de prompts" },
  "feature.backupRecoveryPlanning": { en: "Backup and recovery planning", es: "Planificación de respaldo y recuperación" },
  "feature.connectsDataSources": { en: "Connects your business data sources", es: "Conecta las fuentes de datos de tu negocio" },
  "feature.customOwnerDashboard": { en: "Custom owner dashboard", es: "Panel personalizado para el propietario" },
  "feature.definesKpis": { en: "Defines the KPIs that matter to you", es: "Define los KPIs que te importan" },
  "feature.salesRevenueAnalytics": { en: "Sales and revenue analytics", es: "Análisis de ventas e ingresos" },
  "feature.automatedReporting": { en: "Automated reporting", es: "Reportes automatizados" },
  "feature.aiAssistedInsights": { en: "AI-assisted business insights", es: "Información de negocio asistida por IA" },

  "services.monthlySupportFrom": { en: "Monthly support from", es: "Soporte mensual desde" },
  "services.consultOnlyNote": {
    en: "This service is available by consultation only — pricing is confirmed for your specific setup before anything is built.",
    es: "Este servicio está disponible solo por consulta — el precio se confirma para tu configuración específica antes de construir nada.",
  },
  "services.voiceUsageDisclaimer": {
    en: "Telephone, transcription, and AI usage charges may be billed separately from the setup and monthly support price.",
    es: "Los cargos de teléfono, transcripción y uso de IA pueden facturarse por separado del precio de configuración y soporte mensual.",
  },
  "services.crmSubscriptionDisclaimer": {
    en: "Paid CRM subscriptions and third-party software costs are not automatically included.",
    es: "Las suscripciones de CRM de pago y los costos de software de terceros no están incluidos automáticamente.",
  },
  "services.employeeUsageDisclaimer": {
    en: "Ongoing AI or API usage may be limited by plan or billed separately.",
    es: "El uso continuo de IA o API puede estar limitado por el plan o facturarse por separado.",
  },
  "services.aiAgentsCustomScopeNote": {
    en: "This starter price covers a single-agent implementation. Multiple agents, departments, locations, voice/SMS channels, custom APIs, databases, or CRM systems require a custom quote.",
    es: "Este precio inicial cubre una implementación de un solo agente. Múltiples agentes, departamentos, ubicaciones, canales de voz/SMS, APIs personalizadas, bases de datos o sistemas CRM requieren una cotización personalizada.",
  },
  "services.securityScopeDisclaimer": {
    en: "This is a defensive security review and hardening service for the systems we agree on together — not a guarantee of security, not professional penetration testing, and not a regulatory or compliance certification. Larger or custom security engagements require a custom quote.",
    es: "Este es un servicio defensivo de revisión y fortalecimiento de seguridad para los sistemas que acordemos juntos — no es una garantía de seguridad, no es una prueba de penetración profesional, ni una certificación regulatoria o de cumplimiento. Los proyectos de seguridad más grandes o personalizados requieren una cotización personalizada.",
  },
  "services.dataAnalyticsCustomScopeNote": {
    en: "This starter price covers a defined starter implementation. Multiple databases, CRMs, accounting systems, marketing platforms, locations, departments, custom integrations, data migration, or multiple dashboards require a custom quote.",
    es: "Este precio inicial cubre una implementación inicial definida. Múltiples bases de datos, CRMs, sistemas de contabilidad, plataformas de marketing, ubicaciones, departamentos, integraciones personalizadas, migración de datos o múltiples paneles requieren una cotización personalizada.",
  },

  // --- Pricing section ---
  "pricing.eyebrow": { en: "Pricing", es: "Precios" },
  "pricing.title": { en: "Simple packages. Real results.", es: "Paquetes simples. Resultados reales." },
  "pricing.description": {
    en: "Choose the package that matches where your business is today. Every system is built once and yours to keep.",
    es: "Elige el paquete que se ajusta a la etapa actual de tu negocio. Cada sistema se construye una vez y es tuyo para siempre.",
  },
  "pricing.starter.name": { en: "Starter Package", es: "Paquete Inicial" },
  "pricing.starter.tag": { en: "AI Website Chatbot", es: "Chatbot de IA para tu Sitio Web" },
  "pricing.starter.description": {
    en: "Perfect for businesses wanting an AI assistant on their website.",
    es: "Perfecto para negocios que quieren un asistente de IA en su sitio web.",
  },
  "pricing.growth.name": { en: "Growth Package", es: "Paquete de Crecimiento" },
  "pricing.growth.tag": { en: "Lead Generation & Follow-Ups", es: "Generación de Clientes y Seguimientos" },
  "pricing.growth.description": {
    en: "Perfect for businesses wanting more qualified leads.",
    es: "Perfecto para negocios que quieren más clientes potenciales calificados.",
  },
  "pricing.business.name": { en: "Business Package", es: "Paquete Empresarial" },
  "pricing.business.tag": { en: "Complete AI Command Center", es: "Centro de Comando de IA Completo" },
  "pricing.business.description": {
    en: "Perfect for businesses ready to automate multiple business processes.",
    es: "Perfecto para negocios listos para automatizar múltiples procesos.",
  },
  "pricing.mostPopular": { en: "Most Popular", es: "Más Popular" },
  "pricing.freeConsultation": { en: "Free AI Consultation", es: "Consulta Gratuita de IA" },

  "pricing.support.eyebrow": { en: "Ongoing Support", es: "Soporte Continuo" },
  "pricing.support.title": { en: "Monthly Support Plans", es: "Planes de Soporte Mensual" },
  "pricing.support.description": {
    en: "Keep your AI systems running smoothly, updated, and optimized long after launch.",
    es: "Mantén tus sistemas de IA funcionando sin problemas, actualizados y optimizados mucho después del lanzamiento.",
  },
  "pricing.support.choose": { en: "Choose", es: "Elegir" },

  "pricing.included.eyebrow": { en: "What's Included", es: "Qué Incluye" },
  "pricing.included.title": { en: "What's Included in Monthly Support & Hosting", es: "Qué Incluye el Soporte y Alojamiento Mensual" },
  "pricing.included.description": {
    en: "Every support plan keeps your AI system secure, current, and performing.",
    es: "Cada plan de soporte mantiene tu sistema de IA seguro, actualizado y funcionando bien.",
  },

  "pkgFeature.chatbot247": { en: "24/7 AI website chatbot", es: "Chatbot de IA en tu sitio web 24/7" },
  "pkgFeature.leadCapture": { en: "Lead capture built in", es: "Captura de clientes incorporada" },
  "pkgFeature.faqAutomation": { en: "FAQ automation", es: "Automatización de preguntas frecuentes" },
  "pkgFeature.emailNotifications": { en: "Email notifications", es: "Notificaciones por correo" },
  "pkgFeature.everythingStarter": { en: "Everything in Starter", es: "Todo lo del Paquete Inicial" },
  "pkgFeature.leadGenSystem": { en: "AI lead generation system", es: "Sistema de IA para generar clientes potenciales" },
  "pkgFeature.followUpSequences": { en: "Automated follow-up sequences", es: "Secuencias de seguimiento automatizadas" },
  "pkgFeature.pipelineTracking": { en: "Pipeline tracking", es: "Seguimiento de embudo de ventas" },
  "pkgFeature.everythingGrowth": { en: "Everything in Growth", es: "Todo lo del Paquete de Crecimiento" },
  "pkgFeature.execDashboard": { en: "Executive dashboard & AI Assistant", es: "Panel ejecutivo y Asistente de IA" },
  "pkgFeature.fullWorkflow": { en: "Full workflow automation", es: "Automatización completa de flujos de trabajo" },
  "pkgFeature.analyticsReports": { en: "Analytics, reports & insights", es: "Análisis, reportes e información estratégica" },

  "supportFeature.monitoring": { en: "System monitoring", es: "Monitoreo del sistema" },
  "supportFeature.healthCheck": { en: "Monthly health check", es: "Revisión mensual de estado" },
  "supportFeature.minorUpdates": { en: "Minor content updates", es: "Actualizaciones menores de contenido" },
  "supportFeature.emailSupport": { en: "Email support", es: "Soporte por correo" },
  "supportFeature.everythingBasic": { en: "Everything in Basic", es: "Todo lo del plan Básico" },
  "supportFeature.priorityResponse": { en: "Priority response times", es: "Tiempos de respuesta prioritarios" },
  "supportFeature.performanceReport": { en: "Monthly performance report", es: "Reporte mensual de rendimiento" },
  "supportFeature.workflowAdjustments": { en: "Workflow adjustments", es: "Ajustes a flujos de trabajo" },
  "supportFeature.everythingGrowth": { en: "Everything in Growth", es: "Todo lo del plan de Crecimiento" },
  "supportFeature.dedicatedLine": { en: "Dedicated support line", es: "Línea de soporte dedicada" },
  "supportFeature.ongoingOptimization": { en: "Ongoing optimization", es: "Optimización continua" },
  "supportFeature.quarterlyReview": { en: "Quarterly strategy review", es: "Revisión trimestral de estrategia" },

  "included.hosting.title": { en: "Secure Hosting", es: "Alojamiento Seguro" },
  "included.hosting.description": {
    en: "Your AI system runs on monitored, secure infrastructure — no separate hosting to manage.",
    es: "Tu sistema de IA funciona en infraestructura segura y monitoreada — sin necesidad de gestionar alojamiento por separado.",
  },
  "included.modelUpdates.title": { en: "AI Model Updates", es: "Actualizaciones de Modelos de IA" },
  "included.modelUpdates.description": {
    en: "Ongoing updates as the underlying AI models improve, so your system keeps getting sharper.",
    es: "Actualizaciones continuas a medida que mejoran los modelos de IA, para que tu sistema siga mejorando.",
  },
  "included.knowledgeBase.title": { en: "Knowledge Base Updates", es: "Actualizaciones de Base de Conocimiento" },
  "included.knowledgeBase.description": {
    en: "We keep your system's answers, services, and business details current as things change.",
    es: "Mantenemos actualizadas las respuestas, servicios y detalles de tu negocio a medida que cambian.",
  },
  "included.monitoring.title": { en: "Performance Monitoring", es: "Monitoreo de Rendimiento" },
  "included.monitoring.description": {
    en: "Continuous monitoring to catch slowdowns or issues before they affect your customers.",
    es: "Monitoreo continuo para detectar lentitud o problemas antes de que afecten a tus clientes.",
  },
  "included.bugFixes.title": { en: "Bug Fixes & Maintenance", es: "Corrección de Errores y Mantenimiento" },
  "included.bugFixes.description": {
    en: "Any issues that come up are diagnosed and resolved as part of your plan.",
    es: "Cualquier problema que surja se diagnostica y resuelve como parte de tu plan.",
  },
  "included.usageAnalytics.title": { en: "Usage Analytics", es: "Análisis de Uso" },
  "included.usageAnalytics.description": {
    en: "Visibility into how your AI system is performing and being used, month over month.",
    es: "Visibilidad de cómo se está usando y rindiendo tu sistema de IA, mes a mes.",
  },
  "included.emailSupport.title": { en: "Email Support", es: "Soporte por Correo" },
  "included.emailSupport.description": {
    en: "Direct email access to our team whenever you have a question or request.",
    es: "Acceso directo por correo a nuestro equipo cuando tengas una pregunta o solicitud.",
  },
  "included.prioritySupport.title": { en: "Priority Support", es: "Soporte Prioritario" },
  "included.prioritySupport.description": {
    en: "Faster response times and hands-on assistance on higher support tiers.",
    es: "Tiempos de respuesta más rápidos y asistencia práctica en los planes de soporte superiores.",
  },

  // --- Why Choose Us ---
  "why.eyebrow": { en: "Why Choose Us", es: "Por Qué Elegirnos" },
  "why.title": { en: "Built to earn your trust, not just your business", es: "Hecho para ganarnos tu confianza, no solo tu negocio" },
  "why.description": {
    en: "We treat every deployment like it's our own company depending on it.",
    es: "Tratamos cada implementación como si nuestra propia empresa dependiera de ella.",
  },
  "why.fastDeployment.title": { en: "Fast Deployment", es: "Implementación Rápida" },
  "why.fastDeployment.description": {
    en: "Your AI system goes live in days, not months — with clear milestones the whole way.",
    es: "Tu sistema de IA queda en funcionamiento en días, no meses — con hitos claros en todo el proceso.",
  },
  "why.custom.title": { en: "Custom-Built Solutions", es: "Soluciones Hechas a Medida" },
  "why.custom.description": {
    en: "No generic templates. Every system is configured around how your business actually operates.",
    es: "Sin plantillas genéricas. Cada sistema se configura según cómo realmente opera tu negocio.",
  },
  "why.support.title": { en: "Professional Support", es: "Soporte Profesional" },
  "why.support.description": {
    en: "A real team behind every deployment, ready to adjust and improve as your needs change.",
    es: "Un equipo real detrás de cada implementación, listo para ajustar y mejorar según cambian tus necesidades.",
  },
  "why.smallBusiness.title": { en: "Built for Small Business", es: "Hecho para Pequeños Negocios" },
  "why.smallBusiness.description": {
    en: "Enterprise-grade AI, priced and packaged for growing companies — not just Fortune 500s.",
    es: "IA de nivel empresarial, con precios y paquetes para empresas en crecimiento — no solo para grandes corporativos.",
  },
  "why.scalable.title": { en: "Scalable as You Grow", es: "Escalable a Medida que Creces" },
  "why.scalable.description": {
    en: "Start with one system and expand into a full command center whenever you're ready.",
    es: "Comienza con un sistema y expándete a un centro de comando completo cuando estés listo.",
  },
  "why.reliable.title": { en: "Reliable AI Automation", es: "Automatización de IA Confiable" },
  "why.reliable.description": {
    en: "Monitored, maintained, and built to keep working quietly in the background every day.",
    es: "Monitoreada, mantenida y construida para seguir funcionando en segundo plano todos los días.",
  },

  // --- About ---
  "about.eyebrow": { en: "About Command Center AI", es: "Sobre Command Center AI" },
  "about.title": { en: "Practical AI, built for real businesses", es: "IA práctica, hecha para negocios reales" },
  "about.paragraph1": {
    en: "Command Center AI builds practical AI solutions that help businesses automate customer communication, lead generation, appointment booking, follow-up, reporting, and daily operations.",
    es: "Command Center AI crea soluciones prácticas de IA que ayudan a los negocios a automatizar la comunicación con clientes, la generación de clientes potenciales, la reserva de citas, el seguimiento, los reportes y las operaciones diarias.",
  },
  "about.paragraph2": {
    en: "We focus on delivering real business value through professional AI systems that save time, improve customer experience, and help companies grow.",
    es: "Nos enfocamos en entregar valor real a través de sistemas de IA profesionales que ahorran tiempo, mejoran la experiencia del cliente y ayudan a las empresas a crecer.",
  },
  "about.quote": {
    en: "Every system we build has to earn its place in your business. That means it has to work quietly, reliably, and make an obvious difference — not just look impressive in a demo.",
    es: "Cada sistema que construimos tiene que ganarse su lugar en tu negocio. Eso significa que debe funcionar de forma silenciosa, confiable, y hacer una diferencia obvia — no solo verse impresionante en una demostración.",
  },
  "about.stat.coverage": { en: "AI Coverage", es: "Cobertura de IA" },
  "about.stat.coreSystems": { en: "Business AI Solutions", es: "Soluciones de IA para Empresas" },
  "about.stat.customConfigured": { en: "Custom Configured", es: "Configuración a Medida" },
  "about.founderTitle": { en: "Founder & Chief AI Systems Architect", es: "Fundador y Arquitecto Principal de Sistemas de IA" },
  "about.standard.heading": { en: "THE COMMAND CENTER AI STANDARD", es: "EL ESTÁNDAR DE COMMAND CENTER AI" },

  // --- Public business contact card (Contact section) — deliberately no
  // personal name, title, avatar, or personal phone number; see About.tsx
  // for the matching company-philosophy card treatment. ---
  "contact.card.company": { en: "Command Center AI", es: "Command Center AI" },
  "contact.card.formNote": {
    en: "Prefer to talk it through first? Use the free consultation form to your right.",
    es: "¿Prefieres hablarlo primero? Usa el formulario de consulta gratuita a tu derecha.",
  },

  // --- FAQ ---
  "faq.eyebrow": { en: "FAQ", es: "Preguntas Frecuentes" },
  "faq.title": { en: "Questions, answered", es: "Preguntas, respondidas" },
  "faq.q1": { en: "How long does setup take?", es: "¿Cuánto tiempo toma la configuración?" },
  "faq.a1": {
    en: "Most AI systems are configured and live within 5–10 business days, depending on the complexity of the solution and how quickly we can gather your business details (hours, services, integrations, etc.).",
    es: "La mayoría de los sistemas de IA se configuran y quedan en funcionamiento en 5–10 días hábiles, dependiendo de la complejidad de la solución y qué tan rápido podamos reunir los detalles de tu negocio (horarios, servicios, integraciones, etc.).",
  },
  "faq.q2": { en: "Can you customize the system?", es: "¿Pueden personalizar el sistema?" },
  "faq.a2": {
    en: "Yes. Every system is configured around your business — your services, your tone of voice, your booking rules, and your existing tools. Nothing is a generic, one-size-fits-all bot.",
    es: "Sí. Cada sistema se configura alrededor de tu negocio — tus servicios, tu tono de voz, tus reglas de reserva y tus herramientas existentes. Nada es un bot genérico de talla única.",
  },
  "faq.q3": { en: "Do you provide support?", es: "¿Ofrecen soporte?" },
  "faq.a3": {
    en: "Yes. Every project includes an onboarding period, and ongoing monthly support plans are available to keep your system monitored, updated, and optimized long-term.",
    es: "Sí. Cada proyecto incluye un período de incorporación, y hay planes de soporte mensual disponibles para mantener tu sistema monitoreado, actualizado y optimizado a largo plazo.",
  },
  "faq.q4": { en: "Do I own my system?", es: "¿Soy dueño de mi sistema?" },
  "faq.a4": {
    en: "Yes. Once built, the AI system is yours. Monthly support plans are optional and cover monitoring, updates, and optimization — they are not required for you to keep using what we build.",
    es: "Sí. Una vez construido, el sistema de IA es tuyo. Los planes de soporte mensual son opcionales y cubren monitoreo, actualizaciones y optimización — no son necesarios para que sigas usando lo que construimos.",
  },
  "faq.q5": { en: "Can it integrate with my existing software?", es: "¿Puede integrarse con mi software actual?" },
  "faq.a5": {
    en: "In most cases, yes. We regularly integrate with calendars, CRMs, websites, and messaging tools. Let us know what you're currently using and we'll confirm compatibility before we start.",
    es: "En la mayoría de los casos, sí. Integramos regularmente con calendarios, CRMs, sitios web y herramientas de mensajería. Cuéntanos qué usas actualmente y confirmaremos la compatibilidad antes de comenzar.",
  },
  "faq.q6": { en: "What if I want to learn to build this myself instead?", es: "¿Qué pasa si prefiero aprender a construirlo yo mismo?" },
  "faq.a6": {
    en: "That's what Command Center AI Academy is for. Command Center AI builds AI systems for you; the Academy teaches you to build them yourself. Visit CommandCenterAIAcademy.com to learn more.",
    es: "Para eso está Command Center AI Academy. Command Center AI construye sistemas de IA para ti; la Academia te enseña a construirlos tú mismo. Visita CommandCenterAIAcademy.com para saber más.",
  },

  // --- Contact ---
  "contact.eyebrow": { en: "Contact", es: "Contacto" },
  "contact.title": { en: "Schedule Your Free AI Consultation", es: "Agenda tu Consulta Gratuita de IA" },
  "contact.description": {
    en: "Tell us about your business and we'll recommend the best AI solution for your goals, budget, and workflow.",
    es: "Cuéntanos sobre tu negocio y te recomendaremos la mejor solución de IA para tus metas, presupuesto y flujo de trabajo.",
  },
  "contact.form.name": { en: "Name", es: "Nombre" },
  "contact.form.namePlaceholder": { en: "Your name", es: "Tu nombre" },
  "contact.form.email": { en: "Email", es: "Correo electrónico" },
  "contact.form.phone": { en: "Phone", es: "Teléfono" },
  "contact.form.company": { en: "Company", es: "Empresa" },
  "contact.form.companyPlaceholder": { en: "Your business", es: "Tu negocio" },
  "contact.form.message": { en: "What do you want to automate?", es: "¿Qué te gustaría automatizar?" },
  "contact.form.messagePlaceholder": {
    en: "Tell us a bit about your business and what you're hoping to automate...",
    es: "Cuéntanos un poco sobre tu negocio y qué te gustaría automatizar...",
  },
  "contact.form.submit": { en: "Free AI Consultation", es: "Consulta Gratuita de IA" },
  "contact.form.sending": { en: "Sending…", es: "Enviando…" },
  "contact.form.success": { en: "Thanks! We'll be in touch shortly.", es: "¡Gracias! Nos pondremos en contacto pronto." },
  "contact.form.errorRequired": { en: "Name, email, and message are required.", es: "Nombre, correo y mensaje son obligatorios." },
  "contact.form.errorEmail": { en: "Please provide a valid email address.", es: "Por favor ingresa un correo electrónico válido." },
  "contact.form.errorGeneric": { en: "Something went wrong. Please try again.", es: "Algo salió mal. Por favor intenta de nuevo." },
  "contact.form.errorRateLimit": {
    en: "Too many requests. Please try again in a few minutes.",
    es: "Demasiadas solicitudes. Por favor intenta de nuevo en unos minutos.",
  },

  // --- Footer ---
  "footer.tagline": { en: "We Build AI Command Centers for Businesses.", es: "Construimos Centros de Comando de IA para Empresas." },
  "footer.taglineSecondary": { en: "Operate Smarter. Scale Faster.", es: "Opera de Forma Más Inteligente. Escala Más Rápido." },
  "footer.navigate": { en: "Navigate", es: "Navegación" },
  "footer.contact": { en: "Contact", es: "Contacto" },
  "footer.assessment": { en: "Free AI Business Assessment", es: "Evaluación Gratuita de Negocio con IA" },
  "footer.academy": { en: "Command Center AI Academy (Learn to DIY)", es: "Command Center AI Academy (Aprende Tú Mismo)" },
  "footer.privacy": { en: "Privacy Policy", es: "Política de Privacidad" },
  "footer.terms": { en: "Terms of Service", es: "Términos de Servicio" },
  "footer.refund": { en: "Refund Policy", es: "Política de Reembolsos" },
  "footer.rights": { en: "All rights reserved.", es: "Todos los derechos reservados." },

  // --- Purchase with Confidence ---
  "confidence.title": { en: "Purchase with Confidence", es: "Compra con Confianza" },
  "confidence.point1.title": { en: "Processed securely by Stripe", es: "Procesado de forma segura por Stripe" },
  "confidence.point1.description": {
    en: "Payments are handled entirely by Stripe, a PCI Level 1 certified payment processor used by millions of businesses worldwide.",
    es: "Los pagos son gestionados completamente por Stripe, un procesador de pagos certificado PCI Nivel 1 utilizado por millones de negocios en todo el mundo.",
  },
  "confidence.point2.title": { en: "Your card details go straight to Stripe", es: "Los datos de tu tarjeta van directo a Stripe" },
  "confidence.point2.description": {
    en: "Full card information is submitted directly to Stripe's secure servers — it never passes through or touches Command Center AI's systems.",
    es: "La información completa de tu tarjeta se envía directamente a los servidores seguros de Stripe — nunca pasa por, ni toca, los sistemas de Command Center AI.",
  },
  "confidence.point3.title": { en: "We never store your card information", es: "Nunca almacenamos la información de tu tarjeta" },
  "confidence.point3.description": {
    en: "Command Center AI does not store, log, or have access to your full card number, CVV, or expiration date, at any point.",
    es: "Command Center AI no almacena, registra ni tiene acceso a tu número de tarjeta completo, CVV o fecha de vencimiento, en ningún momento.",
  },
  "confidence.point4.title": { en: "Industry-standard protection", es: "Protección estándar de la industria" },
  "confidence.point4.description": {
    en: "Your personal and payment information is protected using the same encryption and security standards banks rely on.",
    es: "Tu información personal y de pago está protegida con los mismos estándares de encriptación y seguridad en los que confían los bancos.",
  },

  // --- Checkout options ---
  "checkout.plan.full.label": { en: "Pay in Full", es: "Pagar de Contado" },
  "checkout.plan.full.description": { en: "One payment, nothing else due at setup.", es: "Un solo pago, nada más se debe al inicio." },
  "checkout.plan.deposit.label": { en: "Deposit + Balance", es: "Depósito + Saldo" },
  "checkout.plan.deposit.description": {
    en: "25% now to reserve your build slot, credited toward your final price. Remaining balance is invoiced once scope is confirmed.",
    es: "25% ahora para reservar tu turno de construcción, se acredita a tu precio final. El saldo restante se factura una vez confirmado el alcance.",
  },
  "checkout.plan.monthly.label": { en: "Monthly Plan", es: "Plan Mensual" },
  "checkout.plan.monthly.description": {
    en: "Spread the setup cost across a monthly payment plan.",
    es: "Distribuye el costo de configuración en un plan de pago mensual.",
  },
  "checkout.proceedButton": { en: "Proceed to Secure Checkout", es: "Continuar al Pago Seguro" },
  "checkout.redirecting": { en: "Redirecting to secure checkout…", es: "Redirigiendo al pago seguro…" },
  "checkout.disclaimer": {
    en: "Payment is handled entirely by Stripe's secure, hosted checkout. Command Center AI never sees or stores your card details.",
    es: "El pago es gestionado completamente por el sistema de pago seguro de Stripe. Command Center AI nunca ve ni almacena los datos de tu tarjeta.",
  },
  "checkout.errorGeneric": { en: "Could not start checkout. Please try again.", es: "No se pudo iniciar el pago. Por favor intenta de nuevo." },

  // --- Checkout success/cancel pages ---
  "checkoutSuccess.processingBadge": { en: "Processing", es: "Procesando" },
  "checkoutSuccess.confirmedBadge": { en: "Payment Received", es: "Pago Recibido" },
  "checkoutSuccess.processingTitle": { en: "Confirming your payment…", es: "Confirmando tu pago…" },
  "checkoutSuccess.confirmedTitle": { en: "Thank you — you're all set.", es: "Gracias — todo está listo." },
  "checkoutSuccess.processingBody": {
    en: "Stripe is finalizing your payment confirmation — this usually takes just a few seconds. Refresh this page in a moment, or check your email for a receipt.",
    es: "Stripe está finalizando la confirmación de tu pago — esto normalmente toma solo unos segundos. Actualiza esta página en un momento, o revisa tu correo para el recibo.",
  },
  "checkoutSuccess.confirmedBody": {
    en: "Your payment has been confirmed and your onboarding checklist has been created. We'll be in touch shortly with next steps.",
    es: "Tu pago ha sido confirmado y tu lista de incorporación ha sido creada. Nos pondremos en contacto pronto con los siguientes pasos.",
  },
  "checkoutSuccess.backHome": { en: "Back to Home", es: "Volver al Inicio" },
  "checkoutCancel.badge": { en: "Checkout Cancelled", es: "Pago Cancelado" },
  "checkoutCancel.title": { en: "No charge was made", es: "No se realizó ningún cargo" },
  "checkoutCancel.body": {
    en: "Your checkout was cancelled and nothing was charged. You can pick up where you left off any time.",
    es: "Tu pago fue cancelado y no se realizó ningún cargo. Puedes retomar donde lo dejaste en cualquier momento.",
  },

  // --- Trust & Security section ---
  "trust.eyebrow": { en: "Trust & Security", es: "Confianza y Seguridad" },
  "trust.title": { en: "Purchase with confidence", es: "Compra con confianza" },
  "trust.description": {
    en: "Here's exactly how your payment and information are handled — no vague promises, just how it actually works.",
    es: "Así es exactamente cómo se manejan tu pago e información — sin promesas vagas, solo cómo funciona realmente.",
  },
  "trust.payments.title": { en: "Secure Payments", es: "Pagos Seguros" },
  "trust.payments.body": {
    en: "All payments are processed securely through Stripe, a payment processor used by millions of businesses worldwide.",
    es: "Todos los pagos se procesan de forma segura a través de Stripe, un procesador de pagos utilizado por millones de empresas en todo el mundo.",
  },
  "trust.checkout.title": { en: "Secure Checkout", es: "Pago Seguro" },
  "trust.checkout.body": {
    en: "Checkout happens on Stripe's own secure payment page. Your full card number and CVV are submitted directly to Stripe and are never received or stored on Command Center AI's servers.",
    es: "El pago se realiza en la propia página de pago segura de Stripe. El número completo de tu tarjeta y el CVV se envían directamente a Stripe y nunca se reciben ni se almacenan en los servidores de Command Center AI.",
  },
  "trust.customerInfo.title": { en: "Customer Information", es: "Información del Cliente" },
  "trust.customerInfo.body": {
    en: "Information you voluntarily share through our contact, consultation, purchase, or onboarding forms is stored so our team can follow up and deliver your project — never sold, and never shared beyond what's needed to serve you.",
    es: "La información que compartes voluntariamente a través de nuestros formularios de contacto, consulta, compra u onboarding se almacena para que nuestro equipo pueda dar seguimiento y entregar tu proyecto — nunca se vende, ni se comparte más allá de lo necesario para atenderte.",
  },
  "trust.support.title": { en: "Customer Support", es: "Atención al Cliente" },
  "trust.support.body": {
    en: "Questions before or after purchasing? Reach out any time through the contact form below or our chat assistant — a real person reviews every inquiry.",
    es: "¿Preguntas antes o después de comprar? Contáctanos en cualquier momento a través del formulario de contacto o nuestro asistente de chat — una persona real revisa cada consulta.",
  },
  "trust.poweredByStripe": { en: "Secure checkout powered by Stripe", es: "Pago seguro impulsado por Stripe" },

  // --- Academy callout ---
  "academy.title": { en: "Prefer to build it yourself?", es: "¿Prefieres construirlo tú mismo?" },
  "academy.description": {
    en: "Command Center AI builds your AI systems for you. Command Center AI Academy teaches you to build them yourself.",
    es: "Command Center AI construye tus sistemas de IA por ti. Command Center AI Academy te enseña a construirlos tú mismo.",
  },
  "academy.button": { en: "Visit the Academy", es: "Visitar la Academia" },

  // --- What Happens After You Purchase ---
  "afterPurchase.eyebrow": { en: "The Process", es: "El Proceso" },
  "afterPurchase.title": { en: "What happens after you purchase", es: "Qué sucede después de tu compra" },
  "afterPurchase.description": {
    en: "A clear, five-step path from purchase to a live system — no guesswork about what happens next.",
    es: "Un camino claro de cinco pasos, desde la compra hasta un sistema en funcionamiento — sin adivinar qué sigue.",
  },
  "afterPurchase.step1.title": { en: "Business Review", es: "Revisión del Negocio" },
  "afterPurchase.step1.body": {
    en: "We review your goals, workflow, existing tools, and the system you purchased.",
    es: "Revisamos tus objetivos, flujo de trabajo, herramientas existentes y el sistema que compraste.",
  },
  "afterPurchase.step2.title": { en: "System Setup", es: "Configuración del Sistema" },
  "afterPurchase.step2.body": {
    en: "We configure your AI system around your actual business process.",
    es: "Configuramos tu sistema de IA según el proceso real de tu negocio.",
  },
  "afterPurchase.step3.title": { en: "Integration & Testing", es: "Integración y Pruebas" },
  "afterPurchase.step3.body": {
    en: "Approved platforms, accounts, and workflows are connected and tested before launch.",
    es: "Las plataformas, cuentas y flujos de trabajo aprobados se conectan y se prueban antes del lanzamiento.",
  },
  "afterPurchase.step4.title": { en: "Launch", es: "Lanzamiento" },
  "afterPurchase.step4.body": {
    en: "Once testing and required client approvals are complete, the system is deployed.",
    es: "Una vez completadas las pruebas y las aprobaciones necesarias del cliente, el sistema se implementa.",
  },
  "afterPurchase.step5.title": { en: "Ongoing Support", es: "Soporte Continuo" },
  "afterPurchase.step5.body": {
    en: "Optional support plans keep the system monitored, maintained, updated, and optimized.",
    es: "Los planes de soporte opcionales mantienen el sistema monitoreado, mantenido, actualizado y optimizado.",
  },
  "afterPurchase.timeline": {
    en: "Typical setup for most starter systems is approximately 5–10 business days, depending on complexity, integrations, and how quickly required information or account access is provided.",
    es: "La configuración típica para la mayoría de los sistemas iniciales es de aproximadamente 5–10 días hábiles, dependiendo de la complejidad, las integraciones y la rapidez con la que se proporcione la información o el acceso a cuentas requerido.",
  },

  // --- Free AI Business Assessment secondary CTA (reused in multiple spots) ---
  "assessment.secondaryCta": {
    en: "Not sure which AI system fits your business? Take the Free AI Business Assessment.",
    es: "¿No sabes qué sistema de IA se adapta a tu negocio? Realiza la Evaluación Gratuita de Negocio con IA.",
  },
  "assessment.secondaryCta.link": { en: "Take the Free AI Business Assessment →", es: "Realiza la Evaluación Gratuita →" },

  // --- Pricing clarification ---
  "pricing.scopeClarification": {
    en: "Starter pricing covers the scope shown. Additional integrations, locations, channels, users, advanced automation, or custom development may require a custom quote.",
    es: "El precio inicial cubre el alcance mostrado. Integraciones adicionales, ubicaciones, canales, usuarios, automatización avanzada o desarrollo personalizado pueden requerir una cotización personalizada.",
  },

  // --- Large AI Assistant panel ---
  "assistant.headline": { en: "Meet Your Command Center AI Assistant", es: "Conoce a tu Asistente de Command Center AI" },
  "assistant.greeting": {
    en: "Hi, I can help you find the right automation, answer questions, run your AI Business Audit, and book a consultation.",
    es: "Hola, puedo ayudarte a encontrar la automatización adecuada, responder preguntas, realizar tu Auditoría de Negocio con IA y agendar una consulta.",
  },
  "assistant.close": { en: "Close assistant", es: "Cerrar asistente" },
  "assistant.quickActions.overview": { en: "Get an Overview", es: "Ver una Descripción General" },
  "assistant.quickActions.useCases": { en: "See Business Use Cases", es: "Ver Casos de Uso" },
  "assistant.quickActions.audit": { en: "Take the AI Business Audit", es: "Realizar la Auditoría de IA" },
  "assistant.quickActions.book": { en: "Book a Consultation", es: "Agendar una Consulta" },
  "assistant.chatTab": { en: "Chat", es: "Chat" },
  "assistant.bookingTab": { en: "Book a Consultation", es: "Agendar una Consulta" },
  "assistant.bookingTitle": { en: "Book Your Free AI Consultation", es: "Agenda tu Consulta Gratuita de IA" },
  "assistant.bookingSubtitle": {
    en: "Tell us a bit about your business — the same team that answers here will follow up.",
    es: "Cuéntanos un poco sobre tu negocio — el mismo equipo que responde aquí te dará seguimiento.",
  },
  "assistant.launcherLabel": { en: "Chat with Command Center AI", es: "Chatea con Command Center AI" },
} as const;

export type TranslationKey = keyof typeof translations;
